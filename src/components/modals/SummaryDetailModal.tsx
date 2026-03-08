import React from 'react';
import { X } from 'lucide-react';
import { Task } from '../../types';
import { TaskListItem } from '../dashboard/TaskListItem';
import { useTranslation } from '../../lib/i18n';
import { differenceInDays } from 'date-fns';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    category: 'EXPECTED' | 'RECEIVED' | 'OVERDUE' | 'AGING' | null;
    currentMonth: Date;
    tasks: Task[];
    onEditTask: (taskId: string) => void;
}

export function SummaryDetailModal({ isOpen, onClose, category, currentMonth, tasks, onEditTask }: Props) {
    const { t } = useTranslation();

    if (!isOpen || !category) return null;

    // Filter logic identical to SummaryPanel
    const currentMonthYear = currentMonth.getFullYear();
    const currentMonthIdx = currentMonth.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredTasks = tasks.filter(task => {
        const dueDate = new Date(task.due_date);
        const isThisMonth = dueDate.getFullYear() === currentMonthYear && dueDate.getMonth() === currentMonthIdx;

        if (category === 'RECEIVED') {
            return task.status === 'PAID' && isThisMonth;
        }

        if (category === 'EXPECTED') {
            return task.status !== 'PAID' && isThisMonth && (task.status === 'WAITING' || task.status === 'OVERDUE' || task.status === 'SCHEDULED');
        }

        if (category === 'OVERDUE') {
            return task.status === 'OVERDUE';
        }

        if (category === 'AGING') {
            if (task.status !== 'OVERDUE') return false;
            const daysLate = differenceInDays(today, new Date(task.due_date));
            return daysLate >= 30;
        }

        return false;
    });

    // Titles based on category
    const getTitle = () => {
        switch (category) {
            case 'EXPECTED': return t('expectedGross');
            case 'RECEIVED': return t('received');
            case 'OVERDUE': return t('overdue');
            case 'AGING': return t('aging30Days');
            default: return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center">
            {/* Modal Container */}
            <div className="bg-white w-full h-full sm:h-[80vh] sm:max-w-md sm:rounded-2xl sm:shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{getTitle()}</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {filteredTasks.length} {t('tasks')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors haptic-active"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body / List */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-slate-900 font-medium mb-1">{t('noTasks')}</h3>
                            <p className="text-slate-500 text-sm">해당되는 일정이 없습니다.</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskListItem
                                key={task.id}
                                task={task}
                                onEdit={() => {
                                    onClose(); // Close this modal before opening edit modal
                                    onEditTask(task.id);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
