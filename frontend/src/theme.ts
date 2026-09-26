import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#fafbfe' },
    secondary: { main: '#63a19d' },
    background: { default: '#192a68', paper: '#313264' },
    divider: 'rgba(148, 163, 184, 0.14)',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter Variable", "Segoe UI", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(ellipse at 5% 0%, rgba(233, 82, 247, 0.62), transparent 50%),' +
            'radial-gradient(ellipse at 90% 5%, rgba(9, 204, 248, 0.54), transparent 40%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
        },
      },
    },
  },
})
export const glassSx = {
  bgcolor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
}


export default theme
