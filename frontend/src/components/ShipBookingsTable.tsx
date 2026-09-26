import { useEffect, useState } from 'react'
import {
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { getBookings, type Booking } from '../api'
import { formatDate, formatTime } from '../time'

interface ShipBookingsTableProps {
  shipId: number
}

interface PageResult {
  page: number
  rowsPerPage: number
  count: number
  bookings: Booking[]
  failed: boolean
}

export default function ShipBookingsTable({ shipId }: ShipBookingsTableProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [result, setResult] = useState<PageResult | null>(null)

  useEffect(() => {
    let ignore = false
    getBookings(shipId, page + 1, rowsPerPage)
      .then((data) => {
        if (!ignore) {
          setResult({ page, rowsPerPage, count: data.count, bookings: data.results, failed: false })
        }
      })
      .catch(() => {
        if (!ignore) setResult({ page, rowsPerPage, count: 0, bookings: [], failed: true })
      })

    return () => {
      ignore = true
    }
  }, [shipId, page, rowsPerPage])

  if (!result) {
    return <CircularProgress size={24} />
  }
  if (result.failed) {
    return <Alert severity="error">Could not load bookings. Is the backend running?</Alert>
  }

  const isCurrent = result.page === page && result.rowsPerPage === rowsPerPage

  return (
    <>
      <Table size="small" sx={{ opacity: isCurrent ? 1 : 0.5 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Pilot</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{formatDate(booking.start_time)}</TableCell>
              <TableCell>{formatTime(booking.start_time)}</TableCell>
              <TableCell>{formatTime(booking.end_time)}</TableCell>
              <TableCell>{booking.pilot_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={result.count}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(_event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value))
          setPage(0)
        }}
      />
    </>
  )
}
