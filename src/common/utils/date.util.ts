export class DateUtils {
    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    static formatDateTime(date: Date): string {
        return date.toISOString().replace('T', ' ').substring(0, 19);
    }

    static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000);
    }

    static getDifferenceInMinutes(start: Date, end: Date): number {
        return Math.floor((end.getTime() - start.getTime()) / 60000);
    }

    static now(): Date {
        return new Date();
    }
}
