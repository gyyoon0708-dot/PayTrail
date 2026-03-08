import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { SummaryPanel } from './SummaryPanel';
import { CalendarView } from './CalendarView';
import { TaskBottomSheet } from './TaskBottomSheet';
import { TaskModal } from '../modals/TaskModal';

export function Dashboard() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
    const [editTaskId, setEditTaskId] = useState<string | undefined>();

    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
    };

    const openTaskModal = (date?: Date, taskId?: string) => {
        setModalInitialDate(date);
        setEditTaskId(taskId);
        setIsModalOpen(true);
        setSelectedDate(null); // close bottom sheet if open
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-md mx-auto px-4">
                <Header />

                <main className="mt-2 space-y-4">
                    <SummaryPanel currentMonth={currentMonth} />
                    <CalendarView
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        selectedDate={selectedDate}
                        onSelectDate={handleSelectDate}
                    />
                </main>

                <TaskBottomSheet
                    selectedDate={selectedDate}
                    onClose={() => setSelectedDate(null)}
                    onOpenModal={openTaskModal}
                    onEditTask={(taskId) => openTaskModal(undefined, taskId)}
                />

                {isModalOpen && (
                    <TaskModal
                        onClose={() => setIsModalOpen(false)}
                        initialDate={modalInitialDate}
                        editTaskId={editTaskId}
                    />
                )}
            </div>

            {/* Floating Action Button for Main Screen */}
            <button
                onClick={() => openTaskModal()}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-hover haptic-active z-30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </button>
        </div>
    );
}
