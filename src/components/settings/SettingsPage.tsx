import React, { useState } from 'react';
import { useStore } from '../../store';
import { X, Lock, Download, FileText, Database } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { useTranslation } from '../../lib/i18n';

interface Props {
    onClose: () => void;
    onOpenSubscription: () => void;
}

export function SettingsPage({ onClose, onOpenSubscription }: Props) {
    const { userSettings, updateSettings, subscription, tasks } = useStore();
    const { t } = useTranslation();

    const [exportFilter, setExportFilter] = useState<'ALL' | 'YEAR' | '3MONTHS'>('ALL');

    const getFilteredTasks = () => {
        if (exportFilter === 'ALL') return tasks;
        const now = new Date();
        if (exportFilter === 'YEAR') {
            return tasks.filter(t => new Date(t.due_date).getFullYear() === now.getFullYear());
        }
        if (exportFilter === '3MONTHS') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(now.getMonth() - 2);
            return tasks.filter(t => new Date(t.due_date) >= threeMonthsAgo);
        }
        return tasks;
    };

    const handleExportCSV = () => {
        if (subscription !== 'PRO') return onOpenSubscription();

        const filtered = getFilteredTasks();
        const headers = ['Task_ID', 'Company', 'Gross_Amount', 'Tax_Deducted', 'Received_Amount', 'Status', 'Due_Date', 'Paid_Date'];
        const rows = filtered.map(t => [
            t.id, `"${t.company}"`, t.amount, t.tax_deducted, t.received_amount, t.status, t.due_date, t.paid_date || ''
        ]);

        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `paytrail_export_${format(new Date(), 'yyyyMMdd')}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleExportPDF = () => {
        if (subscription !== 'PRO') return onOpenSubscription();

        const filtered = getFilteredTasks();
        const doc = new jsPDF();

        // Brand Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("PayTrail Report", 14, 20); // Note: jsPDF core has limited korean font support without custom vfs. We'd use a generic font or latin equivalent in pure jsPDF, but we supply string as requested.

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated Date: ${format(new Date(), 'yyyy-MM-dd')}`, 14, 30);
        doc.text(`Filter Used: ${exportFilter}`, 14, 35);

        let totalGross = 0;
        let totalReceived = 0;
        filtered.forEach(t => {
            totalGross += t.amount;
            if (t.status === 'PAID') totalReceived += t.amount; // simplification
        });

        doc.setFont("helvetica", "bold");
        doc.text(`Summary: Total Expected Gross = ${totalGross} | Total Received = ${totalReceived}`, 14, 45);

        const tableData = filtered.map(t => [
            t.company,
            t.due_date,
            t.amount.toString(),
            t.status
        ]);

        autoTable(doc, {
            startY: 55,
            head: [['Company', 'Due Date', 'Gross Amount', 'Status']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [21, 128, 61] }, // Dark Green to match light theme
        });

        doc.save(`paytrail_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    const handleBackup = () => {
        if (subscription !== 'PRO') return onOpenSubscription();

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "paytrail_backup.json");
        dlAnchorElem.click();
        alert("Backup Downloaded (Simulated Google Drive Sync)");
    };

    return (
        <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
            <div className="max-w-md mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">{t('settings')}</h2>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-500 border border-slate-200 hover:text-slate-900 transition-colors haptic-active shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">

                    {/* Preferences */}
                    <div className="glass-card p-5 border-slate-200 bg-white">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('preferences')}</h3>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-700">{t('language')}</span>
                            <select
                                value={userSettings.language}
                                onChange={e => updateSettings({ language: e.target.value as any })}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="ko">{t('languageKo')}</option>
                                <option value="en">{t('languageEn')}</option>
                                <option value="ja">{t('languageJa')}</option>
                                <option value="es">{t('languageEs')}</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-700">{t('currencyProtocol')}</span>
                            <select
                                value={userSettings.currency}
                                onChange={e => updateSettings({ currency: e.target.value as any })}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="KRW">KRW (₩)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="block text-sm font-medium text-slate-700">{t('audioKaChing')}</span>
                                <span className="block text-xs text-slate-500">{t('audioDescription')}</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={userSettings.audioEnabled}
                                onChange={() => updateSettings({ audioEnabled: !userSettings.audioEnabled })}
                                className="w-5 h-5 rounded text-primary border-slate-300 focus:ring-primary bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* Data Management Export */}
                    <div className="glass-card p-5 border-slate-200 bg-white relative overflow-hidden">
                        {subscription === 'FREE' && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl border border-slate-200">
                                <Lock className="text-slate-400 mb-2" size={24} />
                                <button
                                    onClick={onOpenSubscription}
                                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg haptic-active shadow-md"
                                >{t('upgradeUnlockExport')}</button>
                            </div>
                        )}

                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">{t('dataManagement')} <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">{t('pro')}</span></h3>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-2">{t('exportDateRange')}</label>
                            <select
                                value={exportFilter}
                                onChange={e => setExportFilter(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary mb-4"
                            >
                                <option value="ALL">{t('exportAllTime')}</option>
                                <option value="YEAR">{t('exportThisYear')} ({new Date().getFullYear()})</option>
                                <option value="3MONTHS">{t('exportLast3Months')}</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <button onClick={handleExportCSV} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold transition-colors">
                                <Download size={16} /> CSV
                            </button>
                            <button onClick={handleExportPDF} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold transition-colors">
                                <FileText size={16} /> PDF
                            </button>
                        </div>

                        <button onClick={handleBackup} className="w-full flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-bold border border-primary/20 transition-colors">
                            <Database size={16} /> {t('syncToGoogleDrive')}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
