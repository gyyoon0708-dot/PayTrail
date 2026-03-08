import { Volume2, VolumeX, Eye, EyeOff, Settings } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import { differenceInDays, endOfMonth, startOfMonth } from 'date-fns';
import { useTranslation } from '../../lib/i18n';

export function Header() {
    const { userSettings, updateSettings, subscription } = useStore();
    const { t } = useTranslation();

    const toggleAudio = () => updateSettings({ audioEnabled: !userSettings.audioEnabled });
    const togglePrivacy = () => updateSettings({ privacyMode: !userSettings.privacyMode });

    return (
        <header className="flex items-center justify-between pb-4 pt-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    PayTrail
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-semibold",
                        subscription === 'PRO' ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-200 text-slate-500"
                    )}>
                        {subscription === 'PRO' ? t('pro') : 'FREE'}
                    </span>
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">{t('appSubtitle')}</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleAudio}
                    className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary transition-colors haptic-active shadow-sm"
                >
                    {userSettings.audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button
                    onClick={togglePrivacy}
                    className={cn(
                        "p-2.5 rounded-full border transition-colors haptic-active shadow-sm flex items-center gap-1.5",
                        userSettings.privacyMode
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-white border-slate-200 text-slate-600 hover:text-primary"
                    )}
                >
                    {userSettings.privacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </header>
    );
}
