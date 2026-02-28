// Shared date/time formatters — used in EventCard, EventModal, EditEvent
// Output: "16 Mar 2026"
export const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
};

// Output: "10:30 AM"
export const getFormattedTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const d = new Date();
    d.setHours(Number(hours), Number(minutes), 0);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};
