import { useStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';
import { TrendingUp, ChevronRight } from 'lucide-react';

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
    let receivedCount = 0;
    let pendingCount = 0;

    tasks.forEach(task => {
        const dueDate = new Date(task.due_date);
        const isThisMonth = dueDate.getFullYear() === currentMonthYear && dueDate.getMonth() === currentMonthIdx;
        const remaining = task.amount - task.tax_deducted - task.received_amount;

        if (task.status === 'PAID') {
            if (isThisMonth) {
                received += task.received_amount || (task.amount - task.tax_deducted);
                receivedCount++;
            }
        } else {
            if (isThisMonth) {
                expected += remaining;
                pendingCount++;
            }
        }
    });

    const receivedRate = (receivedCount + pendingCount) > 0
        ? Math.round((receivedCount / (receivedCount + pendingCount)) * 100)
        : 0;

    return (
        <div className="space-y-3 mb-5">
            {/* Expected Gross */}
            <div className="glass-card p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.1) 0%, transparent 60%)' }} />
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.12)' }}>
                        <TrendingUp size={14} style={{ color: '#38BDF8' }} />
                    </div>
                    <span className="text-text-secondary text-xs font-medium">{t('expectedGross')}</span>
                </div>
                <p className="text-2xl font-black amount-display text-text-primary">{formatCurrency(expected, userSettings.currency)}</p>
                {pendingCount > 0 && (
                    <p className="text-text-muted text-xs mt-1">{pendingCount}건 미수령</p>
                )}
            </div>

            {/* Received — Clickable */}
            <button
                className="w-full glass-card p-4 relative overflow-hidden text-left group haptic-active"
                onClick={onOpenReceived}
            >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: '0 0 24px rgba(16,217,160,0.12) inset' }} />

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,217,160,0.12)' }}>
                            <span className="text-sm">✓</span>
                        </div>
                        <span className="text-text-secondary text-xs font-medium">{t('received')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#10D9A0' }}>
                        관리하기
                        <ChevronRight size={14} />
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <p className="text-2xl font-black amount-display" style={{ color: '#10D9A0' }}>
                        {formatCurrency(received, userSettings.currency)}
                    </p>
                    {/* Progress bar */}
                    <div className="text-right">
                        <p className="text-text-muted text-xs mb-1">{receivedRate}% 완료</p>
                        <div className="w-20 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${receivedRate}%`, background: 'linear-gradient(90deg, #10D9A0, #0BB882)' }}
                            />
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
}
