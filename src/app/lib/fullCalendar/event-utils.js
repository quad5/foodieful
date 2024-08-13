
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

export function convertToOperatingHours(schedules) {
  let operatingHours = []

  for (const schedule of schedules) {
    const startDate = new Date(toISOString(schedule.dayOfWeek[0], schedule.startHours, schedule.startMinutes))
    const endDate = new Date(toISOString(schedule.dayOfWeek[0], schedule.endHours, schedule.endMinutes))

    operatingHours = operatingHours.toSpliced(startDate.getDay(), 0, {
      time: `${startDate.toLocaleTimeString('en-US')} - ${endDate.toLocaleTimeString('en-US')}`,
      day: convertToDayString(startDate.getDay())
    })
  }
  return operatingHours
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

function convertToDayString(value) {
  return {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }[value]
}