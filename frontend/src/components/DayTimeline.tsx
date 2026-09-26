import { Box, Stack, Tooltip, Typography } from '@mui/material'
import type { BlockedInterval } from '../api'
import { formatTime, minutesIntoDay } from '../time'

const OPENING_MINUTE = 6 * 60
const CLOSING_MINUTE = 22 * 60
const HOUR_MARKS = [6, 8, 10, 12, 14, 16, 18, 20, 22]

const AVAILABLE_BACKGROUND = 'rgba(94, 231, 223, 0.08)'
const BOOKED_BACKGROUND =
  'repeating-linear-gradient(135deg, rgba(255, 110, 130, 0.6) 0 6px, rgba(255, 110, 130, 0.35) 6px 12px)'

function toPercent(minute: number): number {
  const clamped = Math.min(Math.max(minute, OPENING_MINUTE), CLOSING_MINUTE)
  return ((clamped - OPENING_MINUTE) / (CLOSING_MINUTE - OPENING_MINUTE)) * 100
}

function hourLabel(hour: number): string {
  return `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`
}

function labelShift(hour: number): string {
  if (hour === HOUR_MARKS[0]) return 'none'
  if (hour === HOUR_MARKS[HOUR_MARKS.length - 1]) return 'translateX(-100%)'
  return 'translateX(-50%)'
}

function LegendItem({ background, label }: { background: string; label: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: '4px',
          background,
          border: 1,
          borderColor: 'divider',
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  )
}

interface DayTimelineProps {
  blocked: BlockedInterval[]
}

export default function DayTimeline({ blocked }: DayTimelineProps) {
  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: 40,
          borderRadius: '8px',
          overflow: 'hidden',
          background: AVAILABLE_BACKGROUND,
          border: 1,
          borderColor: 'divider',
        }}
      >
        {HOUR_MARKS.slice(1, -1).map((hour) => (
          <Box
            key={hour}
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${toPercent(hour * 60)}%`,
              width: '1px',
              bgcolor: 'divider',
            }}
          />
        ))}

        {blocked.map((interval) => {
          const left = toPercent(minutesIntoDay(interval.start))
          const right = toPercent(minutesIntoDay(interval.end))
          return (
            <Tooltip
              key={interval.start}
              arrow
              title={`Unavailable ${formatTime(interval.start)} – ${formatTime(interval.end)}`}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${left}%`,
                  width: `${right - left}%`,
                  background: BOOKED_BACKGROUND,
                }}
              />
            </Tooltip>
          )
        })}
      </Box>

      <Box sx={{ position: 'relative', height: 20, mt: 0.75 }}>
        {HOUR_MARKS.map((hour) => (
          <Typography
            key={hour}
            variant="caption"
            color="text.secondary"
            sx={{
              position: 'absolute',
              left: `${toPercent(hour * 60)}%`,
              transform: labelShift(hour),
              whiteSpace: 'nowrap',
            }}
          >
            {hourLabel(hour)}
          </Typography>
        ))}
      </Box>

      <Stack direction="row" spacing={3} sx={{ mt: 1.5 }}>
        <LegendItem background={BOOKED_BACKGROUND} label="Booked" />
        <LegendItem background={AVAILABLE_BACKGROUND} label="Available" />
      </Stack>
    </Box>
  )
}
