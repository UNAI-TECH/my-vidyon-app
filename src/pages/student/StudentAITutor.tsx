import { StudentLayout } from '@/layouts/StudentLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/TranslationContext';
import { MessageSquare, Send, Sparkles, BookOpen } from 'lucide-react';
import { useState } from 'react';

const sampleQuestions = [
    "Explain binary search trees",
    "What is database normalization?",
    "How does React useState work?",
    "Explain time complexity",
];

export function StudentAITutor() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
        {
            role: 'ai',
            content: "Hello! I'm your AI Tutor. I can help you with your coursework, explain concepts, and answer questions. How can I assist you today?"
        }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages([...messages, { role: 'user', content: input }]);

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I understand your question. Let me help you with that. [This is a demo response. In a real implementation, this would connect to an AI service to provide actual tutoring assistance.]"
            }]);
        }, 1000);

        setInput('');
    };

    const handleSampleQuestion = (question: string) => {
        setInput(question);
    };

    return (
        <StudentLayout>
            <PageHeader
                title={t.nav.aiTutor}
                subtitle={t.dashboard.overview}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat Area */}
                <div className="lg:col-span-3">
                    <div className="dashboard-card h-[600px] flex flex-col">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {message.role === 'ai' && (
                                                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            )}
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-border p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything about your courses..."
                                    className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Button onClick={handleSend} className="btn-primary px-6">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Sample Questions */}
                    <div className="dashboard-card">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Sample Questions</h3>
                        </div>
                        <div className="space-y-2">
                            {sampleQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSampleQuestion(question)}
                                    className="w-full text-left p-3 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="dashboard-card">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">AI Tutor Features</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>✓ 24/7 availability</li>
                            <li>✓ Instant responses</li>
                            <li>✓ Multi-subject support</li>
                            <li>✓ Step-by-step explanations</li>
                            <li>✓ Code examples</li>
                            <li>✓ Practice problems</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-2">💡 Pro Tip</p>
                        <p className="text-xs text-muted-foreground">
                            Be specific with your questions for better answers. Include course context when relevant.
                        </p>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
