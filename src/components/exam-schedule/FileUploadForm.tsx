import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker with correct CDN URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadFormProps {
    onFileSelect: (file: File) => void;
    onCancel: () => void;
    isUploading?: boolean;
    onExtractedData?: (entries: any[]) => void;
}

interface ExtractedEntry {
    date: string;
    time: string;
    subject: string;
    syllabus: string;
}

export function FileUploadForm({ onFileSelect, onCancel, isUploading, onExtractedData }: FileUploadFormProps) {
    const { user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
    const [extractedEntries, setExtractedEntries] = useState<ExtractedEntry[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file: File) => {
        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a PDF or Word document');
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setUploadStatus('idle');
        setExtractedEntries([]);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setExtractedEntries([]);
        setIsEditing(false);
    };

    // Extract text from PDF
    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    };

    // Parse exam schedule from extracted text
    const parseExamSchedule = (text: string): ExtractedEntry[] => {
        const entries: ExtractedEntry[] = [];
        const lines = text.split('\n').filter(line => line.trim());

        // Common date patterns
        const datePatterns = [
            /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/g,  // DD/MM/YYYY or DD-MM-YYYY
            /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/g,    // YYYY/MM/DD
            /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})/gi
        ];

        // Time pattern
        const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[-–]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/gi;

        // Subject keywords (common exam subjects)
        const subjectKeywords = [
            'Mathematics', 'Math', 'Physics', 'Chemistry', 'Biology', 'English',
            'Hindi', 'Science', 'Social', 'History', 'Geography', 'Economics',
            'Computer', 'IT', 'Tamil', 'Telugu', 'Sanskrit'
        ];

        let currentEntry: Partial<ExtractedEntry> = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Try to find date
            for (const pattern of datePatterns) {
                const dateMatch = line.match(pattern);
                if (dateMatch) {
                    // If we have a current entry, save it
                    if (currentEntry.date && currentEntry.subject) {
                        entries.push({
                            date: currentEntry.date,
                            time: currentEntry.time || '09:00 - 12:00',
                            subject: currentEntry.subject,
                            syllabus: currentEntry.syllabus || ''
                        });
                    }

                    // Start new entry
                    try {
                        const parsedDate = new Date(dateMatch[0]);
                        if (!isNaN(parsedDate.getTime())) {
                            currentEntry = {
                                date: format(parsedDate, 'yyyy-MM-dd')
                            };
                        }
                    } catch (e) {
                        // If parsing fails, use current date
                        currentEntry = {
                            date: format(new Date(), 'yyyy-MM-dd')
                        };
                    }
                    break;
                }
            }

            // Try to find time
            const timeMatch = line.match(timePattern);
            if (timeMatch && currentEntry.date) {
                currentEntry.time = timeMatch[0];
            }

            // Try to find subject
            for (const subject of subjectKeywords) {
                if (line.toLowerCase().includes(subject.toLowerCase())) {
                    currentEntry.subject = subject;

                    // Try to extract syllabus (text after subject)
                    const subjectIndex = line.toLowerCase().indexOf(subject.toLowerCase());
                    const afterSubject = line.substring(subjectIndex + subject.length).trim();
                    if (afterSubject && afterSubject.length > 3) {
                        currentEntry.syllabus = afterSubject.substring(0, 100); // Limit to 100 chars
                    }
                    break;
                }
            }
        }

        // Add last entry if exists
        if (currentEntry.date && currentEntry.subject) {
            entries.push({
                date: currentEntry.date,
                time: currentEntry.time || '09:00 - 12:00',
                subject: currentEntry.subject,
                syllabus: currentEntry.syllabus || ''
            });
        }

        // If no entries found, return template
        if (entries.length === 0) {
            return [
                {
                    date: format(new Date(), 'yyyy-MM-dd'),
                    time: '09:00 - 12:00',
                    subject: 'Mathematics',
                    syllabus: 'Please edit this entry'
                }
            ];
        }

        return entries;
    };

    const handleUploadAndProcess = async () => {
        if (!selectedFile || !user?.id) {
            toast.error('Please select a file first');
            return;
        }

        try {
            setIsProcessing(true);
            setUploadStatus('uploading');

            // 1. Upload file to Supabase Storage
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('exam-schedules')
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error('Failed to upload file: ' + uploadError.message);
            }

            toast.success('File uploaded successfully!');
            setUploadStatus('processing');

            // 2. Extract text from PDF
            if (selectedFile.type === 'application/pdf') {
                try {
                    const extractedText = await extractTextFromPDF(selectedFile);
                    console.log('Extracted PDF text:', extractedText);

                    // 3. Parse exam schedule from text
                    const parsedEntries = parseExamSchedule(extractedText);
                    console.log('Parsed entries:', parsedEntries);

                    setExtractedEntries(parsedEntries);
                    setUploadStatus('success');
                    setIsEditing(true);
                    toast.success(`Extracted ${parsedEntries.length} exam(s) from PDF! Please review and edit.`);
                } catch (pdfError) {
                    console.error('PDF extraction error:', pdfError);
                    toast.error('Could not extract text from PDF. Please use manual entry.');

                    // Show template for manual editing
                    setExtractedEntries([{
                        date: format(new Date(), 'yyyy-MM-dd'),
                        time: '09:00 - 12:00',
                        subject: '',
                        syllabus: ''
                    }]);
                    setUploadStatus('success');
                    setIsEditing(true);
                }
            } else {
                // For Word documents, show template
                toast.info('Word document uploaded. Please manually enter exam details.');
                setExtractedEntries([{
                    date: format(new Date(), 'yyyy-MM-dd'),
                    time: '09:00 - 12:00',
                    subject: '',
                    syllabus: ''
                }]);
                setUploadStatus('success');
                setIsEditing(true);
            }

        } catch (error: any) {
            console.error('Error processing file:', error);
            setUploadStatus('error');
            toast.error(error.message || 'Failed to process file');
        } finally {
            setIsProcessing(false);
        }
    };

    const updateEntry = (index: number, field: keyof ExtractedEntry, value: string) => {
        const updated = [...extractedEntries];
        updated[index] = { ...updated[index], [field]: value };
        setExtractedEntries(updated);
    };

    const addEntry = () => {
        setExtractedEntries([
            ...extractedEntries,
            {
                date: format(new Date(), 'yyyy-MM-dd'),
                time: '09:00 - 12:00',
                subject: '',
                syllabus: ''
            }
        ]);
    };

    const removeEntry = (index: number) => {
        if (extractedEntries.length > 1) {
            setExtractedEntries(extractedEntries.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = () => {
        // Validate entries
        const isValid = extractedEntries.every(e =>
            e.date && e.time && e.subject
        );

        if (!isValid) {
            toast.error('Please fill in all required fields (Date, Time, Subject)');
            return;
        }

        // Convert to the format expected by parent component
        const generateId = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        const formattedEntries = extractedEntries.map(entry => {
            const [startTime, endTime] = entry.time.split(/[-–]/).map(t => t.trim());
            return {
                id: generateId(),
                exam_date: new Date(entry.date),
                day_of_week: format(new Date(entry.date), 'EEEE'),
                start_time: startTime,
                end_time: endTime || startTime,
                subject: entry.subject,
                syllabus_notes: entry.syllabus
            };
        });

        if (onExtractedData) {
            onExtractedData(formattedEntries);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-1">Upload Timetable</h3>
                <p className="text-sm text-muted-foreground">
                    Upload a PDF or Word document containing the exam schedule
                </p>
            </div>

            {!selectedFile ? (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                        "hover:border-primary hover:bg-primary/5 cursor-pointer"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Drop your file here, or click to browse</p>
                    <p className="text-sm text-muted-foreground mb-4">
                        Supports PDF and Word documents (Max 10MB)
                    </p>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* File Info */}
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                        <FileText className="w-10 h-10 text-primary" />
                        <div className="flex-1">
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        {uploadStatus === 'idle' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveFile}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Upload Status */}
                    {uploadStatus !== 'idle' && (
                        <div className={cn(
                            "p-4 rounded-lg border",
                            uploadStatus === 'success' && "bg-green-50 border-green-200",
                            uploadStatus === 'error' && "bg-red-50 border-red-200",
                            (uploadStatus === 'uploading' || uploadStatus === 'processing') && "bg-blue-50 border-blue-200"
                        )}>
                            <div className="flex items-center gap-3">
                                {uploadStatus === 'uploading' && (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                        <span className="text-sm font-medium text-blue-900">Uploading file...</span>
                                    </>
                                )}
                                {uploadStatus === 'processing' && (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                        <span className="text-sm font-medium text-blue-900">Extracting data from PDF...</span>
                                    </>
                                )}
                                {uploadStatus === 'success' && (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-900">PDF processed successfully!</span>
                                    </>
                                )}
                                {uploadStatus === 'error' && (
                                    <>
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-sm font-medium text-red-900">Failed to process file</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Editable Preview */}
                    {isEditing && extractedEntries.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Review & Edit Extracted Data</h4>
                                <Button onClick={addEntry} size="sm" variant="outline">
                                    + Add Entry
                                </Button>
                            </div>

                            {extractedEntries.map((entry, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-3 bg-card">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Exam {index + 1}</span>
                                        {extractedEntries.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeEntry(index)}
                                                className="text-destructive"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium">Date *</label>
                                            <Input
                                                type="date"
                                                value={entry.date}
                                                onChange={(e) => updateEntry(index, 'date', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Time *</label>
                                            <Input
                                                placeholder="09:00 - 12:00"
                                                value={entry.time}
                                                onChange={(e) => updateEntry(index, 'time', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Subject *</label>
                                        <Input
                                            placeholder="e.g., Mathematics"
                                            value={entry.subject}
                                            onChange={(e) => updateEntry(index, 'subject', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Syllabus / Notes</label>
                                        <Textarea
                                            placeholder="e.g., Chapters 1-5"
                                            value={entry.syllabus}
                                            onChange={(e) => updateEntry(index, 'syllabus', e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
                    Cancel
                </Button>

                {selectedFile && uploadStatus === 'idle' && (
                    <Button onClick={handleUploadAndProcess} disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload & Process
                            </>
                        )}
                    </Button>
                )}

                {isEditing && (
                    <Button onClick={handleSubmit}>
                        Create Schedule
                    </Button>
                )}
            </div>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">PDF Text Extraction</p>
                        <p className="text-blue-700">
                            The system will automatically extract exam details from your PDF.
                            Please review and edit the extracted data before submitting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
