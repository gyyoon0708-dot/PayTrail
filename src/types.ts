export type TaskStatus = 'SCHEDULED' | 'WAITING' | 'OVERDUE' | 'PAID';
export type RecurringType = 'NONE' | 'WEEKLY' | 'MONTHLY' | 'MONTH_END';
export type SubscriptionTier = 'FREE' | 'PRO';
export type CurrencyLocale = 'KRW' | 'USD' | 'EUR';
export type AppLanguage = 'ko' | 'en' | 'ja' | 'es';

export interface Task {
    id: string;
    parent_id?: string;
    company: string;
    contact?: string; // Optional contact person
    amount: number; // Gross amount
    received_amount: number; // For partial payments
    tax_deducted: number; // Typically 3.3%
    status: TaskStatus;
    due_date: string; // ISO date string (YYYY-MM-DD)
    work_date_start?: string; // Optional start date of work
    work_date_end?: string; // Optional end date of work
    paid_date?: string; // ISO date string when finally paid
    is_recurring: boolean;
    recurring_type: RecurringType;
    memo: string; // Multiline notes
    created_at: string; // ISO timestamp
}

export interface UserSettings {
    currency: CurrencyLocale;
    audioEnabled: boolean;

    language: AppLanguage;
}

export interface DraftTask extends Partial<Task> {
    // Partial inputs saved when modal closes
}

export interface StoreState {
    tasks: Task[];
    subscription: SubscriptionTier;
    userSettings: UserSettings;
    draftTask: DraftTask | null;
}

// Stats computed dynamically
export interface ClientAnalytics {
    company: string;
    averageDelayDays: number;
    totalPaidCount: number;
}
