import { useStore } from '../../store';
import { formatCurrency, PrivacyWrapper } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';
import { Wallet, AlertCircle, Hourglass, Activity } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export function SummaryPanel({ currentMonth }: { currentMonth: Date }) {
    const { tasks, userSettings } = useStore();
    const { t } = useTranslation();

    // Calculate Summaries for the selected current month view
    // Actually, standard dashboards often show global metrics or current month. Let's do current month filtered for received, and global for overdue.

    const currentMonthYear = currentMonth.getFullYear();
    const currentMonthIdx = currentMonth.getMonth();

    let expected = 0;
    let received = 0;
    let overdueCount = 0;
    let aging30Count = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        const dueDate = new Date(task.due_date);
        const isThisMonth = dueDate.getFullYear() === currentMonthYear && dueDate.getMonth() === currentMonthIdx;

        // Remaining balance
        const remaining = task.amount - task.tax_deducted - task.received_amount;

        if (task.status === 'PAID') {
            if (isThisMonth) {
                received += task.received_amount || (task.amount - task.tax_deducted);
            }
        } else {
            if (isThisMonth && (task.status === 'WAITING' || task.status === 'OVERDUE' || task.status === 'SCHEDULED')) {
                expected += remaining;
            }

            if (task.status === 'OVERDUE') {
                overdueCount++;
                const daysLate = differenceInDays(today, new Date(task.due_date));
                if (daysLate >= 30) {
                    aging30Count++;
                }
            }
        }
    });

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass-card p-4 col-span-2 sm:col-span-1 bg-gradient-to-br from-white to-slate-50">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Wallet size={16} />
                    <span className="text-sm font-medium">{t('expectedGross')}</span>
                </div>
                <div className={`text-3xl font-bold text-slate-800 tracking-tight ${userSettings.privacyMode ? 'blur-privacy' : ''}`}>
                    {PrivacyWrapper(formatCurrency(expected, userSettings.currency), userSettings.privacyMode)}
                </div>
            </div>

            <div className="glass-card p-4 col-span-2 sm:col-span-1 border-primary/20 bg-gradient-to-br from-primary/5 to-white shadow-primary/5">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Activity size={16} />
                    <span className="text-sm font-medium">{t('received')}</span>
                </div>
                <div className={`text-3xl font-bold text-primary tracking-tight ${userSettings.privacyMode ? 'blur-privacy' : ''}`}>
                    {PrivacyWrapper(formatCurrency(received, userSettings.currency), userSettings.privacyMode)}
                </div>
            </div>

            <div className="glass-card p-3 border-danger/20 bg-danger/5">
                <div className="flex items-center gap-2 text-danger mb-1">
                    <AlertCircle size={14} />
                    <span className="text-xs font-medium">{t('overdue')}</span>
                </div>
                <div className="text-xl font-bold text-slate-900">
                    {overdueCount} <span className="text-sm font-normal text-slate-500">tasks</span>
                </div>
            </div>

            <div className="glass-card p-3 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <Hourglass size={14} />
                    <span className="text-xs font-medium">{t('aging30Days')}</span>
                </div>
                <div className="text-xl font-bold text-slate-900">
                    {aging30Count} <span className="text-sm font-normal text-slate-500">tasks</span>
                </div>
            </div>
        </div>
    );
}
