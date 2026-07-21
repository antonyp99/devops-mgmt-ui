import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  EventNote as PlanIcon,
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  BarChart as GanttIcon,
  Timeline as TimelineIcon,
  Assignment as ActiveIcon,
  Event as DueIcon,
  Flag as MilestoneIcon,
  Groups as TeamIcon,
} from '@mui/icons-material';

const VIEW_OPTIONS = [
  { key: 'calendar', label: 'Calendar', icon: <CalendarIcon sx={{ fontSize: 15 }} />, disabled: true },
  { key: 'gantt', label: 'Gantt Chart', icon: <GanttIcon sx={{ fontSize: 15 }} /> },
  { key: 'timeline', label: 'Timeline', icon: <TimelineIcon sx={{ fontSize: 15 }} /> },
];

const ReleasePlanning = ({ onNavigate }) => {
  const theme = useTheme();
  const [selectedView, setSelectedView] = useState('gantt');

  const cards = [
    {
      title: 'Active Plans',
      value: '12',
      sub: '3 in progress',
      color: theme.palette.primary.main,
      icon: <ActiveIcon />,
    },
    {
      title: 'Due This Month',
      value: '5',
      sub: '2 at risk',
      color: theme.palette.warning.main,
      icon: <DueIcon />,
    },
    {
      title: 'Total Milestones',
      value: '48',
      sub: '41 on track',
      color: theme.palette.success.main,
      icon: <MilestoneIcon />,
    },
    {
      title: 'Team Utilization',
      value: '78%',
      sub: 'Across 6 teams',
      color: theme.palette.secondary.main,
      icon: <TeamIcon />,
    },
  ];

  return (
    <Box
      sx={{
        p: 1.5,
        height: 'calc(100vh - 112px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        gap: 1.25,
      }}
    >
      {/* ── Header Banner ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${theme.palette.primary.main} 60%, ${alpha(theme.palette.secondary.main, 0.85)} 100%)`,
          borderRadius: '10px',
          px: 2.5,
          py: 1.5,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.18)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PlanIcon sx={{ color: '#fff', fontSize: 22, opacity: 0.9 }} titleAccess="Release Planning" />
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Release Planning
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', lineHeight: 1.3 }}>
              Plan, track, and manage release schedules and dependencies
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Refresh data">
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
              }}
            >
              <RefreshIcon titleAccess="Refresh Data" sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 15 }} />}
            sx={{
              color: '#fff',
              fontSize: '0.72rem',
              py: 0.4,
              px: 1.4,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: 'rgba(255,255,255,0.18)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
            }}
          >
            New Release Plan
          </Button>
          <Button
            title="Back"
            size="small"
            startIcon={<ArrowBackIcon titleAccess="Back" sx={{ fontSize: 15 }} />}
            onClick={() => onNavigate('dashboard')}
            variant="outlined"
            sx={{
              color: '#fff',
              fontSize: '0.75rem',
              py: 0.4,
              px: 1.5,
              borderColor: 'rgba(255,255,255,0.35)',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* ── View Switch ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 0.5,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: 'text.secondary', mr: 0.25 }}>
          View:
        </Typography>
        {VIEW_OPTIONS.map((v) => (
          <Button
            key={v.key}
            size="small"
            disabled={v.disabled}
            startIcon={v.icon}
            onClick={() => setSelectedView(v.key)}
            sx={{
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: selectedView === v.key ? 600 : 400,
              py: 0.35,
              px: 1.25,
              borderRadius: '7px',
              minWidth: 'auto',
              color: selectedView === v.key ? theme.palette.primary.main : 'text.secondary',
              bgcolor: selectedView === v.key ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              border: `1px solid ${selectedView === v.key ? alpha(theme.palette.primary.main, 0.3) : 'transparent'}`,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: selectedView === v.key
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.action.hover, 0.04),
              },
              '&.Mui-disabled': {
                color: alpha(theme.palette.text.disabled, 0.45),
                border: '1px solid transparent',
              },
            }}
          >
            {v.label}
          </Button>
        ))}
      </Box>

      {/* ── Metrics Cards ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        {cards.map((card) => (
          <Paper
            key={card.title}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '10px',
              border: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              '&:hover': {
                boxShadow: `0 2px 12px ${alpha(card.color, 0.1)}`,
                borderColor: alpha(card.color, 0.25),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.74rem', fontWeight: 500, color: 'text.secondary' }}>
                {card.title}
              </Typography>
              <Box sx={{ color: card.color, opacity: 0.55 }}>
                {React.cloneElement(card.icon, { sx: { fontSize: 20 } })}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.1, color: 'text.primary' }}>
              {card.value}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', fontWeight: 400 }}>
              {card.sub}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Upcoming Release Plans ── */}
      <Box>
        <Typography
          sx={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
          }}
        >
          Upcoming Release Plans
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '10px',
            border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
            bgcolor: theme.palette.background.paper,
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
              borderColor: alpha(theme.palette.primary.main, 0.18),
            },
          }}
        >
          {/* Empty State — replace contents below with a list/table when data is available */}
          <CalendarIcon
            sx={{
              fontSize: 38,
              color: alpha(theme.palette.text.disabled, 0.3),
              mb: 1.5,
            }}
          />
          <Typography
            sx={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 0.5,
            }}
          >
            No release plans found
          </Typography>
          <Typography
            sx={{
              fontSize: '0.74rem',
              fontWeight: 400,
              color: 'text.disabled',
            }}
          >
            Create your first release plan to get started
          </Typography>
        </Paper>
      </Box>

      {/* ── Release Timeline ── */}
      <Box>
        <Typography
          sx={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.3,
          }}
        >
          Release Timeline
        </Typography>
        <Typography
          sx={{
            fontSize: '0.72rem',
            fontWeight: 400,
            color: 'text.disabled',
            mb: 1.5,
          }}
        >
          Interactive Gantt chart and timeline visualization – Coming soon
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
            bgcolor: theme.palette.background.paper,
            p: 3,
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
              borderColor: alpha(theme.palette.primary.main, 0.18),
            },
          }}
        >
          {/* Inner chart placeholder area */}
          <Box
            sx={{
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.action.hover, 0.35),
              border: `1px dashed ${alpha(theme.palette.divider, 0.45)}`,
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <GanttIcon
              sx={{
                fontSize: 42,
                color: alpha(theme.palette.text.disabled, 0.28),
                mb: 1.5,
              }}
            />
            <Typography
              sx={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              Gantt chart visualization will be implemented here
            </Typography>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 400,
                color: 'text.disabled',
                textAlign: 'center',
                maxWidth: 420,
              }}
            >
              Features: Drag &amp; drop scheduling, dependency management, resource allocation
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReleasePlanning;
