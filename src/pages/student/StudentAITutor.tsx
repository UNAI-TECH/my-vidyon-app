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

            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 dashboard-card">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
                <p className="text-muted-foreground text-lg max-w-md mb-8">
                    We are building an intelligent AI Tutor to help you learn better.
                    Stay tuned for personalized assistance, instant doubt solving, and more!
                </p>
                <Button onClick={() => window.history.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        </StudentLayout>
    );
}
