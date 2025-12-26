import ContentCalendar from './ContentCalendar';

export default function CalendarSection() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight px-4">Calendar</h1>
            <ContentCalendar />
        </div>
    );
}
