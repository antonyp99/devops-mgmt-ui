import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
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
  alpha,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Assessment as QualityIcon,
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  Visibility as ViewIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useAlertCenter } from '../contexts/AlertCenter';

const statusColorMap = {
  'Pending': 'warning',
  'Approved': 'success',
  'Rejected': 'error',
};

const priorityColorMap = {
  'High': 'error',
  'Medium': 'warning',
  'Low': 'info',
};

const PendingQualityApprovals = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, item: null });

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
    if (approvals.length > 0) calculateTableHeight();
  }, [approvals, calculateTableHeight]);

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      // Mock data
      setApprovals([
        {
          id: '1',
          type: 'Vulnerability Report',
          release: '2.1.0',
          customer: 'Acme Corp',
          product: 'API Gateway',
          priority: 'High',
          status: 'Pending',
          submitted_by: 'John Doe',
          date: '2024-12-15',
        },
        {
          id: '2',
          type: 'Test Report',
          release: '1.9.3',
          customer: 'Beta Inc',
          product: 'Dashboard',
          priority: 'Medium',
          status: 'Approved',
          submitted_by: 'Jane Smith',
          date: '2024-12-14',
        },
        {
          id: '3',
          type: 'SBOM Report',
          release: '3.0.0-beta',
          customer: 'Gamma Ltd',
          product: 'Core Engine',
          priority: 'Low',
          status: 'Rejected',
          submitted_by: 'Bob Wilson',
          date: '2024-12-13',
        },
      ]);
    } catch (err) {
      console.error('Error loading quality approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = useCallback(async (itemId) => {
    setActionLoading(itemId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Report approved successfully', 'success');
      await loadApprovals();
    } catch (err) {
      console.error('Approval error:', err);
      showToast('Failed to approve report', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  const handleReject = useCallback(async (itemId) => {
    setActionLoading(itemId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Report rejected', 'warning');
      await loadApprovals();
    } catch (err) {
      console.error('Rejection error:', err);
      showToast('Failed to reject report', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  const handleViewDetails = useCallback((item) => {
    setDetailsDialog({ open: true, item });
  }, []);

  const handleCloseDetails = () => {
    setDetailsDialog({ open: false, item: null });
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'type',
      header: 'Type',
      size: 140,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={500}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorKey: 'release',
      header: 'Release',
      size: 120,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={600}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      id: 'customer_product',
      header: 'Customer/Product',
      size: 180,
      Cell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.original.customer}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.original.product}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 120,
      Cell: ({ cell }) => (
        <Chip
          size="small"
          label={cell.getValue()}
          color={priorityColorMap[cell.getValue()] || 'default'}
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      Cell: ({ cell }) => (
        <Chip
          size="small"
          label={cell.getValue()}
          color={statusColorMap[cell.getValue()] || 'default'}
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: 'submitted_by',
      header: 'Submitted By',
      size: 140,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 140,
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 120,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          {row.original.status === 'Pending' ? (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleApprove(row.original.id)}
                  disabled={actionLoading === row.original.id}
                >
                  {actionLoading === row.original.id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckIcon titleAccess="Approve report" sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleReject(row.original.id)}
                  disabled={actionLoading === row.original.id}
                >
                  <CloseIcon titleAccess="Reject report" sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="View details">
              <IconButton
                size="small"
                onClick={() => handleViewDetails(row.original)}
              >
                <ViewIcon titleAccess="View report details" sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ], [actionLoading, handleApprove, handleReject, handleViewDetails]);

  const table = useMaterialReactTable({
    columns,
    data: approvals,
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
      sorting: [{ id: 'date', desc: true }],
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
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <QualityIcon sx={{ color: '#fff', fontSize: 28 }} titleAccess="Quality Approvals" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              Pending Quality Approvals
              {approvals.length > 0 && (
                <Box
                  component="span"
                  sx={{ ml: 1.5, fontSize: 14, fontWeight: 600, bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.5, borderRadius: 1.5 }}
                >
                  {approvals.filter(a => a.status === 'Pending').length} pending
                </Box>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Review and approve quality assurance reports and test artifacts
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={loadApprovals} disabled={loading} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
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

      {/* ── MRT Table ── */}
      {!loading && approvals.length === 0 ? (
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
              backgroundColor: alpha(theme.palette.info.main, 0.08),
              mb: 2,
            })}
          >
            <QualityIcon sx={(theme) => ({ fontSize: 32, color: theme.palette.info.main })} titleAccess="No Quality Approvals" />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
            No Quality Reports Found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Quality assurance reports and test artifacts will appear here for review
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MaterialReactTable table={table} />
        </Box>
      )}

      {/* View Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            {detailsDialog.item?.type} - {detailsDialog.item?.release}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {detailsDialog.item && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Type
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {detailsDialog.item.type}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Release
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {detailsDialog.item.release}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Customer / Product
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {detailsDialog.item.customer} / {detailsDialog.item.product}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Priority
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={detailsDialog.item.priority}
                    color={priorityColorMap[detailsDialog.item.priority]}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={detailsDialog.item.status}
                    color={statusColorMap[detailsDialog.item.status]}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Submitted By
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {detailsDialog.item.submitted_by}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Date
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {detailsDialog.item.date}
                </Typography>
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

export default PendingQualityApprovals;
