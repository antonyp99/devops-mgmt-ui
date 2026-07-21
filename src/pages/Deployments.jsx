import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  RocketLaunch as DeployIcon,
  Replay as ReplayIcon,
  Visibility as ViewIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Undo as RollbackIcon,
  Schedule as PendingIcon,
  OpenInNew as OpenInNewIcon,
  Public as TimelineIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useAlertCenter } from '../contexts/AlertCenter';

const STATUS_CONFIG = {
  Success: { color: 'success', icon: <SuccessIcon sx={{ fontSize: 14 }} /> },
  Failed: { color: 'error', icon: <ErrorIcon sx={{ fontSize: 14 }} /> },
  'Rolled Back': { color: 'warning', icon: <RollbackIcon sx={{ fontSize: 14 }} /> },
  'In Progress': { color: 'info', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
};

const Deployments = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [envFilter, setEnvFilter] = useState('All');
  const tableContainerRef = useRef(null);

  const mockData = [
    { id: '1', status: 'Success', release: 'v2.4.1', customer: 'Acme Corp', product: 'Frontend Portal', environment: 'Production', deployedBy: 'John Smith', deployedAt: '2026-04-13 09:32', duration: '8.2 min' },
    { id: '2', status: 'Success', release: 'v2.4.1', customer: 'Acme Corp', product: 'Frontend Portal', environment: 'Staging', deployedBy: 'John Smith', deployedAt: '2026-04-12 16:45', duration: '7.8 min' },
    { id: '3', status: 'Failed', release: 'v1.8.3', customer: 'TechCorp Industries', product: 'API Gateway', environment: 'Production', deployedBy: 'Sarah Lee', deployedAt: '2026-04-12 14:20', duration: '15.3 min' },
    { id: '4', status: 'Rolled Back', release: 'v3.1.0', customer: 'Global Systems Ltd', product: 'Analytics Dashboard', environment: 'Production', deployedBy: 'Mike Chen', deployedAt: '2026-04-12 11:05', duration: '22.1 min' },
    { id: '5', status: 'Success', release: 'v1.8.2', customer: 'TechCorp Industries', product: 'API Gateway', environment: 'Staging', deployedBy: 'Sarah Lee', deployedAt: '2026-04-11 18:30', duration: '9.5 min' },
    { id: '6', status: 'In Progress', release: 'v2.0.9', customer: 'InnoSoft Solutions', product: 'User Service', environment: 'Staging', deployedBy: 'Emily Davis', deployedAt: '2026-04-13 10:15', duration: '—' },
    { id: '7', status: 'Success', release: 'v4.2.0', customer: 'CloudNet Corp', product: 'Billing Engine', environment: 'Production', deployedBy: 'Alex Kumar', deployedAt: '2026-04-11 08:40', duration: '11.7 min' },
    { id: '8', status: 'Success', release: 'v4.1.9', customer: 'CloudNet Corp', product: 'Billing Engine', environment: 'Staging', deployedBy: 'Alex Kumar', deployedAt: '2026-04-10 14:22', duration: '10.2 min' },
    { id: '9', status: 'Failed', release: 'v1.3.5', customer: 'DataFlow Inc', product: 'ETL Pipeline', environment: 'Production', deployedBy: 'Rachel Wong', deployedAt: '2026-04-10 09:55', duration: '18.6 min' },
    { id: '10', status: 'Success', release: 'v2.7.3', customer: 'SecureVault Ltd', product: 'Auth Service', environment: 'Production', deployedBy: 'James Park', deployedAt: '2026-04-09 17:10', duration: '6.4 min' },
    { id: '11', status: 'Rolled Back', release: 'v5.0.0', customer: 'Acme Corp', product: 'Frontend Portal', environment: 'Staging', deployedBy: 'John Smith', deployedAt: '2026-04-09 13:45', duration: '25.3 min' },
    { id: '12', status: 'Success', release: 'v3.0.2', customer: 'Global Systems Ltd', product: 'Analytics Dashboard', environment: 'Staging', deployedBy: 'Mike Chen', deployedAt: '2026-04-08 10:30', duration: '12.1 min' },
    { id: '13', status: 'Success', release: 'v1.2.8', customer: 'NexGen Tech', product: 'Notification Hub', environment: 'Production', deployedBy: 'Lisa Tran', deployedAt: '2026-04-08 08:15', duration: '7.9 min' },
    { id: '14', status: 'Failed', release: 'v2.6.1', customer: 'SecureVault Ltd', product: 'Auth Service', environment: 'Staging', deployedBy: 'James Park', deployedAt: '2026-04-07 15:50', duration: '14.0 min' },
    { id: '15', status: 'Success', release: 'v1.9.0', customer: 'DataFlow Inc', product: 'ETL Pipeline', environment: 'Staging', deployedBy: 'Rachel Wong', deployedAt: '2026-04-07 11:20', duration: '13.5 min' },
  ];

  useEffect(() => {
    loadDeployments();
  }, []);

  const loadDeployments = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setDeployments(mockData);
    } catch (err) {
      console.error('Error loading deployments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (envFilter === 'All') return deployments;
    return deployments.filter((d) => d.environment === envFilter);
  }, [deployments, envFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => {
          const val = cell.getValue();
          const cfg = STATUS_CONFIG[val] || { color: 'default' };
          return (
            <Chip
              size="small"
              icon={cfg.icon}
              label={val}
              color={cfg.color}
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: '0.7rem', height: 24, borderRadius: '6px', '& .MuiChip-icon': { ml: '4px' } }}
            />
          );
        },
      },
      {
        accessorKey: 'release',
        header: 'Release',
        size: 95,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: theme.palette.primary.main }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      { accessorKey: 'customer', header: 'Customer', size: 150 },
      { accessorKey: 'product', header: 'Product', size: 150 },
      {
        accessorKey: 'environment',
        header: 'Environment',
        size: 120,
        Cell: ({ cell }) => {
          const val = cell.getValue();
          const isProd = val === 'Production';
          return (
            <Chip
              size="small"
              label={val}
              sx={{
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 22,
                borderRadius: '6px',
                bgcolor: isProd ? alpha(theme.palette.error.main, 0.08) : alpha(theme.palette.info.main, 0.08),
                color: isProd ? theme.palette.error.dark : theme.palette.info.dark,
                border: `1px solid ${isProd ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.info.main, 0.2)}`,
              }}
            />
          );
        },
      },
      { accessorKey: 'deployedBy', header: 'Deployed By', size: 130 },
      {
        accessorKey: 'deployedAt',
        header: 'Deployed At',
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        size: 90,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="View details">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                <ViewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {row.original.status === 'Failed' && (
              <Tooltip title="Retry deployment">
                <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                  <ReplayIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
            {row.original.status === 'Success' && (
              <Tooltip title="Rollback">
                <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main', bgcolor: alpha(theme.palette.warning.main, 0.08) } }}>
                  <RollbackIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnResizing: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableBottomToolbar: false,
    autoResetPageIndex: false,
    layoutMode: 'semantic',
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: 'deployedAt', desc: true }],
      showGlobalFilter: true,
      density: 'compact',
      columnPinning: { right: ['actions'] },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'auto',
        '& .MuiTableHead-root': { position: 'sticky', top: 0, zIndex: 2 },
        '& .MuiTableCell-head': {
          fontWeight: 500,
          fontSize: '0.8rem',
          color: 'text.secondary',
          textTransform: 'none',
          letterSpacing: 'normal',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          whiteSpace: 'nowrap',
          padding: '6px 10px',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: alpha(theme.palette.background.default, 0.95),
          backdropFilter: 'blur(8px)',
        },
        '& .MuiTableCell-body': {
          padding: '5px 10px',
          fontSize: '0.8rem',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
        },
        '& .MuiTableRow-root': {
          minHeight: 34,
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.03) },
        },
      },
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: {
        overflowY: pageSize > 10 ? 'auto' : 'hidden',
        overflowX: 'hidden',
        ...(pageSize > 10 && { maxHeight: 400 }),
        transition: 'max-height 0.2s ease',
      },
    },
    muiTablePaperProps: {
      sx: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '10px',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.04)}`,
      },
    },
    renderTopToolbar: ({ table }) => {
      const { pageIndex, pageSize: ps } = table.getState().pagination;
      const totalRows = table.getFilteredRowModel().rows.length;
      const startRow = pageIndex * ps + 1;
      const endRow = Math.min((pageIndex + 1) * ps, totalRows);

      return (
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            bgcolor: alpha(theme.palette.background.default, 0.4),
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search deployments..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon titleAccess="Search" sx={{ fontSize: 16, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: '1 1 280px',
              minWidth: { xs: '100%', sm: 220 },
              '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Environment</InputLabel>
            <Select
              value={envFilter}
              label="Environment"
              onChange={(e) => setEnvFilter(e.target.value)}
            >
              <MenuItem value="All">All Environments</MenuItem>
              <MenuItem value="Production">Production</MenuItem>
              <MenuItem value="Staging">Staging</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Rows per page</InputLabel>
            <Select
              value={pageSize}
              label="Rows per page"
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                table.setPageSize(newSize);
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            {totalRows > 0 && (
              <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                Page {pageIndex + 1} of {Math.ceil(totalRows / ps)}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <IconButton size="small" onClick={() => table.firstPage()} disabled={pageIndex === 0}>
                <FirstPageIcon titleAccess="First Page" sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeftIcon titleAccess="Previous Page" sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRightIcon titleAccess="Next Page" sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => table.lastPage()} disabled={pageIndex >= Math.ceil(totalRows / ps) - 1}>
                <LastPageIcon titleAccess="Last Page" sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {totalRows > 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
              Showing {startRow}–{endRow} of {totalRows}
            </Typography>
          )}
        </Box>
      );
    },
    state: {
      isLoading: loading,
      globalFilter,
    },
  });

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
          <DeployIcon sx={{ color: '#fff', fontSize: 22, opacity: 0.9 }} titleAccess="Deployments" />
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Deployments Tracking
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', lineHeight: 1.3 }}>
              Monitor and track deployments across all environments
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Refresh data">
            <IconButton
              onClick={loadDeployments}
              disabled={loading}
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

      {/* ── Stats Chips ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          flexShrink: 0,
          flexWrap: 'wrap',
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          borderRadius: '8px',
          border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        }}
      >
        {[
          { label: 'Total Deployments: 247', extra: 'This month', color: theme.palette.primary.main },
          { label: 'Success Rate: 90.3%', extra: '+2.3%', color: theme.palette.success.main },
          { label: 'Failed: 15', extra: '-12%', color: theme.palette.error.main },
          { label: 'Rollbacks: 9', extra: '-25%', color: theme.palette.warning.main },
          { label: 'Avg Time: 12.5 min', extra: null, color: theme.palette.info.main },
          { label: 'Uptime: 99.6%', extra: null, color: theme.palette.success.dark },
        ].map((s) => (
          <Chip
            key={s.label}
            size="small"
            label={s.extra ? `${s.label} (${s.extra})` : s.label}
            sx={{
              height: 24,
              fontSize: '0.7rem',
              fontWeight: 500,
              borderRadius: '6px',
              bgcolor: alpha(s.color, 0.07),
              color: s.color,
              border: `1px solid ${alpha(s.color, 0.18)}`,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        ))}
      </Box>

      {/* ── MRT Table ── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '10px',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <MaterialReactTable table={table} />
      </Box>

      {/* ── Environments Summary ── */}
      <Box sx={{ flexShrink: 0, mt: 0.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', mb: 1.25, color: 'text.primary' }}>
          Environments
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
            gap: 1.5,
          }}
        >
          {[
            { name: 'Production', status: 'healthy', statusColor: 'success', deploys: 87 },
            { name: 'Staging', status: 'healthy', statusColor: 'success', deploys: 104 },
            { name: 'Testing', status: 'warning', statusColor: 'warning', deploys: 38 },
            { name: 'Development', status: 'healthy', statusColor: 'success', deploys: 18 },
          ].map((env) => (
            <Paper
              key={env.name}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '10px',
                border: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.08)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.25),
                },
              }}
            >
              {/* Top row: name + status */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.84rem', lineHeight: 1.2 }}>
                    {env.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', lineHeight: 1.3 }}>
                    {env.name} environment
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={env.status}
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    borderRadius: '5px',
                    bgcolor: alpha(theme.palette[env.statusColor].main, 0.08),
                    color: theme.palette[env.statusColor].dark,
                    border: `1px solid ${alpha(theme.palette[env.statusColor].main, 0.2)}`,
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              </Box>

              {/* Deployments count */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                  Deployments this month
                </Typography>
                <Typography sx={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  {env.deploys}
                </Typography>
              </Box>

              {/* View Details button */}
              <Button
                fullWidth
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                sx={{
                  mt: 'auto',
                  textTransform: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  py: 0.5,
                  borderRadius: '7px',
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
                }}
              >
                View Details
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ── Deployment Timeline ── */}
      <Box sx={{ flexShrink: 0, mt: 1 }}>
        <Box sx={{ mb: 1.25 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: 'text.primary', lineHeight: 1.2 }}>
            Deployment Timeline
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', mt: 0.25 }}>
            Visual timeline of deployments across all environments — Coming soon
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '10px',
            border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
            bgcolor: alpha(theme.palette.background.default, 0.5),
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <TimelineIcon sx={{ fontSize: 40, color: alpha(theme.palette.text.disabled, 0.35), mb: 1.5 }} />
          <Typography sx={{ fontSize: '0.8rem', color: 'text.disabled', fontWeight: 500 }}>
            Timeline visualization will be implemented here
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Deployments;
