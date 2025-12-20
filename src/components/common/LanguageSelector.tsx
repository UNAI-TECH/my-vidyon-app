import { Globe } from 'lucide-react';
import { useTranslation } from '@/i18n/TranslationContext';
import { languages } from '@/i18n/translations';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function LanguageSelector() {
    const { language, setLanguage } = useTranslation();

    const currentLanguage = languages.find(lang => lang.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`cursor-pointer ${language === lang.code ? 'bg-primary/10 font-semibold' : ''}`}
                    >
                        <div className="flex items-center justify-between w-full">
                            <span>{lang.nativeName}</span>
                            {language === lang.code && (
                                <span className="text-primary">✓</span>
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
