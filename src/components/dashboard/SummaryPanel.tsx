import { useStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';
import { Wallet, Activity } from 'lucide-react';

interface Props {
    currentMonth: Date;
    onOpenReceived: () => void;
}

export function SummaryPanel({ currentMonth, onOpenReceived }: Props) {
    const { tasks, userSettings } = useStore();
    const { t } = useTranslation();

    const currentMonthYear = currentMonth.getFullYear();
    const currentMonthIdx = currentMonth.getMonth();

    let expected = 0;
    let received = 0;

    tasks.forEach(task => {
        const dueDate = new Date(task.due_date);
        const isThisMonth = dueDate.getFullYear() === currentMonthYear && dueDate.getMonth() === currentMonthIdx;

        const remaining = task.amount - task.tax_deducted - task.received_amount;

        if (task.status === 'PAID') {
            if (isThisMonth) {
                received += task.received_amount || (task.amount - task.tax_deducted);
            }
        } else {
            if (isThisMonth && (task.status === 'WAITING' || task.status === 'OVERDUE' || task.status === 'SCHEDULED')) {
                expected += remaining;
            }
        }
    });

    return (
        <div className="flex flex-col gap-3 mb-6">
            {/* Expected Gross - Full Width */}
            <div className="glass-card p-4 bg-gradient-to-br from-white to-slate-50">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Wallet size={16} />
                    <span className="text-sm font-medium">{t('expectedGross')}</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 tracking-tight">
                    {formatCurrency(expected, userSettings.currency)}
                </div>
                <p className="text-xs text-slate-400 mt-1">이번 달 미수령 예상금액</p>
            </div>

            {/* Received - Clickable to open Received Page */}
            <div
                className="glass-card p-4 border-primary/20 bg-gradient-to-br from-primary/5 to-white shadow-primary/5 cursor-pointer hover:bg-primary/10 transition-colors haptic-active"
                onClick={onOpenReceived}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Activity size={16} />
                        <span className="text-sm font-medium">{t('received')}</span>
                    </div>
                    <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">관리하기 →</span>
                </div>
                <div className="text-3xl font-bold text-primary tracking-tight">
                    {formatCurrency(received, userSettings.currency)}
                </div>
                <p className="text-xs text-primary/60 mt-1">탭하여 건별 수령 확인</p>
            </div>
        </div>
    );
}
