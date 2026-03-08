import React from 'react';
import { useStore } from '../../store';
import { Check, X, Shield, DownloadCloud, Infinity as InfinityIcon } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface Props {
    onClose: () => void;
}

export function SubscriptionModal({ onClose }: Props) {
    const { subscription, setSubscription } = useStore();
    const { t } = useTranslation();

    const handleSubscribe = (tier: 'FREE' | 'PRO') => {
        setSubscription(tier);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 bg-slate-100/80 rounded-full z-10 transition-colors">
                    <X size={20} />
                </button>

                <div className="p-8 text-center bg-gradient-to-b from-primary/5 to-transparent">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{t('upgradeToPro')}</h2>
                    <p className="text-slate-600">{t('upgradeDesc')}</p>
                </div>

                <div className="px-6 pb-8 flex justify-center gap-4">

                    {/* Monthly Card */}
                    <div className="flex-1 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col items-center">
                        <h3 className="font-bold text-slate-700 mb-2">{t('monthlyPass')}</h3>
                        <div className="text-3xl font-black text-slate-900 mb-6">₩3,900<span className="text-sm font-medium text-slate-500">/mo</span></div>
                        <button
                            onClick={() => handleSubscribe('PRO')}
                            className="w-full py-3 rounded-xl bg-slate-200 hover:bg-primary hover:text-white font-bold transition-colors haptic-active text-slate-700"
                        >
                            {t('subscribe')}
                        </button>
                    </div>

                    {/* Annual Card */}
                    <div className="flex-1 bg-white border-2 border-primary p-6 rounded-2xl flex flex-col items-center relative shadow-lg shadow-primary/10">
                        <div className="absolute -top-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">2 Months Free</div>
                        <h3 className="font-bold text-primary mb-2">{t('annualPass')}</h3>
                        <div className="text-3xl font-black text-slate-900 mb-6">₩39,000<span className="text-sm font-medium text-slate-500">/yr</span></div>
                        <button
                            onClick={() => handleSubscribe('PRO')}
                            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-colors haptic-active shadow-md shadow-primary/20"
                        >
                            {t('subscribe')}
                        </button>
                    </div>

                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">{t('proFeatures')}</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-slate-700">
                            <span className="p-1 rounded bg-primary/10 text-primary"><InfinityIcon size={14} /></span>
                            <span className="text-sm font-medium">{t('unlimitedTasks')}</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <span className="p-1 rounded bg-success/10 text-success"><DownloadCloud size={14} /></span>
                            <span className="text-sm font-medium">{t('advancedExport')}</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Shield size={14} /></span>
                            <span className="text-sm font-medium">{t('googleDriveSync')}</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}
