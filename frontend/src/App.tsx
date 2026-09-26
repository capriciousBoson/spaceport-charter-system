import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { Navigate, NavLink, Route, Routes } from 'react-router'
import CharterShip from './pages/CharterShip'
import Dashboard from './pages/Dashboard'

const navButtonSx = {
  color: 'text.secondary',
  px: 2,
  '&.active': { color: 'primary.main', bgcolor: 'rgba(255, 255, 255, 0.12)' },
}

function App() {
  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <RocketLaunchIcon sx={{ color: 'primary.main', mr: 1.5 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Pacific Spaceport
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 1 }}>
                Charter System
              </Box>
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button component={NavLink} to="/charter" sx={navButtonSx}>
                Charter a Ship
              </Button>
              <Button component={NavLink} to="/dashboard" sx={navButtonSx}>
                Fleet Dashboard
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/charter" replace />} />
          <Route path="/charter" element={<CharterShip />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </>
  )
}

export default App

