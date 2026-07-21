import React, { useState, useMemo, useRef } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Category as ProductIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ExpandIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const STATUS_CONFIG = {
  Active: { bg: 'success', label: 'Active' },
  Temp: { bg: 'secondary', label: 'Temp' },
};

const mockProducts = [
  { id: '1', name: 'Frontend Portal', shortCode: 'FP', description: 'Web-based customer portal application', status: 'Active', createdBy: 'John Smith' },
  { id: '2', name: 'API Gateway', shortCode: 'AG', description: 'Centralized API gateway service', status: 'Active', createdBy: 'Sarah Lee' },
  { id: '3', name: 'Analytics Dashboard', shortCode: 'AD', description: 'Real-time analytics and reporting', status: 'Active', createdBy: 'Mike Chen' },
  { id: '4', name: 'Billing Engine', shortCode: 'BE', description: 'Subscription and billing management', status: 'Temp', createdBy: 'Alex Kumar' },
  { id: '5', name: 'Auth Service', shortCode: 'AS', description: 'Authentication and authorization microservice', status: 'Active', createdBy: 'James Park' },
  { id: '6', name: 'Notification Hub', shortCode: 'NH', description: 'Multi-channel notification delivery', status: 'Temp', createdBy: 'Lisa Tran' },
  { id: '7', name: 'ETL Pipeline', shortCode: 'EP', description: 'Data extraction, transformation and loading', status: 'Active', createdBy: 'Rachel Wong' },
];

const ProductManagement = ({ onNavigate }) => {
  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const tableContainerRef = useRef(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 160,
        Cell: ({ cell }) => (
          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: theme.palette.primary.main }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'shortCode',
        header: 'Short Code',
        size: 100,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            label={cell.getValue()}
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
              borderRadius: '6px',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.dark,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            }}
          />
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 250,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => {
          const val = cell.getValue();
          const isActive = val === 'Active';
          return (
            <Chip
              size="small"
              label={val}
              sx={{
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 22,
                borderRadius: '12px',
                bgcolor: isActive
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha('#7B1FA2', 0.1),
                color: isActive
                  ? theme.palette.success.dark
                  : '#7B1FA2',
                border: `1px solid ${
                  isActive
                    ? alpha(theme.palette.success.main, 0.25)
                    : alpha('#7B1FA2', 0.25)
                }`,
              }}
            />
          );
        },
      },
      {
        accessorKey: 'createdBy',
        header: 'Created By',
        size: 130,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 140,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        Cell: () => (
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="View">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                <ViewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add segment">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08) } }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme]
  );

  const table = useMaterialReactTable({
    columns,
    data: mockProducts,
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
    enableExpanding: true,
    autoResetPageIndex: false,
    layoutMode: 'semantic',
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: 'name', desc: false }],
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
        overflowX: 'auto',
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
    muiExpandButtonProps: ({ row }) => ({
      sx: {
        color: 'text.secondary',
        transition: 'transform 0.2s ease',
        transform: row.getIsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)',
        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
      },
    }),
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          pl: 5,
          pr: 2,
          py: 1.5,
          bgcolor: alpha(theme.palette.action.hover, 0.25),
          borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mb: 0.5, fontWeight: 500 }}>
          Segments
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
          No segments configured for <strong>{row.original.name}</strong>. Click the + action to add one.
        </Typography>
      </Box>
    ),
    renderTopToolbar: ({ table: tbl }) => {
      const { pageIndex, pageSize: ps } = tbl.getState().pagination;
      const totalRows = tbl.getFilteredRowModel().rows.length;
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
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
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

          <FormControl
            size="small"
            sx={{
              minWidth: 130,
              '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) },
            }}
          >
            <InputLabel sx={{ fontSize: '0.8rem' }}>Rows per page</InputLabel>
            <Select
              value={pageSize}
              label="Rows per page"
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                tbl.setPageSize(newSize);
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
              <IconButton size="small" onClick={() => tbl.firstPage()} disabled={pageIndex === 0}>
                <FirstPageIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => tbl.previousPage()} disabled={!tbl.getCanPreviousPage()}>
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => tbl.nextPage()} disabled={!tbl.getCanNextPage()}>
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => tbl.lastPage()} disabled={pageIndex >= Math.ceil(totalRows / ps) - 1}>
                <LastPageIcon sx={{ fontSize: 18 }} />
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
        gap: 2,
        overflow: 'auto',
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
          <ProductIcon sx={{ color: '#fff', fontSize: 22, opacity: 0.9 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 }}>
                  Product Management
                </Typography>
                <Chip
                  size="small"
                  label={`${mockProducts.length} items`}
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    borderRadius: '10px',
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', lineHeight: 1.3 }}>
                Manage products, segments, and configurations
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Refresh">
            <IconButton
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon sx={{ fontSize: 15 }} />}
            sx={{
              color: '#fff',
              fontSize: '0.72rem',
              py: 0.4,
              px: 1.4,
              borderColor: 'rgba(255,255,255,0.35)',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Add Segment
          </Button>
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
            Add Product
          </Button>
          <Button
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />}
            onClick={() => onNavigate?.('dashboard')}
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

      {/* ── Table ── */}
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default ProductManagement;
