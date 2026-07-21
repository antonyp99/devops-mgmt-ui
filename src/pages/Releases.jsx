import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  StorageOutlined as ReleaseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  InboxOutlined as InboxIconDisplay,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const Releases = ({ onNavigate }) => {
  const theme = useTheme();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, release: null, fullscreen: false });
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);

  const tableContainerRef = useRef(null);
  const [tableMaxHeight, setTableMaxHeight] = useState(400);

  // Mock data with 4 releases
  const RELEASES_DATA = [
    {
      id: '1',
      version: 'v1.2.3',
      customer: 'Acme Corp',
      product: 'Frontend Portal',
      plannedDate: '2/15/2024',
      status: 'Testing',
      artifacts: ['frontend-portal-1.2.3.jar'],
    },
    {
      id: '2',
      version: 'v2.1.0',
      customer: 'TechFlow Systems',
      product: 'Frontend Portal',
      plannedDate: '1/30/2024',
      status: 'Deployed',
      artifacts: ['frontend-portal-2.1.0.jar'],
    },
    {
      id: '3',
      version: 'v3.0.1',
      customer: 'Global Industries',
      product: 'Analytics Dashboard',
      plannedDate: '3/1/2024',
      status: 'In Progress',
      artifacts: ['analytics-dashboard-3.0.1.jar'],
    },
    {
      id: '4',
      version: 'v1.0.0-beta.1',
      customer: 'InnovateLab',
      product: 'Mobile Application',
      plannedDate: '4/15/2024',
      status: 'Planning',
      artifacts: [],
    },
  ];

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
    if (releases.length > 0) calculateTableHeight();
  }, [releases, calculateTableHeight]);

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = () => {
    setLoading(true);
    try {
      setReleases(RELEASES_DATA);
    } catch (err) {
      console.error('Error loading releases:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Testing': 'info',
      'Deployed': 'success',
      'In Progress': 'warning',
      'Planning': 'default',
    };
    return statusColors[status] || 'default';
  };

  const handleViewDetails = useCallback((release) => {
    setDetailsDialog({ open: true, release, fullscreen: false });
  }, []);

  const handleCloseDetails = () => {
    setDetailsDialog({ open: false, release: null, fullscreen: false });
  };

  const toggleFullscreen = () => {
    setDetailsDialog((prev) => ({ ...prev, fullscreen: !prev.fullscreen }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'version',
      header: 'Version',
      size: 120,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={600}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      size: 160,
    },
    {
      accessorKey: 'product',
      header: 'Product',
      size: 180,
    },
    {
      accessorKey: 'plannedDate',
      header: 'Planned Date',
      size: 140,
    },
    {
      accessorKey: 'artifacts',
      header: 'Artifacts',
      size: 100,
      Cell: ({ cell }) => {
        const artifacts = cell.getValue() || [];
        return (
          <Chip
            size="small"
            label={`${artifacts.length} file${artifacts.length !== 1 ? 's' : ''}`}
            variant="outlined"
          />
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      Cell: ({ cell }) => (
        <Chip
          size="small"
          label={cell.getValue()}
          color={getStatusColor(cell.getValue())}
          variant="outlined"
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 80,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Tooltip title="View details">
          <IconButton
            size="small"
            onClick={() => handleViewDetails(row.original)}
          >
            <VisibilityIcon titleAccess="View release details" sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [handleViewDetails]);

  const table = useMaterialReactTable({
    columns,
    data: releases,
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
      sorting: [{ id: 'version', desc: true }],
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
                  <SearchIcon titleAccess="Search" sx={{ fontSize: 18 }} />
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
    <Box sx={{ p: 2, height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
      {/* ── Header Banner ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReleaseIcon sx={{ color: '#fff', fontSize: 28 }} titleAccess="Releases" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              Releases
              {releases.length > 0 && (
                <Box
                  component="span"
                  sx={{ ml: 1.5, fontSize: 14, fontWeight: 600, bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.5, borderRadius: 1.5 }}
                >
                  {releases.length} releases
                </Box>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Manage and track all product releases across customers
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={loadReleases} disabled={loading} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
              <RefreshIcon titleAccess="Refresh Data" sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Button
            title="Back"
            startIcon={<ArrowBackIcon titleAccess="Back" sx={{ fontSize: 18 }} />}
            onClick={() => onNavigate('dashboard')}
            variant="outlined"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* ── MRT Table (with scroll only inside) ── */}
      {!loading && releases.length === 0 ? (
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
            <InboxIconDisplay sx={(theme) => ({ fontSize: 32, color: theme.palette.primary.main })} titleAccess="No Releases" />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
            No Releases Found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Release information will appear here once available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MaterialReactTable table={table} />
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        fullScreen={detailsDialog.fullscreen}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {detailsDialog.release?.version} - Release Details
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={detailsDialog.fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <IconButton
                size="small"
                onClick={toggleFullscreen}
              >
                {detailsDialog.fullscreen ? (
                  <FullscreenExitIcon titleAccess="Exit fullscreen" sx={{ fontSize: 20 }} />
                ) : (
                  <FullscreenIcon titleAccess="View fullscreen" sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={handleCloseDetails}
              >
                <CloseIcon titleAccess="Close dialog" sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {detailsDialog.release && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Version
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                  {detailsDialog.release.version}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Customer
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                  {detailsDialog.release.customer}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Product
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                  {detailsDialog.release.product}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Planned Date
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                  {detailsDialog.release.plannedDate}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={detailsDialog.release.status}
                    color={getStatusColor(detailsDialog.release.status)}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Artifacts ({detailsDialog.release.artifacts?.length || 0})
                </Typography>
                {detailsDialog.release.artifacts && detailsDialog.release.artifacts.length > 0 ? (
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {detailsDialog.release.artifacts.map((artifact, idx) => (
                      <Typography key={idx} variant="body2" sx={{ ml: 1, wordBreak: 'break-word' }}>
                        • {artifact}
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    No artifacts available
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetails} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Releases;
