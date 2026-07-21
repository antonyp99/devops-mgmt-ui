import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Tooltip,
  Fab,
  Zoom,
  alpha,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Dashboard,
  Add,
  History,
  Approval,
  Logout,
  Settings,
  Person as PersonIcon,
  SettingsApplications as ProfileEditorIcon,
  KeyboardArrowUp as ScrollTopIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  LocalOffer as ReleaseIcon,
  Assessment as QualityIcon,
  Security as SecurityIcon,
  Inventory2 as ArtifactsIcon,
  AccountTree as SBOMIcon,
  RocketLaunch as DeploymentIcon,
} from '@mui/icons-material';

import { useAuth } from '../../services/AuthProvider';
import { useAlertCenter } from '../../contexts/AlertCenter';
import ThemeSettingsDialog from '../ui/ThemeSettingsDialog';

// Page components — imported directly; navigation is state-based (no URL changes)
import DashboardPage from '../../pages/Dashboard';
import RepositoryRequestFormPage from '../../pages/RepositoryRequestForm';
import RequestsHistoryPage from '../../pages/RequestsHistory';
import PendingApprovalsPage from '../../pages/PendingApprovals';
import PendingQualityApprovalsPage from '../../pages/PendingQualityApprovals';
import VulnerabilityScansPage from '../../pages/VulnerabilityScans';
import ProfileEditorPage from '../../pages/ProfileEditor';
import ReleasesPage from '../../pages/Releases';
import ArtifactsRepositoryPage from '../../pages/ArtifactsRepository';
import SBOMPage from '../../pages/SBOM';
import DeploymentsPage from '../../pages/Deployments';
import AnalyticsPage from '../../pages/Analytics';
import ReleasePlanningPage from '../../pages/ReleasePlanning';
import CustomerManagementPage from '../../pages/CustomerManagement';
import ProductManagementPage from '../../pages/ProductManagement';

const DRAWER_WIDTH = 240;
const DRAWER_MIN_WIDTH = 180;
const DRAWER_MAX_WIDTH = 400;
const DRAWER_COLLAPSED_WIDTH = 64;

/**
 * Renders the active section component based on the current section ID.
 * Navigation is entirely state-driven — the browser URL stays at /devops
 * regardless of which section the user is viewing.
 */
const SectionRenderer = ({ sectionId, onNavigate }) => {
  switch (sectionId) {
    case 'dashboard':          return <DashboardPage onNavigate={onNavigate} />;
    case 'create-repository':  return <RepositoryRequestFormPage onNavigate={onNavigate} />;
    case 'requests':           return <RequestsHistoryPage onNavigate={onNavigate} />;
    case 'approvals':          return <PendingApprovalsPage onNavigate={onNavigate} />;
    case 'quality-approvals':  return <PendingQualityApprovalsPage onNavigate={onNavigate} />;
    case 'vulnerability-scans': return <VulnerabilityScansPage onNavigate={onNavigate} />;
    case 'artifacts':          return <ArtifactsRepositoryPage onNavigate={onNavigate} />;
    case 'sbom':               return <SBOMPage onNavigate={onNavigate} />;
    case 'deployments':        return <DeploymentsPage onNavigate={onNavigate} />;
    case 'analytics':           return <AnalyticsPage onNavigate={onNavigate} />;
    case 'release-planning':    return <ReleasePlanningPage onNavigate={onNavigate} />;
    case 'customers':            return <CustomerManagementPage onNavigate={onNavigate} />;
    case 'products':             return <ProductManagementPage onNavigate={onNavigate} />;
    case 'profile-editor':    return <ProfileEditorPage onNavigate={onNavigate} />;
    case 'releases':           return <ReleasesPage onNavigate={onNavigate} />;
    default:                   return <DashboardPage onNavigate={onNavigate} />;
  }
};

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSearch, setMenuSearch] = useState('');
  const isResizing = useRef(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // activeSection drives which page component is rendered — URL stays at /devops
  const [activeSection, setActiveSection] = useState('dashboard');

  const { user, logout } = useAuth();
  const { confirm } = useAlertCenter();
  const currentUser = user;

  const menuItems = [
    { id: 'dashboard',         label: 'Dashboard',              icon: <Dashboard titleAccess="Dashboard" /> },
    { id: 'create-repository', label: 'Submit Git Repository',  icon: <Add titleAccess="Submit Git Repository" /> },
    { id: 'requests',          label: 'My Requests',            icon: <History titleAccess="My Requests" /> },
    { id: 'approvals',         label: 'Pending Approvals',      icon: <Approval titleAccess="Pending Approvals" /> },
    { id: 'quality-approvals', label: 'Pending Quality Approvals', icon: <QualityIcon titleAccess="Pending Quality Approvals" /> },
    { id: 'vulnerability-scans', label: 'Vulnerability Scans', icon: <SecurityIcon titleAccess="Vulnerability Scans" /> },
    { id: 'artifacts',         label: 'Artifacts Repository',   icon: <ArtifactsIcon titleAccess="Artifacts Repository" /> },
    { id: 'sbom',              label: 'SBOM',                    icon: <SBOMIcon titleAccess="SBOM" /> },
    { id: 'profile-editor',    label: 'Generate Profile Editor', icon: <ProfileEditorIcon titleAccess="Generate Profile Editor" /> },
    { id: 'releases',          label: 'Releases',               icon: <ReleaseIcon titleAccess="Releases" /> },
    { id: 'deployments',       label: 'Deployments',            icon: <DeploymentIcon titleAccess="Deployments" /> },
    { id: 'analytics',          label: 'Analytics',              icon: <QualityIcon titleAccess="Analytics" /> },
    { id: 'release-planning',   label: 'Release Planning',       icon: <ReleaseIcon titleAccess="Release Planning" /> },
    { id: 'customers',            label: 'Customer',               icon: <PersonIcon titleAccess="Customer" /> },
    { id: 'products',              label: 'Products',               icon: <ArtifactsIcon titleAccess="Products" /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Sign Out?',
      message: 'For your security, your session will end and any unsaved changes may be lost.',
      confirmText: 'Sign Out',
      cancelText: 'Stay Logged In',
      severity: 'warning',
    });
    if (confirmed) {
      logout();
    }
  };

  const handleNavigation = (id) => {
    setActiveSection(id);
    if (isMobile) setDrawerOpen(false);
  };

  // --- Drawer resize handlers ---
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(DRAWER_MAX_WIDTH, Math.max(DRAWER_MIN_WIDTH, e.clientX));
      setDrawerWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const drawer = (
    <Box sx={{ overflowX: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Divider />
      {drawerOpen && (
        <Box sx={{ px: 1, py: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search menu..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon title='Search menu' sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: menuSearch && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setMenuSearch('')}
                      edge="end"
                      title='Clear search'
                      sx={{ mr: -1 }}
                    >
                      <ClearIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.85rem',
              },
            }}
          />
        </Box>
      )}
      <List sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {menuItems
          .filter((item) => menuSearch === '' || item.label.toLowerCase().includes(menuSearch.toLowerCase()))
          .map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!drawerOpen ? item.label : ''} placement="right" arrow>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => handleNavigation(item.id)}
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  px: drawerOpen ? 2 : 1.5,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.dark,
                    '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : 0,
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      {menuSearch && menuItems.filter((item) => item.label.toLowerCase().includes(menuSearch.toLowerCase())).length === 0 && (
        <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>No items found</Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar — white background, blue text */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <MenuOpenIcon titleAccess="Close Menu" /> : <MenuIcon titleAccess="Open Menu" />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '0.3px',
              color: theme.palette.text.primary,
            }}
          >
            DevOps Management Portal
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Chip
              label={`Welcome, ${currentUser?.displayName || currentUser?.username || 'User'}`}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.dark,
                fontWeight: 600,
                fontSize: '0.8125rem',
                height: 32,
                display: { xs: 'none', sm: 'flex' },
                '& .MuiChip-label': { px: 1.5 },
              }}
            />
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                border: '2px solid',
                borderColor: alpha(theme.palette.primary.main, 0.3),
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: theme.palette.primary.main },
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {(currentUser?.displayName || currentUser?.username || 'U').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer � overlay */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        /* Desktop drawer — permanent, mini icon-only when collapsed */
        <Drawer
          variant="permanent"
          sx={{
            width: drawerOpen ? drawerWidth : DRAWER_COLLAPSED_WIDTH,
            flexShrink: 0,
            transition: isResizing.current
              ? 'none'
              : theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: drawerOpen
                    ? theme.transitions.duration.enteringScreen
                    : theme.transitions.duration.leavingScreen,
                }),
            '& .MuiDrawer-paper': {
              width: drawerOpen ? drawerWidth : DRAWER_COLLAPSED_WIDTH,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: isResizing.current
                ? 'none'
                : theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: drawerOpen
                      ? theme.transitions.duration.enteringScreen
                      : theme.transitions.duration.leavingScreen,
                  }),
            },
          }}
        >
          {drawer}
          {/* Resize handle — only when expanded */}
          {drawerOpen && (
            <Box
              onMouseDown={handleMouseDown}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: 6,
                cursor: 'col-resize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover > div, &:active > div': {
                  opacity: 1,
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: 'divider',
                  opacity: 0.5,
                  transition: 'opacity 0.2s, background-color 0.2s',
                }}
              />
            </Box>
          )}
        </Drawer>
      )}

      {/* Main content — expands to full width when drawer is closed */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minWidth: 0,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: drawerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <SectionRenderer sectionId={activeSection} onNavigate={handleNavigation} />
      </Box>

      {/* Scroll-to-top Fab — appears on all pages after scrolling 200px */}
      <Zoom in={showScrollTop}>
        <Tooltip title="Back to top" placement="left">
          <Fab
            size="small"
            color="primary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="scroll back to top"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: theme.zIndex.fab,
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            }}
          >
            <ScrollTopIcon />
          </Fab>
        </Tooltip>
      </Zoom>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              minWidth: 200,
              borderRadius: 2,
              mt: 1,
              overflow: 'visible',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 16,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                borderLeft: '1px solid',
                borderTop: '1px solid',
                borderColor: 'divider',
              },
            },
          },
        }}
      >
        {/* User info header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {(currentUser?.displayName || currentUser?.username || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {currentUser?.displayName || currentUser?.username || 'User'}
              </Typography>
              {currentUser?.email && (
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {currentUser.email}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Divider />
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{ py: 1.2, mx: 0.5, borderRadius: 1, mt: 0.5 }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" titleAccess="Profile" />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          onClick={() => { handleProfileMenuClose(); setSettingsOpen(true); }}
          sx={{ py: 1.2, mx: 0.5, borderRadius: 1 }}
        >
          <ListItemIcon>
            <Settings fontSize="small" titleAccess="Settings" />
          </ListItemIcon>
          <ListItemText primary="Appearance Settings" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.2,
            mx: 0.5,
            mb: 0.5,
            borderRadius: 1,
            color: theme.palette.error.main,
            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Logout fontSize="small" titleAccess="Logout" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
        </MenuItem>
      </Menu>

      {/* Appearance / Theme settings dialog */}
      <ThemeSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
};

export default Layout;
