import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays } from 'date-fns';
import { CurrencyLocale, Task } from '../types';

/**
 * Utility to merge Tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Validates and Calculates Tax based on KRW standard 3.3% rate
 * Returns pure numbers, rounded correctly.
 */
export const taxUtils = {
    // gross * 0.967
    calculateNetFromGross: (gross: number): number => {
        return gross * 0.967; // Leaves 96.7%
    },
    // net / 0.967
    calculateGrossFromNet: (net: number): number => {
        return net / 0.967;
    },
    // the exact tax subtracted
    calculateTaxDeducted: (gross: number): number => {
        return gross * 0.033;
    }
};

/**
 * Currency Formatting based on locale rules.
 * KRW: No decimals
 * USD/EUR: 2 decimals
 */
export const formatCurrency = (amount: number, currency: CurrencyLocale): string => {
    const isKRW = currency === 'KRW';

    // Format rounding properly before sending to Intl
    const roundedAmount = isKRW ? Math.round(amount) : Number(amount.toFixed(2));

    let localeCode = 'ko-KR';
    let currencyCode = 'KRW';

    if (currency === 'USD') {
        localeCode = 'en-US';
        currencyCode = 'USD';
    } else if (currency === 'EUR') {
        localeCode = 'de-DE';
        currencyCode = 'EUR';
    }

    return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: isKRW ? 0 : 2,
        minimumFractionDigits: isKRW ? 0 : 2,
    }).format(roundedAmount);
};


/**
 * Compute the specific client delay stats
 */
export const calculateClientAnalytics = (company: string, tasks: Task[]) => {
    const compTasks = tasks.filter(t => t.company === company && t.status === 'PAID' && t.paid_date);
    if (compTasks.length === 0) return { averageDelayDays: 0, totalPaidCount: 0 };

    let totalDelays = 0;
    compTasks.forEach(task => {
        if (task.paid_date && task.due_date) {
            const delay = differenceInDays(new Date(task.paid_date), new Date(task.due_date));
            totalDelays += delay > 0 ? delay : 0; // only count actual delays
        }
    });

    return {
        averageDelayDays: Math.round(totalDelays / compTasks.length),
        totalPaidCount: compTasks.length,
    };
};
