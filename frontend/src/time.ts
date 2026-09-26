export const SPACEPORT_TIME_ZONE = 'America/Chicago'

export function todayInSpaceport(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: SPACEPORT_TIME_ZONE })
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: SPACEPORT_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    timeZone: SPACEPORT_TIME_ZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const clockFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: SPACEPORT_TIME_ZONE,
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
})

export function minutesIntoDay(isoString: string): number {
  const parts = clockFormatter.formatToParts(new Date(isoString))
  const hour = Number(parts.find((part) => part.type === 'hour')?.value)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value)
  return hour * 60 + minute
}

export function formatDay(dateString: string): string {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
