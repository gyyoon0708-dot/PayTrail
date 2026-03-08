import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { useStore } from '../../store';
import { TaskListItem } from './TaskListItem';
import { PlusCircle, X } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface BottomSheetProps {
    selectedDate: Date | null;
    onClose: () => void;
    onOpenModal: (date?: Date) => void;
    onEditTask?: (taskId: string) => void;
}

export function TaskBottomSheet({ selectedDate, onClose, onOpenModal, onEditTask }: BottomSheetProps) {
    const { tasks } = useStore();
    const { t } = useTranslation();

    const filteredTasks = selectedDate
        ? tasks.filter(t => {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const isDue = isSameDay(new Date(t.due_date), selectedDate);
            const isWork = t.work_date_start ? dateStr >= t.work_date_start && dateStr <= (t.work_date_end || t.work_date_start) : false;
            return isDue || isWork;
        })
        : [];

    return (
        <AnimatePresence>
            {selectedDate && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] h-[70vh] flex flex-col"
                    >
                        {/* Handle/Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <div className="flex-1" />
                            <div className="flex flex-col items-center justify-center flex-1">
                                <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-3" />
                                <h3 className="text-lg font-bold text-slate-900">
                                    {format(selectedDate, 'MMM d, yyyy')}
                                </h3>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 haptic-active">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {filteredTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                                    <p>{t('noTasksScheduled')}</p>
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <TaskListItem key={task.id} task={task} onEdit={onEditTask ? () => onEditTask(task.id) : undefined} />
                                ))
                            )}
                        </div>

                        {/* Add Task Button docked at bottom of sheet */}
                        <div className="p-4 bg-white/90 backdrop-blur pb-8 border-t border-slate-100">
                            <button
                                onClick={() => onOpenModal(selectedDate)}
                                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 haptic-active shadow-lg shadow-primary/20"
                            >
                                <PlusCircle size={20} />
                                {t('addTaskForDate')}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
