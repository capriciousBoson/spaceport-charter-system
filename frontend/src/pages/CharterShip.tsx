import { useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  createBooking,
  getAvailability,
  getErrorMessages,
  getShips,
  type BlockedInterval,
  type Ship,
} from '../api'
import { formatDay, formatTime, todayInSpaceport } from '../time'
import DayTimeline from '../components/DayTimeline'
import SectionCard from '../components/SectionCard'

interface AvailabilityResult {
  shipId: number
  date: string
  blocked: BlockedInterval[]
  failed: boolean
}

export default function CharterShip() {
  const [ships, setShips] = useState<Ship[]>([])
  const [shipsFailed, setShipsFailed] = useState(false)
  const [shipId, setShipId] = useState<number | ''>('')
  const [date, setDate] = useState(todayInSpaceport())
  const [result, setResult] = useState<AvailabilityResult | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)

  const [pilotName, setPilotName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    getShips()
      .then(setShips)
      .catch(() => setShipsFailed(true))
  }, [])

  useEffect(() => {
    if (shipId === '' || !date) return

    let ignore = false
    getAvailability(shipId, date)
      .then((blocked) => {
        if (!ignore) setResult({ shipId, date, blocked, failed: false })
      })
      .catch(() => {
        if (!ignore) setResult({ shipId, date, blocked: [], failed: true })
      })

    return () => {
      ignore = true
    }
  }, [shipId, date, refreshCount])

  const current = result && result.shipId === shipId && result.date === date ? result : null
  const selectedShip = ships.find((ship) => ship.id === shipId)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (shipId === '') return

    setSubmitting(true)
    setErrors([])
    setSuccess(null)
    try {
      const booking = await createBooking({
        ship: shipId,
        pilot_name: pilotName,
        start_time: `${date}T${startTime}`,
        end_time: `${date}T${endTime}`,
      })
      setSuccess(
        `Booked for ${booking.pilot_name}: ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}.`,
      )
      setPilotName('')
      setStartTime('')
      setEndTime('')
      setRefreshCount((count) => count + 1)
    } catch (error) {
      setErrors(getErrorMessages(error))
    } finally {
      setSubmitting(false)
    }
  }

  function renderAvailability() {
    if (shipId === '' || !date) {
      return (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Select a ship and a date to see its schedule.
        </Typography>
      )
    }
    if (!current) {
      return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress size={28} />
        </Box>
      )
    }
    if (current.failed) {
      return <Alert severity="error">Could not load availability. Is the backend running?</Alert>
    }

    return (
      <Stack spacing={3}>
        <DayTimeline blocked={current.blocked} />
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          {current.blocked.length === 0 ? (
            <Chip color="success" variant="outlined" label="No bookings — free all day" />
          ) : (
            current.blocked.map((interval) => (
              <Chip
                key={interval.start}
                variant="outlined"
                label={`${formatTime(interval.start)} – ${formatTime(interval.end)}`}
              />
            ))
          )}
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4">Charter a Ship</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Pick a ship and a date to see when it's free, then book an open slot.
        </Typography>
      </Box>

      {shipsFailed && (
        <Alert severity="error">Could not load ships. Is the backend running?</Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
        }}
      >
        <SectionCard
          title="Availability"
          subtitle="Booked times include the 30-minute refuelling buffer. All times are Central Time."
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Ship"
              value={shipId}
              onChange={(e) => setShipId(Number(e.target.value))}
              sx={{ flex: 1 }}
            >
              {ships.map((ship) => (
                <MenuItem key={ship.id} value={ship.id}>
                  {ship.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ flex: 1 }}
            />
          </Stack>
          {renderAvailability()}
        </SectionCard>

        <SectionCard
          title="New booking"
          subtitle={
            selectedShip && date
              ? `${selectedShip.name} · ${formatDay(date)}`
              : 'Select a ship and a date first.'
          }
        >
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              label="Pilot name"
              value={pilotName}
              onChange={(e) => setPilotName(e.target.value)}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                type="time"
                label="Start"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
              <TextField
                type="time"
                label="End"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={shipId === '' || !date || submitting}
            >
              {submitting ? 'Booking…' : 'Book slot'}
            </Button>

            {errors.length > 0 && (
              <Alert severity="error">
                {errors.map((message) => (
                  <div key={message}>{message}</div>
                ))}
              </Alert>
            )}
            {success && (
              <Alert severity="success" onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}
          </Stack>
        </SectionCard>
      </Box>
    </Stack>
  )
}
