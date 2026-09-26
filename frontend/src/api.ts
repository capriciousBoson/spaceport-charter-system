import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// ---- Shapes of the JSON the backend sends and receives ----

export interface Ship {
  id: number
  name: string
  booking_count: number
}

export interface Booking {
  id: number
  ship: number
  pilot_name: string
  start_time: string
  end_time: string
}

export type NewBooking = Omit<Booking, 'id'>

// export interface ShipWithBookings extends Ship {
//   bookings: Booking[]
// }
export interface Page<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}


export interface BlockedInterval {
  start: string
  end: string
}

// ---- One function per endpoint ----

export async function getShips(): Promise<Ship[]> {
  const response = await api.get<Ship[]>('/ships/')
  return response.data
}

export async function getAvailability(shipId: number, date: string): Promise<BlockedInterval[]> {
  const response = await api.get<BlockedInterval[]>('/availability/', {
    params: { ship: shipId, date },
  })
  return response.data
}

export async function createBooking(booking: NewBooking): Promise<Booking> {
  const response = await api.post<Booking>('/bookings/', booking)
  return response.data
}

// export async function getFleetBookings(): Promise<ShipWithBookings[]> {
//   const response = await api.get<ShipWithBookings[]>('/bookings/')
//   return response.data
// }
export async function getBookings(
  shipId: number,
  page: number,
  pageSize: number,
): Promise<Page<Booking>> {
  const response = await api.get<Page<Booking>>('/bookings/', {
    params: { ship: shipId, page, page_size: pageSize },
  })
  return response.data
}


// ---- Error handling ----

export function getErrorMessages(error: unknown): string[] {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const fieldErrors = error.response.data as Record<string, string[]>
    return Object.entries(fieldErrors).flatMap(([field, messages]) =>
      field === 'non_field_errors' ? messages : messages.map((message) => `${field}: ${message}`),
    )
  }
  return ['Something went wrong. Is the backend running?']
}

