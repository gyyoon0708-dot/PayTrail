import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { useStore } from '../../store';
import { TaskListItem } from './TaskListItem';
import { Plus, X } from 'lucide-react';
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
        ? tasks.filter(task => {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const isDue = isSameDay(new Date(task.due_date), selectedDate);
            const isWork = task.work_date_start
                ? dateStr >= task.work_date_start && dateStr <= (task.work_date_end || task.work_date_start)
                : false;
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
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(5,8,20,0.7)', backdropFilter: 'blur(8px)' }}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
                        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[75vh] safe-bottom"
                        style={{
                            background: 'linear-gradient(180deg, #1A2235 0%, #111827 100%)',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '24px 24px 0 0',
                            boxShadow: '0 -16px 48px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <div>
                                <h3 className="text-base font-bold text-text-primary">
                                    {format(selectedDate, 'M월 d일')}
                                </h3>
                                <p className="text-xs text-text-muted">{filteredTasks.length}건</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onOpenModal(selectedDate)}
                                    className="btn-primary flex items-center gap-1 px-3 py-2 text-xs"
                                >
                                    <Plus size={14} />
                                    추가
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center haptic-active"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    <X size={16} className="text-text-secondary" />
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="divider mx-4" />

                        {/* Task list */}
                        <div className="flex-1 overflow-y-auto px-4 py-3">
                            {filteredTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        📅
                                    </div>
                                    <p className="text-text-muted text-sm">{t('noTasksForDate')}</p>
                                    <button
                                        onClick={() => onOpenModal(selectedDate)}
                                        className="btn-primary px-5 py-2 text-sm mt-1"
                                    >
                                        {t('addTask')}
                                    </button>
                                </div>
                            ) : (
                                filteredTasks.map(task => (
                                    <TaskListItem
                                        key={task.id}
                                        task={task}
                                        onEdit={onEditTask ? () => onEditTask(task.id) : undefined}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
