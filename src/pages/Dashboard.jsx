import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Avatar,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Launch as LaunchIcon,
  TrendingUp as TrendingUpIcon,
  Source as SourceIcon,
  Approval as ApprovalIcon,
  ListAlt as ListAltIcon,
  InboxOutlined as InboxIcon,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  HealthAndSafety as HealthIcon,
  SettingsApplications as ProfileEditorIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useAuth } from '../services/AuthProvider';
import { useAlertCenter } from '../contexts/AlertCenter';

// --- Status helpers ---
const statusConfig = {
  PENDING_APPROVAL: { label: 'Pending', color: 'warning', icon: <PendingIcon fontSize="small" titleAccess="Pending" /> },
  APPROVED: { label: 'Approved', color: 'info', icon: <CheckCircleIcon fontSize="small" titleAccess="Approved" /> },
  CREATED: { label: 'Created', color: 'success', icon: <CheckCircleIcon fontSize="small" titleAccess="Created" /> },
  REJECTED: { label: 'Rejected', color: 'error', icon: <ErrorIcon fontSize="small" titleAccess="Rejected" /> },
  FAILED: { label: 'Failed', color: 'error', icon: <ErrorIcon fontSize="small" titleAccess="Failed" /> },
};

// --- Shared card style ---
const cardSx = {
  borderRadius: 4,
  boxShadow: '0 2px 12px rgba(92,107,192,0.06)',
  border: '1px solid',
  borderColor: 'divider',
  height: '100%',
  transition: 'box-shadow 0.2s ease',
};

// --- MRT table styles (compact for dashboard) ---
const dashboardTableProps = {
  sx: {
    tableLayout: 'auto',
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      fontSize: '0.8rem',
      borderBottom: '2px solid #e0e0e0',
      whiteSpace: 'nowrap',
      padding: '6px 10px',
    },
    '& .MuiTableCell-body': {
      padding: '4px 10px',
      fontSize: '0.8rem',
    },
    '& .MuiTableRow-root': {
      minHeight: 32,
    },
  },
};

// --- Empty state component ---
const EmptyState = ({ icon, title, subtitle }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 5,
    }}
  >
    {icon}
    <Typography variant="subtitle1" fontWeight={600} color="text.secondary" sx={{ mt: 1.5 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.disabled">
      {subtitle}
    </Typography>
  </Box>
);

// --- Quick Action card style ---
const ActionButton = ({ icon, label, onClick }) => {
  const theme = useTheme();
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 12px rgba(92,107,192,0.06)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(92,107,192,0.14)',
          borderColor: theme.palette.primary.light,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2, '&:last-child': { pb: 2 } }}>
        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 40, height: 40 }}>
          {React.cloneElement(icon, { sx: { color: theme.palette.primary.main, fontSize: 20 } })}
        </Avatar>
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

// --- Hardcoded recent activities (will be replaced with API data in future) ---
const RECENT_ACTIVITIES = [
  { id: 1, title: 'Release v2.1.0 deployed', description: 'Frontend Redesign successfully deployed to production', timestamp: 'Apr 7, 2026, 10:15 PM', user: 'Carol Davis', dotColor: '#1976d2', icon: <CheckCircleIcon sx={{ color: '#1976d2', fontSize: 18 }} /> },
  { id: 2, title: 'Critical vulnerability detected', description: 'CVE-2024-1236 found in crypto library', timestamp: 'Apr 6, 2026, 4:45 PM', user: 'Security Scanner', dotColor: '#e53935', icon: <ErrorIcon sx={{ color: '#e53935', fontSize: 18 }} /> },
  { id: 3, title: 'Release approval granted', description: 'Spring Security Update approved for testing', timestamp: 'Apr 5, 2026, 7:50 PM', user: 'Alice Johnson', dotColor: '#43a047', icon: <CheckCircleIcon sx={{ color: '#43a047', fontSize: 18 }} /> },
  { id: 4, title: 'Staging deployment completed', description: 'Data Processing Engine deployed to staging', timestamp: 'Apr 4, 2026, 3:00 PM', user: 'Bob Smith', dotColor: '#757575', icon: <LaunchIcon sx={{ color: '#757575', fontSize: 18 }} /> },
  { id: 5, title: 'New repository created', description: 'notification-ui repository provisioned in GitLab', timestamp: 'Apr 3, 2026, 11:30 AM', user: 'John Doe', dotColor: '#1976d2', icon: <SourceIcon sx={{ color: '#1976d2', fontSize: 18 }} /> },
  { id: 6, title: 'Approval request submitted', description: 'customer-profile-svc awaiting manager approval', timestamp: 'Apr 2, 2026, 9:20 AM', user: 'Jane Smith', dotColor: '#fb8c00', icon: <PendingIcon sx={{ color: '#fb8c00', fontSize: 18 }} /> },
  { id: 7, title: 'Pipeline failure detected', description: 'Build failed for auth-service on main branch', timestamp: 'Apr 1, 2026, 6:10 PM', user: 'CI Pipeline', dotColor: '#e53935', icon: <ErrorIcon sx={{ color: '#e53935', fontSize: 18 }} /> },
  { id: 8, title: 'Profile config updated', description: 'Production database config updated for payment-svc', timestamp: 'Mar 31, 2026, 2:45 PM', user: 'Admin', dotColor: '#43a047', icon: <CheckCircleIcon sx={{ color: '#43a047', fontSize: 18 }} /> },
];

const ACTIVITY_PREVIEW_COUNT = 4;

// Reusable Activity item for both preview and dialog
const ActivityItem = ({ item }) => (
  <Box sx={{ display: 'flex', gap: 2, py: 1 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.dotColor }} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
        {item.title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {item.description}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        {item.timestamp} • {item.user}
      </Typography>
    </Box>
  </Box>
);

const Dashboard = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [myRequests, setMyRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityDialogFullscreen, setActivityDialogFullscreen] = useState(false);

  // Data source — swap with API call in future
  const recentActivities = RECENT_ACTIVITIES;

  // Quick actions matching the 4 menu items
  const quickActions = [
    { id: 'create-repository', label: 'Submit Git Repository', description: 'Create a new repository request', navigateTo: 'create-repository', icon: <AddIcon />, color: theme.palette.primary.main },
    { id: 'requests', label: 'My Repository Requests', description: 'Track your provisioning requests', navigateTo: 'requests', icon: <HistoryIcon />, color: theme.palette.info.main },
    { id: 'approvals', label: 'Pending Approvals', description: 'Review items awaiting approval', navigateTo: 'approvals', icon: <ApprovalIcon />, color: theme.palette.warning.main },
    { id: 'profile-editor', label: 'Generate Profile Editor', description: 'Configure application profiles', navigateTo: 'profile-editor', icon: <ProfileEditorIcon />, color: theme.palette.success.main },
  ];

  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: replace with real API calls when backend endpoints are ready
      setMyRequests([]);
      setPendingRequests([]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Recent Requests MRT columns ---
  const recentColumns = useMemo(() => [
    {
      accessorKey: 'repository_name',
      header: 'Repository',
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={600}>{cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'repo_type',
      header: 'Type',
      size: 90,
      Cell: ({ cell }) => <Chip size="small" label={cell.getValue()} variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />,
    },
    {
      accessorKey: 'tech_stack',
      header: 'Tech Stack',
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 130,
      Cell: ({ cell }) => {
        const val = cell.getValue();
        const cfg = statusConfig[val] || { label: val, color: 'default' };
        return <Chip icon={cfg.icon} size="small" label={cfg.label} color={cfg.color} sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24 }} />;
      },
    },
    {
      accessorKey: 'created_on',
      header: 'Created',
      size: 110,
      Cell: ({ cell }) => (
        <Typography variant="body2">{new Date(cell.getValue()).toLocaleDateString()}</Typography>
      ),
    },
    {
      id: 'actions',
      header: 'GitLab',
      size: 70,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Tooltip title={row.original.gitlab_web_url ? 'Open in GitLab' : 'Not available yet'}>
          <span>
            <IconButton
              size="small"
              disabled={!row.original.gitlab_web_url}
              onClick={() => window.open(row.original.gitlab_web_url, '_blank', 'noopener')}
            >
              <LaunchIcon fontSize="small" titleAccess="Open in GitLab" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    },
  ], []);

  // --- Pending Approvals MRT columns ---
  const pendingColumns = useMemo(() => [
    {
      accessorKey: 'repository_name',
      header: 'Repository',
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={600}>{cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'requested_by',
      header: 'Requested By',
      size: 120,
    },
    {
      accessorKey: 'tech_stack',
      header: 'Stack',
      size: 90,
    },
    {
      accessorKey: 'created_on',
      header: 'Created',
      size: 110,
      Cell: ({ cell }) => (
        <Typography variant="body2">{new Date(cell.getValue()).toLocaleDateString()}</Typography>
      ),
    },
  ], []);

  // Limit dashboard tables to last 5 records (sorted by newest first)
  const recentData = useMemo(
    () => [...myRequests].sort((a, b) => new Date(b.created_on) - new Date(a.created_on)).slice(0, 5),
    [myRequests]
  );
  const pendingData = useMemo(
    () => [...pendingRequests].sort((a, b) => new Date(b.created_on) - new Date(a.created_on)).slice(0, 5),
    [pendingRequests]
  );

  const recentTable = useMaterialReactTable({
    columns: recentColumns,
    data: recentData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableSorting: true,
    enableGlobalFilter: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    layoutMode: 'semantic',
    initialState: {
      sorting: [{ id: 'created_on', desc: true }],
      density: 'compact',
    },
    muiTableProps: dashboardTableProps,
    muiTableContainerProps: { sx: { maxHeight: 320 } },
    muiTablePaperProps: { sx: { boxShadow: 'none' } },
  });

  const pendingTable = useMaterialReactTable({
    columns: pendingColumns,
    data: pendingData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableSorting: true,
    enableGlobalFilter: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    layoutMode: 'semantic',
    initialState: {
      sorting: [{ id: 'created_on', desc: true }],
      density: 'compact',
    },
    muiTableProps: dashboardTableProps,
    muiTableContainerProps: { sx: { maxHeight: 320 } },
    muiTablePaperProps: { sx: { boxShadow: 'none' } },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Welcome Banner ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          px: 3,
          py: 2.5,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,

        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon sx={{ color: '#fff', fontSize: 28 }} titleAccess="Dashboard" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              Welcome to DevOps Management Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Self-service GitLab Repository Provisioning Platform
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh dashboard">
          <IconButton onClick={loadDashboardData} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
            <RefreshIcon titleAccess="Refresh Dashboard" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── DevOps Management Overview Stats (Compact) ── */}
      <Card sx={{ ...cardSx, mb: 4 }}>
        <CardContent sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>DevOps Overview</Typography>
          <Grid container spacing={1}>
            {/* Active Releases */}
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), transform: 'translateY(-1px)' } }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15), width: 36, height: 36, flexShrink: 0 }}>
                  <SourceIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} titleAccess="Active Releases" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>Active Releases</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>8</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>In progress</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Total Artifacts */}
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.04), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.08), transform: 'translateY(-1px)' } }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.15), width: 36, height: 36, flexShrink: 0 }}>
                  <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 18 }} titleAccess="Total Artifacts" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>Total Artifacts</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>45</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>Ready</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Open Vulnerabilities */}
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.04), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), transform: 'translateY(-1px)' } }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.15), width: 36, height: 36, flexShrink: 0 }}>
                  <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: 18 }} titleAccess="Open Vulnerabilities" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>Vulnerabilities</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>12</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>2 critical</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Pending Approvals */}
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: alpha('#9c27b0', 0.04), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha('#9c27b0', 0.08), transform: 'translateY(-1px)' } }}>
                <Avatar sx={{ bgcolor: alpha('#9c27b0', 0.15), width: 36, height: 36, flexShrink: 0 }}>
                  <ApprovalIcon sx={{ color: '#9c27b0', fontSize: 18 }} titleAccess="Pending Approvals" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>Pending</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#9c27b0' }}>5</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>Awaiting</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Upcoming Deadlines */}
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.04), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.08), transform: 'translateY(-1px)' } }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.15), width: 36, height: 36, flexShrink: 0 }}>
                  <TrendingUpIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} titleAccess="Upcoming Deadlines" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>Deadlines</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>3</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>Next 30d</Typography>
                </Box>
              </Box>
            </Grid>

            {/* System Health */}
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.04), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.08), transform: 'translateY(-1px)' } }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.15), width: 36, height: 36, flexShrink: 0 }}>
                  <HealthIcon sx={{ color: theme.palette.success.main, fontSize: 18 }} titleAccess="System Health" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>Health</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>✓</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>Operational</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Recent Activity + Quick Actions ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* ── LEFT: Recent Activity ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), width: 32, height: 32 }}>
                    <HistoryIcon sx={{ color: theme.palette.info.main, fontSize: 18 }} titleAccess="Recent Activity" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                </Box>
                {recentActivities.length > ACTIVITY_PREVIEW_COUNT && (
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ChevronRightIcon />}
                    onClick={() => setActivityDialogOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    View All ({recentActivities.length})
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {recentActivities.slice(0, ACTIVITY_PREVIEW_COUNT).map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── RIGHT: Quick Actions ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 32, height: 32 }}>
                  <LaunchIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} titleAccess="Quick Actions" />
                </Avatar>
                <Typography variant="h6" fontWeight={700}>Quick Actions</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {quickActions.map((action) => (
                  <Box
                    key={action.id}
                    onClick={() => onNavigate(action.navigateTo)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 2,
                      py: 1.5,
                      borderRadius: 2.5,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '& .quick-action-arrow': { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: alpha(action.color, 0.1), width: 36, height: 36 }}>
                      {React.cloneElement(action.icon, { sx: { color: action.color, fontSize: 20 }, titleAccess: action.label })}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                        {action.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {action.description}
                      </Typography>
                    </Box>
                    <ChevronRightIcon
                      className="quick-action-arrow"
                      sx={{ color: 'text.disabled', fontSize: 20, opacity: 0, transform: 'translateX(-4px)', transition: 'all 0.2s ease' }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Recent Activity Full Dialog ── */}
      <Dialog
        open={activityDialogOpen}
        onClose={() => setActivityDialogOpen(false)}
        maxWidth={activityDialogFullscreen ? false : 'sm'}
        fullWidth
        fullScreen={activityDialogFullscreen}
        slotProps={{ paper: { sx: { borderRadius: activityDialogFullscreen ? 0 : 3, maxHeight: activityDialogFullscreen ? '100vh' : '80vh' } } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>All Recent Activity</Typography>
            <Chip label={recentActivities.length} size="small" color="primary" />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={activityDialogFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <IconButton size="small" onClick={() => setActivityDialogFullscreen(!activityDialogFullscreen)} aria-label="maximize">
                {activityDialogFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={() => setActivityDialogOpen(false)} aria-label="close">
              <CloseIcon fontSize="small" title='Close' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List disablePadding>
            {recentActivities.map((item, idx) => (
              <ListItem
                key={item.id}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: idx < recentActivities.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha(item.dotColor, 0.15), width: 36, height: 36 }}>
                    {item.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={
                    <>
                      <Typography component="span" variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {item.description}
                      </Typography>
                      <Typography component="span" variant="caption" sx={{ color: 'text.disabled' }}>
                        {item.timestamp} • {item.user}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: 600, variant: 'subtitle2' }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setActivityDialogOpen(false)} sx={{ textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
