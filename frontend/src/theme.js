import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f19',
      paper: '#111827',
    },
    primary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#0b0f19',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    info: {
      main: '#38bdf8',
    },
    error: {
      main: '#f43f5e',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      disabled: '#64748b',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
    h1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
      color: '#94a3b8',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    overline: {
      letterSpacing: '0.15em',
      fontWeight: 700,
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a2332',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: '#f59e0b',
            },
          },
        },
      },
    },
  },
});

export default theme;
