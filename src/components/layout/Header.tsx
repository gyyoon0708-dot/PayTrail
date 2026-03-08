import { Settings } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../lib/i18n';

interface Props {
    onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: Props) {
    const { userSettings, subscription } = useStore();
    const { t } = useTranslation();

    return (
        <header className="flex items-center justify-between pb-4 pt-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    PayTrail
                    <span className={
                        subscription === 'PRO'
                            ? "text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20"
                            : "text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-200 text-slate-500"
                    }>
                        {subscription === 'PRO' ? t('pro') : 'FREE'}
                    </span>
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">{t('appSubtitle')}</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSettings}
                    className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors haptic-active shadow-sm"
                >
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}
