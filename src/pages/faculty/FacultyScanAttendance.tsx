import { FacultyLayout } from '@/layouts/FacultyLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Camera, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SECRET_KEY = 'myvidyon-qr-secret';

export function FacultyScanAttendance() {
    const { user } = useAuth();
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const startScanner = () => {
        setIsScanning(true);
        setScanResult(null);

        // Wait for DOM to render the scanner container
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }, 100);
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const onScanSuccess = async (decodedText: string) => {
        stopScanner();
        setLoading(true);

        try {
            const data = JSON.parse(decodedText);
            const { institutionId, date, signature } = data;

            // 1. Verify Signature
            const expectedSignature = CryptoJS.SHA256(institutionId + date + SECRET_KEY).toString();

            if (signature !== expectedSignature) {
                throw new Error('Invalid QR code signature. Please scan the official institution QR.');
            }

            // 2. Verify Institution
            if (institutionId !== user?.institutionId) {
                throw new Error('This QR code is for a different institution.');
            }

            // 3. Verify Date (UTC comparison or Local)
            const today = new Date().toISOString().split('T')[0];
            if (date !== today) {
                throw new Error('This QR code has expired. Please use today\'s official QR.');
            }

            // 4. Record Attendance
            const { error } = await supabase
                .from('staff_attendance')
                .insert({
                    staff_id: user.id,
                    institution_id: user.institutionId,
                    attendance_date: today,
                    status: 'present'
                });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('Attendance already marked for today.');
                }
                throw error;
            }

            setScanResult({ success: true, message: 'Attendance recorded successfully!' });
            toast.success('Attendance Recorded');
        } catch (err: any) {
            console.error('Scan error:', err);
            setScanResult({ success: false, message: err.message || 'Failed to process QR code.' });
            toast.error(err.message || 'Scan Failed');
        } finally {
            setLoading(false);
        }
    };

    const onScanFailure = (error: any) => {
        // Silently handle scan failures (usually means no QR found in frame)
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Cleanup error", err));
            }
        };
    }, []);

    return (
        <FacultyLayout>
            <PageHeader
                title="Self Attendance"
                subtitle="Scan the institution's daily QR code to mark your attendance"
            />

            <div className="max-w-md mx-auto">
                <div className="dashboard-card overflow-hidden">
                    {!isScanning && !scanResult && !loading && (
                        <div className="p-8 text-center">
                            <div className="bg-faculty/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Camera className="w-10 h-10 text-faculty" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ready to Scan?</h3>
                            <p className="text-muted-foreground mb-8">
                                Make sure you are at the institution entrance and can see the official QR code on the display.
                            </p>
                            <Button onClick={startScanner} className="w-full bg-faculty hover:bg-faculty/90 h-12 text-lg">
                                Start Scanner
                            </Button>
                        </div>
                    )}

                    {isScanning && (
                        <div className="p-4">
                            <div id="qr-reader" className="overflow-hidden rounded-lg border-2 border-faculty/30"></div>
                            <Button
                                variant="ghost"
                                onClick={stopScanner}
                                className="w-full mt-4 text-muted-foreground hover:text-destructive"
                            >
                                Cancel Scanning
                            </Button>
                        </div>
                    )}

                    {loading && (
                        <div className="p-12 text-center">
                            <Loader2 className="w-12 h-12 text-faculty animate-spin mx-auto mb-4" />
                            <p className="font-medium">Verifying attendance...</p>
                        </div>
                    )}

                    {scanResult && (
                        <div className="p-8 text-center animate-in zoom-in-95 duration-300">
                            {scanResult.success ? (
                                <>
                                    <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-success" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-success mb-2">Success!</h3>
                                    <p className="text-muted-foreground mb-8">{scanResult.message}</p>
                                </>
                            ) : (
                                <>
                                    <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <XCircle className="w-12 h-12 text-destructive" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-destructive mb-2">Scan Failed</h3>
                                    <p className="text-muted-foreground mb-8">{scanResult.message}</p>
                                </>
                            )}
                            <Button onClick={startScanner} variant="outline" className="w-full h-12">
                                Scan Again
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-warning-foreground">
                        <p className="font-semibold mb-1">Important Note:</p>
                        <p>Attendance is recorded based on your current device time and location. Attempting to spoof attendance may be flagged by the administration.</p>
                    </div>
                </div>
            </div>
        </FacultyLayout>
    );
}
