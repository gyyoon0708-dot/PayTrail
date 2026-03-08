import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addWeeks, addMonths, endOfMonth } from 'date-fns';
import { StoreState, Task, DraftTask, UserSettings, TaskStatus } from './types';

interface StoreActions {
    // Task Actions
    addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string, deleteRecurringChain?: boolean) => void;

    // Settings Actions
    updateSettings: (settings: Partial<UserSettings>) => void;
    setSubscription: (tier: 'FREE' | 'PRO') => void;

    // Draft Actions
    setDraftTask: (draft: DraftTask | null) => void;

    // Engine Actions (called on mount to update overdue)
    runAutomatedEngine: () => void;
}

const generateRecurringInstances = (
    baseTask: Omit<Task, 'id' | 'created_at'>,
    parentId: string,
    limit: number = 12 // max 12 instances into the future for performance
): Task[] => {
    const instances: Task[] = [];
    const baseDate = new Date(baseTask.due_date);

    for (let i = 0; i < limit; i++) {
        let nextDate = new Date(baseDate);
        let nextWorkStart = baseTask.work_date_start ? new Date(baseTask.work_date_start) : undefined;
        let nextWorkEnd = baseTask.work_date_end ? new Date(baseTask.work_date_end) : undefined;

        if (baseTask.recurring_type === 'WEEKLY') {
            nextDate = addWeeks(baseDate, i);
            if (nextWorkStart) nextWorkStart = addWeeks(new Date(baseTask.work_date_start!), i);
            if (nextWorkEnd) nextWorkEnd = addWeeks(new Date(baseTask.work_date_end!), i);
        } else if (baseTask.recurring_type === 'MONTHLY') {
            nextDate = addMonths(baseDate, i);
            if (nextWorkStart) nextWorkStart = addMonths(new Date(baseTask.work_date_start!), i);
            if (nextWorkEnd) nextWorkEnd = addMonths(new Date(baseTask.work_date_end!), i);
        } else if (baseTask.recurring_type === 'MONTH_END') {
            const targetMonth = addMonths(baseDate, i);
            nextDate = endOfMonth(targetMonth);
            if (nextWorkStart) nextWorkStart = addMonths(new Date(baseTask.work_date_start!), i);
            if (nextWorkEnd) nextWorkEnd = addMonths(new Date(baseTask.work_date_end!), i);
        }

        instances.push({
            ...baseTask,
            id: uuidv4(),
            parent_id: parentId,
            due_date: nextDate.toISOString().split('T')[0],
            work_date_start: nextWorkStart ? nextWorkStart.toISOString().split('T')[0] : undefined,
            work_date_end: nextWorkEnd ? nextWorkEnd.toISOString().split('T')[0] : undefined,
            created_at: new Date().toISOString(),
        });
    }

    return instances;
};

export const useStore = create<StoreState & StoreActions>()(
    persist(
        (set, get) => ({
            tasks: [],
            subscription: 'FREE',
            userSettings: {
                currency: 'KRW',
                audioEnabled: true,

                language: 'ko',
            },
            draftTask: null,

            addTask: (taskData) => {
                const { tasks, subscription } = get();

                // Subscription Check for free tier limit (maximum 5 recurring parent tasks)
                if (taskData.is_recurring && subscription === 'FREE') {
                    const recurringCount = new Set(
                        tasks.filter(t => t.parent_id).map(t => t.parent_id)
                    ).size;

                    if (recurringCount >= 5) {
                        alert('Free tier is limited to 5 recurring task templates. Please upgrade to Pro.');
                        return;
                    }
                }

                if (taskData.is_recurring && taskData.recurring_type !== 'NONE') {
                    const parentId = uuidv4();
                    const newInstances = generateRecurringInstances(taskData, parentId);
                    set((state) => ({ tasks: [...state.tasks, ...newInstances] }));
                } else {
                    const newTask: Task = {
                        ...taskData,
                        id: uuidv4(),
                        created_at: new Date().toISOString(),
                    };
                    set((state) => ({ tasks: [...state.tasks, newTask] }));
                }
            },

            updateTask: (id, updates) => {
                set((state) => {
                    let updatedTasks = state.tasks.map(t => {
                        if (t.id === id) {
                            const merged = { ...t, ...updates };
                            // Handle partial payments overriding status
                            if (merged.status !== 'PAID') {
                                const requiredAmount = merged.amount - merged.tax_deducted;
                                if (merged.received_amount >= requiredAmount) {
                                    merged.status = 'PAID';
                                    merged.paid_date = new Date().toISOString();
                                }
                            }
                            return merged;
                        }
                        return t;
                    });
                    return { tasks: updatedTasks };
                });
            },

            deleteTask: (id, deleteRecurringChain = false) => {
                set((state) => {
                    const targetTask = state.tasks.find(t => t.id === id);
                    if (!targetTask) return state;

                    if (deleteRecurringChain && targetTask.parent_id) {
                        return { tasks: state.tasks.filter(t => t.parent_id !== targetTask.parent_id) };
                    } else {
                        return { tasks: state.tasks.filter(t => t.id !== id) };
                    }
                });
            },

            updateSettings: (settingsArr) => set((state) => ({
                userSettings: { ...state.userSettings, ...settingsArr }
            })),

            setSubscription: (tier) => set({ subscription: tier }),

            setDraftTask: (draft) => set({ draftTask: draft }),

            runAutomatedEngine: () => {
                const today = new Date();
                // Zero time for correct date comparison
                today.setHours(0, 0, 0, 0);

                set((state) => {
                    let hasChanges = false;
                    const updatedTasks = state.tasks.map(task => {
                        if (task.status === 'WAITING' || task.status === 'SCHEDULED') {
                            const dueDate = new Date(task.due_date);
                            dueDate.setHours(0, 0, 0, 0);
                            // if today is after due date
                            if (dueDate < today) {
                                hasChanges = true;
                                return { ...task, status: 'OVERDUE' as TaskStatus };
                            }
                            // if today is exactly the due date and it was previously scheduled
                            if (task.status === 'SCHEDULED' && dueDate.getTime() === today.getTime()) {
                                hasChanges = true;
                                return { ...task, status: 'WAITING' as TaskStatus };
                            }
                        }
                        return task;
                    });

                    if (hasChanges) {
                        console.log("[PayTrail Engine] Overdue and Waiting statuses updated based on system time.");
                        return { tasks: updatedTasks };
                    }
                    return state;
                });
            }
        }),
        {
            name: 'paytrail-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
