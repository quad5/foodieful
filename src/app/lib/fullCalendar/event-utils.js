// From DB
export function convertToFullCalendarEvent(schedules) {
  const events = []

  for (const schedule of schedules) {
    const endDayOfWeek = schedule.startHours > schedule.endHours ? schedule.dayOfWeek[0] + 1 : schedule.dayOfWeek[0]
    events.push({
      id: schedule.eventId,
      start: toISOString(schedule.dayOfWeek[0], schedule.startHours, schedule.startMinutes),
      end: toISOString(endDayOfWeek, schedule.endHours, schedule.endMinutes),
    })
  }

  return events
}

// From DB
export function convertToOperatingHours(schedules) {
  let operatingHours = []

  const sorted = schedules.sort((a, b) => new Date(toISOString(a.dayOfWeek[0], a.startHours, a.startMinutes)).valueOf() -
    new Date(toISOString(b.dayOfWeek[0], b.startHours, b.startMinutes)).valueOf())

  for (const schedule of sorted) {

    const startDate = new Date(toISOString(schedule.dayOfWeek[0], schedule.startHours, schedule.startMinutes))
    const endDate = new Date(toISOString(schedule.dayOfWeek[0], schedule.endHours, schedule.endMinutes))

    operatingHours.push({
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