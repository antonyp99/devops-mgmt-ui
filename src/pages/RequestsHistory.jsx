import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  Button,
  useTheme,
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Refresh as RefreshIcon,
  ListAlt as ListAltIcon,
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  InboxOutlined as InboxIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useAlertCenter } from '../contexts/AlertCenter';

const statusColorMap = {
  PENDING_APPROVAL: 'warning',
  APPROVED: 'info',
  CREATED: 'success',
  REJECTED: 'error',
  FAILED: 'error',
};

const RequestsHistory = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);

  const tableContainerRef = useRef(null);
  const [tableMaxHeight, setTableMaxHeight] = useState(400);

  const calculateTableHeight = useCallback(() => {
    if (tableContainerRef.current) {
      const tableTop = tableContainerRef.current.getBoundingClientRect().top;
      const bottomPadding = 24;
      const availableHeight = window.innerHeight - tableTop - bottomPadding;
      setTableMaxHeight(Math.max(availableHeight, 200));
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => calculateTableHeight(), 100);
    window.addEventListener('resize', calculateTableHeight);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateTableHeight);
    };
  }, [calculateTableHeight, pageSize]);

  useEffect(() => {
    if (requests.length > 0) calculateTableHeight();
  }, [requests, calculateTableHeight]);

  useEffect(() => {
    loadRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRequests = async () => {
    setLoading(true);
    try {
      // TODO: replace with real API call when backend endpoint is ready
      setRequests([]);
    } catch (err) {
      console.error('Error loading requests:', err);
      showToast('Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'repository_name',
      header: 'Repository Name',
      Cell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>{row.original.repository_name}</Typography>
          {row.original.description && (
            <Typography variant="caption" color="text.secondary" display="block">{row.original.description}</Typography>
          )}
          {row.original.rejection_reason && (
            <Typography variant="caption" color="error" display="block">Reason: {row.original.rejection_reason}</Typography>
          )}
        </Box>
      ),
    },
    {
      accessorKey: 'repo_type',
      header: 'Type',
      size: 100,
      Cell: ({ cell }) => <Chip size="small" label={cell.getValue()} variant="outlined" />,
    },
    {
      accessorKey: 'tech_stack',
      header: 'Tech Stack',
      size: 120,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 160,
      Cell: ({ cell }) => {
        const val = cell.getValue();
        return (
          <Chip
            size="small"
            label={val?.replace(/_/g, ' ')}
            color={statusColorMap[val] || 'default'}
          />
        );
      },
    },
    {
      accessorKey: 'created_on',
      header: 'Created Date',
      size: 180,
      Cell: ({ cell }) => {
        const d = new Date(cell.getValue());
        return (
          <Typography variant="body2">
            {d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}, {d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        );
      },
    },
    {
      id: 'actions',
      header: 'GitLab',
      size: 80,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
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

  const table = useMaterialReactTable({
    columns,
    data: requests,
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
      pagination: { pageIndex: 0, pageSize: 25 },
      sorting: [{ id: 'created_on', desc: true }],
      showGlobalFilter: true,
      density: 'compact',
      columnPinning: { right: ['actions'] },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'auto',
        '& .MuiTableHead-root': {
          position: 'sticky',
          top: 0,
          zIndex: 2,
        },
        '& .MuiTableCell-head': {
          fontWeight: 'bold',
          fontSize: '0.875rem',
          borderBottom: '2px solid #e0e0e0',
          whiteSpace: 'nowrap',
          padding: '8px 12px',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          '&:hover': { backgroundColor: 'rgba(92, 107, 192, 0.12)' },
        },
        '& .MuiTableCell-body': {
          padding: '6px 12px',
          fontSize: '0.85rem',
        },
        '& .MuiTableRow-root': {
          minHeight: 36,
        },
      },
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto',
      },
    },
    muiTablePaperProps: {
      sx: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon titleAccess="Search" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: '1 1 320px',
                minWidth: { xs: '100%', sm: 280 },
                '& .MuiInputBase-root': { height: 40 },
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150, '& .MuiInputBase-root': { height: 40 } }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={pageSize}
                label="Rows per page"
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  table.setPageSize(newSize);
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              {totalRows > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  Page {pageIndex + 1} of {Math.ceil(totalRows / ps)}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={() => table.firstPage()} disabled={pageIndex === 0}>
                  <FirstPageIcon titleAccess="First Page" />
                </IconButton>
                <IconButton size="small" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeftIcon titleAccess="Previous Page" />
                </IconButton>
                <IconButton size="small" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRightIcon titleAccess="Next Page" />
                </IconButton>
                <IconButton size="small" onClick={() => table.lastPage()} disabled={pageIndex >= Math.ceil(totalRows / ps) - 1}>
                  <LastPageIcon titleAccess="Last Page" />
                </IconButton>
              </Box>
            </Box>

            {totalRows > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                Showing {startRow} to {endRow} of {totalRows}
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
    <Box sx={{ p: 2, height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Header Banner ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          px: 3,
          py: 2.5,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,

        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ListAltIcon sx={{ color: '#fff', fontSize: 28 }} titleAccess="My Requests" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              My Repository Requests
              {requests.length > 0 && (
                <Box
                  component="span"
                  sx={{ ml: 1.5, fontSize: 14, fontWeight: 600, bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.5, borderRadius: 1.5 }}
                >
                  {requests.length} requests
                </Box>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Track and manage all your repository provisioning requests
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={loadRequests} disabled={loading} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
            <RefreshIcon titleAccess="Refresh Data" />
          </IconButton>
          </Tooltip>
          <Button
            title="Back"
            startIcon={<ArrowBackIcon titleAccess="Back" />}
            onClick={() => onNavigate('dashboard')}
            variant="outlined"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {!loading && requests.length === 0 ? (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Box
            sx={(theme) => ({
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              mb: 2,
            })}
          >
            <InboxIcon sx={(theme) => ({ fontSize: 32, color: theme.palette.primary.main })} titleAccess="No Requests" />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
            No Repository Requests Found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Your repository requests will appear here once submitted
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MaterialReactTable table={table} />
        </Box>
      )}
    </Box>
  );
};

export default RequestsHistory;
