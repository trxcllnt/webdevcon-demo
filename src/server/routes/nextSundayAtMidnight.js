export function nextSundayAtMidnight() {
    const today = new Date();
    const daysUntilSunday = 7 - today.getDay();
    const sunday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + daysUntilSunday
    );
    return sunday.getTime();
}
