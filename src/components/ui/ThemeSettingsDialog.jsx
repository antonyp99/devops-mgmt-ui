import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  Slider,
  Button,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Palette as PaletteIcon,
  TextFields as TextFieldsIcon,
  FormatSize as FormatSizeIcon,
  RestartAlt as ResetIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  DensityMedium as DensityMediumIcon,
} from '@mui/icons-material';
import { COLOR_PRESETS, FONT_OPTIONS, SIZE_RANGE, useThemePrefs } from '../../contexts/ThemeContext';

// ── Colour swatch card ────────────────────────────────────────────────────────
function ColorCard({ preset, selected, onClick }) {
  const theme = useTheme();
  return (
    <Tooltip title={preset.name} placement="top" arrow>
      <Box
        onClick={() => onClick(preset.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(preset.id)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          p: 1,
          borderRadius: 2,
          cursor: 'pointer',
          border: '2px solid',
          borderColor: selected ? preset.preview[0] : 'divider',
          bgcolor: selected ? alpha(preset.preview[0], 0.06) : 'background.paper',
          transition: 'all 0.18s',
          minWidth: 64,
          '&:hover': {
            borderColor: preset.preview[0],
            bgcolor: alpha(preset.preview[0], 0.08),
          },
        }}
      >
        {/* Two-tone preview circles */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {preset.preview.map((color, i) => (
            <Box
              key={i}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: color,
                boxShadow: selected
                  ? `0 0 0 2px ${alpha(color, 0.4)}`
                  : 'none',
              }}
            />
          ))}
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            fontWeight: selected ? 700 : 500,
            color: selected ? preset.preview[0] : 'text.secondary',
            textAlign: 'center',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {preset.name}
        </Typography>
      </Box>
    </Tooltip>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
const MODE_OPTIONS = [
  { id: 'light', label: 'Light', icon: <LightModeIcon fontSize="small" /> },
  { id: 'dark', label: 'Dark', icon: <DarkModeIcon fontSize="small" /> },
];

const DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
];

function SectionLabel({ icon, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      {icon}
      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        {label}
      </Typography>
    </Box>
  );
}

// ── Main dialog ───────────────────────────────────────────────────────────────
export default function ThemeSettingsDialog({ open, onClose }) {
  const { prefs, setPrefs, resetPrefs } = useThemePrefs();
  const theme = useTheme();

  const handleReset = () => {
    resetPrefs();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          },
        },
      }}
    >
      {/* Title bar */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PaletteIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Appearance Settings
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* ── Color Theme ── */}
        <SectionLabel
          icon={<PaletteIcon fontSize="small" color="primary" />}
          label="Color Theme"
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 3,
          }}
        >
          {COLOR_PRESETS.map((preset) => (
            <ColorCard
              key={preset.id}
              preset={preset}
              selected={prefs.colorPresetId === preset.id}
              onClick={(id) => setPrefs({ colorPresetId: id })}
            />
          ))}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ── Theme Mode ── */}
        <SectionLabel
          icon={<LightModeIcon fontSize="small" color="primary" />}
          label="Theme Mode"
        />
        <ToggleButtonGroup
          value={prefs.mode}
          exclusive
          size="small"
          onChange={(_, value) => value && setPrefs({ mode: value })}
          sx={{ mb: 3, gap: 1, flexWrap: 'wrap' }}
        >
          {MODE_OPTIONS.map((option) => (
            <ToggleButton key={option.id} value={option.id} sx={{ textTransform: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon}
                <Typography variant="body2">{option.label}</Typography>
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider sx={{ mb: 3 }} />

        {/* ── Spacing Density ── */}
        <SectionLabel
          icon={<DensityMediumIcon fontSize="small" color="primary" />}
          label="Spacing Density"
        />
        <ToggleButtonGroup
          value={prefs.density}
          exclusive
          size="small"
          onChange={(_, value) => value && setPrefs({ density: value })}
          sx={{ mb: 3, gap: 1, flexWrap: 'wrap' }}
        >
          {DENSITY_OPTIONS.map((option) => (
            <ToggleButton key={option.id} value={option.id} sx={{ textTransform: 'none' }}>
              <Typography variant="body2">{option.label}</Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider sx={{ mb: 3 }} />

        {/* ── Font Family ── */}
        <SectionLabel
          icon={<TextFieldsIcon fontSize="small" color="primary" />}
          label="Font Family"
        />
        <Select
          size="small"
          fullWidth
          value={prefs.fontId}
          onChange={(e) => setPrefs({ fontId: e.target.value })}
          sx={{ mb: 3, borderRadius: 2 }}
          renderValue={(id) => {
            const f = FONT_OPTIONS.find((o) => o.id === id);
            return (
              <Typography
                sx={{
                  fontFamily: f ? f.value : 'inherit',
                  fontSize: '0.9rem',
                }}
              >
                {f?.label ?? id}
              </Typography>
            );
          }}
        >
          {FONT_OPTIONS.map((font) => (
            <MenuItem key={font.id} value={font.id}>
              <Typography sx={{ fontFamily: font.value }}>{font.label}</Typography>
            </MenuItem>
          ))}
        </Select>

        <Divider sx={{ mb: 3 }} />

        {/* ── Font Size ── */}
        <SectionLabel
          icon={<FormatSizeIcon fontSize="small" color="primary" />}
          label="Font Size"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', minWidth: 24 }}>
            A
          </Typography>
          <Slider
            value={prefs.fontSize}
            min={SIZE_RANGE.min}
            max={SIZE_RANGE.max}
            step={1}
            onChange={(_, v) => setPrefs({ fontSize: v })}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}px`}
            marks={[
              { value: SIZE_RANGE.min, label: `${SIZE_RANGE.min}px` },
              { value: SIZE_RANGE.default, label: 'Default' },
              { value: SIZE_RANGE.max, label: `${SIZE_RANGE.max}px` },
            ]}
            sx={{
              flex: 1,
              color: theme.palette.primary.main,
              '& .MuiSlider-markLabel': { fontSize: '0.65rem', color: 'text.secondary' },
            }}
          />
          <Typography
            sx={{ fontSize: '1.1rem', fontWeight: 700, minWidth: 24, textAlign: 'right' }}
            color="text.secondary"
          >
            A
          </Typography>
        </Box>

        {/* Live preview strip */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            border: '1px dashed',
            borderColor: alpha(theme.palette.primary.main, 0.25),
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Live Preview
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_OPTIONS.find((f) => f.id === prefs.fontId)?.value,
              fontSize: prefs.fontSize,
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            DevOps Management Portal
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_OPTIONS.find((f) => f.id === prefs.fontId)?.value,
              fontSize: prefs.fontSize - 2,
              color: 'text.secondary',
            }}
          >
            The quick brown fox jumps over the lazy dog
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between',
        }}
      >
        <Button
          startIcon={<ResetIcon />}
          onClick={handleReset}
          color="inherit"
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          Reset to Defaults
        </Button>
        <Button variant="contained" onClick={onClose} size="small" disableElevation>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
