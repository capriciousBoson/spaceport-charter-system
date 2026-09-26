import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getShips, type Ship } from '../api'
import { glassSx } from '../theme'
import ShipBookingsTable from '../components/ShipBookingsTable'

export default function Dashboard() {
  const [ships, setShips] = useState<Ship[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    getShips()
      .then(setShips)
      .catch(() => setFailed(true))
  }, [])

  function renderFleet() {
    if (failed) {
      return <Alert severity="error">Could not load ships. Is the backend running?</Alert>
    }
    if (!ships) {
      return <CircularProgress size={24} />
    }
    return (
      <Stack spacing={1.5}>
        {ships.map((ship) => (
          <Accordion
            key={ship.id}
            variant="outlined"
            disableGutters
            slotProps={{ transition: { unmountOnExit: true } }}
            sx={{ ...glassSx, borderRadius: 1, '&::before': { display: 'none' } }}
          >

            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }}>{ship.name}</Typography>
              <Typography color="text.secondary" sx={{ mr: 2 }}>
                {ship.booking_count} bookings
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {ship.booking_count === 0 ? (
                <Typography color="text.secondary">No bookings.</Typography>
              ) : (
                <ShipBookingsTable shipId={ship.id} />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Fleet Dashboard</Typography>
      <div>{renderFleet()}</div>
    </Stack>
  )
}
