
export function convertToFullCalendarEvent(schedules) {
  const initialEvents = []

  for (const schedule of schedules) {

    initialEvents.push({
      id: schedule.eventId,
      start: toISOString(schedule.dayOfWeek[0], schedule.startHours, schedule.startMinutes),
      end: toISOString(schedule.dayOfWeek[0], schedule.endHours, schedule.endMinutes),
    })
  }
  return initialEvents
}

export function createEventId() {
  return crypto.randomUUID();
}

function toISOString(dayOfWeek, hours, minutes) {
  let date = new Date()
  let dayToSet = dayOfWeek;

  var currentDay = date.getUTCDay();
  var distance = dayToSet - currentDay;
  date.setUTCDate(date.getUTCDate() + distance);
  date.setUTCHours(hours, minutes, 0)

  return date.toISOString()
}