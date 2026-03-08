import { Settings } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../lib/i18n';
import { formatCurrency } from '../../lib/utils';

interface Props {
    onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: Props) {
    const { userSettings, subscription, tasks } = useStore();
    const { t } = useTranslation();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    // Quick stat: total unpaid this month
    const unpaidThisMonth = tasks
        .filter(task => {
            const d = new Date(task.due_date);
            return d.getFullYear() === thisYear && d.getMonth() === thisMonth && task.status !== 'PAID';
        })
        .reduce((sum, task) => sum + (task.amount - task.tax_deducted - task.received_amount), 0);

    const monthName = today.toLocaleDateString('ko-KR', { month: 'long' });

    return (
        <header className="safe-top pt-4 pb-2">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tight text-text-primary">PayTrail</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${subscription === 'PRO'
                                ? 'bg-gradient-primary text-bg-primary'
                                : 'bg-white/8 text-text-secondary border border-white/10'
                            }`}>
                            {subscription === 'PRO' ? '✦ PRO' : 'FREE'}
                        </span>
                    </div>
                    <p className="text-text-secondary text-xs mt-0.5">{t('appSubtitle')}</p>
                </div>

                <button
                    onClick={onOpenSettings}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 haptic-active"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <Settings size={18} className="text-text-secondary" />
                </button>
            </div>

            {/* Hero stat card */}
            <div className="glass-card-elevated p-5 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #10D9A0, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-text-secondary text-xs font-medium mb-1">{monthName} 미수령 예상</p>
                        <p className="text-3xl font-black amount-display" style={{ color: '#10D9A0', letterSpacing: '-0.03em' }}>
                            {formatCurrency(unpaidThisMonth, userSettings.currency)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10D9A0' }} />
                            <p className="text-text-muted text-xs">실시간 업데이트</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-text-muted text-xs mb-1">정산 건수</p>
                        <p className="text-2xl font-black text-text-primary">{tasks.filter(t => t.status !== 'PAID').length}</p>
                        <p className="text-text-muted text-xs">미완료</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
