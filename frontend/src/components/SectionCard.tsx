import type { ReactNode } from 'react'
import { Paper, Stack, Typography } from '@mui/material'
import { glassSx } from '../theme'

interface SectionCardProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

export default function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, ...glassSx }}>
      <Stack spacing={2.5}>
        <div>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </div>
        {children}
      </Stack>
    </Paper>
  )
}
