import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { createTheme, alpha } from '@mui/material/styles';

const STORAGE_KEY = 'devops_theme_prefs';

/**
 * 6 curated color palettes — each supplies a complete primary + secondary + background combo.
 * The first entry ('indigo') matches the original app palette and is the default.
 */
export const COLOR_PRESETS = [
  {
    id: 'indigo',
    name: 'Indigo',
    preview: ['#5C6BC0', '#7C4DFF'],
    palette: {
      primary: { main: '#5C6BC0', light: '#C5CAE9', dark: '#3949AB', contrastText: '#fff' },
      secondary: { main: '#7C4DFF' },
      background: { default: '#F4F6F9', paper: '#ffffff' },
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    preview: ['#0d47a1', '#00838f'],
    palette: {
      primary: { main: '#0d47a1', light: '#bbdefb', dark: '#002171', contrastText: '#fff' },
      secondary: { main: '#00838f' },
      background: { default: '#f5f7fa', paper: '#ffffff' },
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    preview: ['#1b5e20', '#00695c'],
    palette: {
      primary: { main: '#1b5e20', light: '#c8e6c9', dark: '#003300', contrastText: '#fff' },
      secondary: { main: '#00695c' },
      background: { default: '#f1f8e9', paper: '#ffffff' },
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: ['#bf360c', '#e65100'],
    palette: {
      primary: { main: '#bf360c', light: '#ffccbc', dark: '#870000', contrastText: '#fff' },
      secondary: { main: '#e65100' },
      background: { default: '#fff8f0', paper: '#ffffff' },
    },
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    preview: ['#4a148c', '#880e4f'],
    palette: {
      primary: { main: '#4a148c', light: '#e1bee7', dark: '#12005e', contrastText: '#fff' },
      secondary: { main: '#880e4f' },
      background: { default: '#faf5ff', paper: '#ffffff' },
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    preview: ['#212121', '#757575'],
    palette: {
      primary: { main: '#212121', light: '#484848', dark: '#000000', contrastText: '#fff' },
      secondary: { main: '#757575' },
      background: { default: '#fafafa', paper: '#ffffff' },
    },
  },
];

export const FONT_OPTIONS = [
  { id: 'inter',    label: 'Inter',      value: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
  { id: 'roboto',   label: 'Roboto',     value: '"Roboto", "Helvetica", "Arial", sans-serif' },
  { id: 'poppins',  label: 'Poppins',    value: '"Poppins", "Roboto", sans-serif' },
  { id: 'opensans', label: 'Open Sans',  value: '"Open Sans", "Roboto", sans-serif' },
  { id: 'fira',     label: 'Fira Sans',  value: '"Fira Sans", "Roboto", sans-serif' },
  { id: 'lato',     label: 'Lato',       value: '"Lato", "Roboto", sans-serif' },
  { id: 'nunito',   label: 'Nunito',     value: '"Nunito", "Roboto", sans-serif' },
];

export const SIZE_RANGE = { min: 12, max: 20, default: 14 };

export const THEME_MODES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export const DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
];

const defaults = {
  colorPresetId: 'emerald',
  fontId: 'inter',
  fontSize: SIZE_RANGE.default,
  mode: 'light',
  density: 'comfortable',
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function buildTheme(prefs) {
  const preset = COLOR_PRESETS.find((p) => p.id === prefs.colorPresetId) || COLOR_PRESETS[0];
  const font = FONT_OPTIONS.find((f) => f.id === prefs.fontId) || FONT_OPTIONS[0];
  const isDark = prefs.mode === 'dark';
  const isCompact = prefs.density === 'compact';

  const background = isDark
    ? { default: '#121212', paper: '#1e1e2a' }
    : preset.palette.background;

  return createTheme({
    palette: {
      mode: prefs.mode,
      ...preset.palette,
      background,
      text: {
        primary: isDark ? '#ECEFF1' : '#263238',
        secondary: isDark ? '#B0BEC5' : '#607D8B',
      },
      success: { main: '#43A047' },
      warning: { main: '#FB8C00' },
      error: { main: '#E53935' },
      divider: isDark ? 'rgba(255,255,255,0.12)' : '#E8EAF6',
      action: {
        hover: isDark ? 'rgba(255,255,255,0.08)' : `${preset.palette.primary.main}14`,
        selected: isDark ? 'rgba(255,255,255,0.12)' : `${preset.palette.primary.main}1f`,
      },
    },
    typography: {
      fontFamily: font.value,
      fontSize: prefs.fontSize,
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      body2: { fontSize: '0.8125rem' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E8EAF6'}`,
            boxShadow: isDark
              ? '0 2px 12px rgba(0,0,0,0.24)'
              : '0 2px 12px rgba(92,107,192,0.06)',
          },
        },
      },
      MuiButton: {
        defaultProps: { size: isCompact ? 'small' : 'medium' },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            padding: isCompact ? '6px 12px' : '10px 16px',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: isCompact ? 6 : 8,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: isCompact ? 36 : 48,
            paddingTop: isCompact ? 6 : 10,
            paddingBottom: isCompact ? 6 : 10,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: background.paper,
            color: isDark ? '#ECEFF1' : '#263238',
            boxShadow: isDark
              ? '0 12px 28px rgba(0,0,0,0.45)'
              : '0 16px 40px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: background.paper,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: background.paper,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: isDark ? '#ECEFF1' : '#263238',
            '&.Mui-selected': {
              backgroundColor: alpha(preset.palette.primary.main, 0.18),
            },
            '&.Mui-selected:hover': {
              backgroundColor: alpha(preset.palette.primary.main, 0.22),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: isCompact ? '8px 12px' : '12px 16px',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: isCompact ? 44 : 56,
            paddingLeft: isCompact ? 12 : 16,
            paddingRight: isCompact ? 12 : 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 8 },
        },
      },
    },
  });
}

const ThemePrefsContext = createContext(null);

export function ThemePrefsProvider({ children }) {
  const [prefs, setPrefsState] = useState(() => ({ ...defaults, ...loadPrefs() }));

  const setPrefs = useCallback((partial) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...partial };
      savePrefs(next);
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    savePrefs(defaults);
    setPrefsState(defaults);
  }, []);

  const theme = useMemo(() => buildTheme(prefs), [prefs]);

  // Push primary color into CSS custom properties so App.css !important rules
  // (MRT table header background + row hover) respond to theme changes.
  useEffect(() => {
    const preset = COLOR_PRESETS.find((p) => p.id === prefs.colorPresetId) || COLOR_PRESETS[0];
    const hex = preset.palette.primary.main.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const root = document.documentElement;
    root.style.setProperty('--mrt-header-bg', preset.palette.primary.main);
    root.style.setProperty('--mrt-header-color', preset.palette.primary.contrastText || '#fff');
    root.style.setProperty('--mrt-row-hover-bg', `rgba(${r}, ${g}, ${b}, 0.08)`);
  }, [prefs.colorPresetId]);

  useEffect(() => {
    document.body.dataset.theme = prefs.mode;
  }, [prefs.mode]);

  useEffect(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${theme.palette.primary.main}"/>
            <stop offset="100%" stop-color="${theme.palette.secondary.main}"/>
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#bg)"/>
        <g transform="translate(32 32)" fill="none" stroke="${theme.palette.primary.contrastText || '#fff'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M-2.5-14.5h5l1 3.5 3-1.2 3.5-3.5 3.5 3.5-1.8 3.8 2.8 1.8 3.5-1v5l-3.5 1-1.2 3 3.5 3.5-3.5 3.5-3.8-1.8-1.8 2.8 1 3.5h-5l-1-3.5-3 1.2-3.5 3.5-3.5-3.5 1.8-3.8-2.8-1.8-3.5 1v-5l3.5-1 1.2-3-3.5-3.5 3.5-3.5 3.8 1.8 1.8-2.8z"/>
          <circle cx="0" cy="0" r="5"/>
        </g>
        <g fill="none" stroke="${theme.palette.primary.contrastText || '#fff'}" stroke-width="2.2" stroke-linecap="round" opacity="0.85">
          <polyline points="20,28 16,32 20,36"/>
          <polyline points="44,28 48,32 44,36"/>
          <line x1="35" y1="25" x2="29" y2="39"/>
        </g>
      </svg>
    `;

    const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    let iconLink = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      iconLink.type = 'image/svg+xml';
      document.head.appendChild(iconLink);
    }
    iconLink.href = href;

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.content = prefs.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.main;
    }
  }, [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.primary.contrastText, theme.palette.background.default, prefs.mode, theme]);

  return (
    <ThemePrefsContext.Provider value={{ prefs, setPrefs, resetPrefs, theme }}>
      {children}
    </ThemePrefsContext.Provider>
  );
}

export function useThemePrefs() {
  const ctx = useContext(ThemePrefsContext);
  if (!ctx) throw new Error('useThemePrefs must be inside ThemePrefsProvider');
  return ctx;
}
