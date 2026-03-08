import React, { useState } from 'react';
import { useStore } from '../../store';
import { X, Lock, Download, FileText, Database, Volume2, Globe, DollarSign, VolumeX } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { useTranslation } from '../../lib/i18n';

interface Props {
    onClose: () => void;
    onOpenSubscription: () => void;
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button onClick={onChange} className="w-11 h-6 rounded-full flex items-center px-1 transition-all duration-200 haptic-active"
            style={{ background: checked ? '#10D9A0' : 'rgba(255,255,255,0.1)' }}>
            <div className="w-4 h-4 rounded-full transition-all duration-200"
                style={{ background: 'white', transform: checked ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
        </button>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="glass-card overflow-hidden">
            <div className="px-5 pt-4 pb-2">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
            </div>
            <div className="px-3 pb-3">{children}</div>
        </div>
    );
}

function Row({ icon, label, sub, right }: { icon: React.ReactNode; label: string; sub?: string; right: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 px-2 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                {sub && <p className="text-xs text-text-muted">{sub}</p>}
            </div>
            {right}
        </div>
    );
}

export function SettingsPage({ onClose, onOpenSubscription }: Props) {
    const { userSettings, updateSettings, subscription, tasks } = useStore();
    const { t } = useTranslation();
    const [exportFilter, setExportFilter] = useState<'ALL' | 'YEAR' | '3MONTHS'>('ALL');

    const getFilteredTasks = () => {
        if (exportFilter === 'ALL') return tasks;
        const now = new Date();
        if (exportFilter === 'YEAR') return tasks.filter(t => new Date(t.due_date).getFullYear() === now.getFullYear());
        const cutoff = new Date(); cutoff.setMonth(now.getMonth() - 2);
        return tasks.filter(t => new Date(t.due_date) >= cutoff);
    };

    const handleExportCSV = () => {
        if (subscription !== 'PRO') return onOpenSubscription();
        const filtered = getFilteredTasks();
        const headers = ['Company', 'Amount', 'Status', 'Due_Date', 'Work_Start', 'Work_End', 'Memo'];
        const rows = filtered.map(t => [`"${t.company}"`, t.amount, t.status, t.due_date, t.work_date_start || '', t.work_date_end || '', `"${t.memo || ''}"`]);
        const csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', `paytrail_${format(new Date(), 'yyyyMMdd')}.csv`);
        document.body.appendChild(link); link.click(); link.remove();
    };

    const handleExportPDF = () => {
        if (subscription !== 'PRO') return onOpenSubscription();
        const filtered = getFilteredTasks();
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
        doc.text('PayTrail Report', 14, 18);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${format(new Date(), 'yyyy-MM-dd')}  Total: ${filtered.length} records`, 14, 28);
        autoTable(doc, {
            startY: 35,
            head: [['Company', 'Amount', 'Status', 'Work Date']],
            body: filtered.map(t => [t.company, t.amount.toLocaleString(), t.status, `${t.work_date_start || ''} ~ ${t.work_date_end || ''}`]),
            theme: 'grid', styles: { fontSize: 8 },
            headStyles: { fillColor: [16, 217, 160], textColor: [10, 26, 18] },
        });
        doc.save(`paytrail_${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    const handleBackup = () => {
        if (subscription !== 'PRO') return onOpenSubscription();
        const data = JSON.stringify({ tasks, exportedAt: new Date().toISOString() });
        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(data));
        link.setAttribute('download', 'paytrail_backup.json');
        document.body.appendChild(link); link.click(); link.remove();
    };

    const selectCls = 'input-dark text-sm py-2 cursor-pointer';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1525 100%)' }}>
            <div className="max-w-md mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 safe-top pt-4">
                    <h2 className="text-xl font-bold text-text-primary">{t('settings')}</h2>
                    <button onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center haptic-active"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <X size={18} className="text-text-secondary" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Plan badge */}
                    <div className="glass-card-elevated p-4 flex items-center justify-between">
                        <div>
                            <p className="text-text-muted text-xs mb-1">현재 플랜</p>
                            <p className="text-lg font-black text-text-primary">{subscription === 'PRO' ? '✦ PRO' : 'FREE'}</p>
                        </div>
                        {subscription === 'FREE' && (
                            <button onClick={onOpenSubscription} className="btn-primary px-4 py-2 text-sm">
                                업그레이드
                            </button>
                        )}
                    </div>

                    {/* Preferences */}
                    <Section title={t('preferences')}>
                        <Row
                            icon={<Globe size={16} className="text-accent-sky" />}
                            label={t('language')}
                            right={
                                <select value={userSettings.language} onChange={e => updateSettings({ language: e.target.value as any })} className={selectCls} style={{ width: 110 }}>
                                    <option value="ko">한국어</option>
                                    <option value="en">English</option>
                                    <option value="ja">日本語</option>
                                    <option value="es">Español</option>
                                </select>
                            }
                        />
                        <Row
                            icon={<DollarSign size={16} className="text-accent-gold" />}
                            label={t('currencyProtocol')}
                            right={
                                <select value={userSettings.currency} onChange={e => updateSettings({ currency: e.target.value as any })} className={selectCls} style={{ width: 110 }}>
                                    <option value="KRW">KRW (₩)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            }
                        />
                        <Row
                            icon={userSettings.audioEnabled ? <Volume2 size={16} style={{ color: '#10D9A0' }} /> : <VolumeX size={16} className="text-text-muted" />}
                            label={t('audioKaChing')}
                            sub={t('audioDescription')}
                            right={<ToggleSwitch checked={userSettings.audioEnabled} onChange={() => updateSettings({ audioEnabled: !userSettings.audioEnabled })} />}
                        />
                    </Section>

                    {/* Data export */}
                    <Section title={`${t('dataManagement')} — PRO`}>
                        <div className="relative">
                            {subscription === 'FREE' && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
                                    style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(4px)' }}>
                                    <Lock className="text-text-muted mb-2" size={20} />
                                    <p className="text-text-muted text-xs mb-3">PRO 플랜 전용</p>
                                    <button onClick={onOpenSubscription} className="btn-primary px-5 py-2 text-sm">
                                        {t('upgradeUnlockExport')}
                                    </button>
                                </div>
                            )}
                            <div className="px-2 py-2 space-y-3">
                                <Row icon={<FileText size={16} className="text-text-secondary" />} label={t('exportDateRange')}
                                    right={
                                        <select value={exportFilter} onChange={e => setExportFilter(e.target.value as any)} className={selectCls} style={{ width: 130 }}>
                                            <option value="ALL">{t('exportAllTime')}</option>
                                            <option value="YEAR">{t('exportThisYear')}</option>
                                            <option value="3MONTHS">{t('exportLast3Months')}</option>
                                        </select>
                                    }
                                />
                                <div className="flex gap-2 px-2">
                                    <button onClick={handleExportCSV} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs">
                                        <Download size={14} /> CSV
                                    </button>
                                    <button onClick={handleExportPDF} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs">
                                        <FileText size={14} /> PDF
                                    </button>
                                </div>
                                <div className="px-2">
                                    <button onClick={handleBackup} className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all"
                                        style={{ background: 'rgba(16,217,160,0.08)', border: '1px solid rgba(16,217,160,0.2)', color: '#10D9A0' }}>
                                        <Database size={14} /> {t('syncToGoogleDrive')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* App version */}
                    <p className="text-center text-text-disabled text-xs pb-4">PayTrail v1.0.0 · 데이터는 기기에 저장됩니다</p>
                </div>
            </div>
        </div>
    );
}
