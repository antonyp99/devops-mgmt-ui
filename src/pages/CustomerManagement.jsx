import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  People as CustomersIcon,
  Add as AddIcon,
  Group as TotalIcon,
  NewReleases as ReleasesIcon,
  VerifiedUser as ComplianceIcon,
  Business as EnterpriseIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  PersonAdd as AssignIcon,
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const STATUS_MAP = {
  Active: { color: 'success' },
  Inactive: { color: 'default' },
  Onboarding: { color: 'info' },
  Suspended: { color: 'warning' },
};

const LINE_OPTIONS = ['All', 'Digital Banking', 'Payments', 'Lending', 'Insurance', 'Wealth'];

const mockCustomers = [
  { id: '1', customer: 'Acme Corp', product: 'Frontend Portal', line: 'Digital Banking', status: 'Active', createdBy: 'John Smith' },
  { id: '2', customer: 'TechCorp Industries', product: 'API Gateway', line: 'Payments', status: 'Active', createdBy: 'Sarah Lee' },
  { id: '3', customer: 'Global Systems Ltd', product: 'Analytics Dashboard', line: 'Digital Banking', status: 'Onboarding', createdBy: 'Mike Chen' },
  { id: '4', customer: 'CloudNet Corp', product: 'Billing Engine', line: 'Payments', status: 'Active', createdBy: 'Alex Kumar' },
  { id: '5', customer: 'SecureVault Ltd', product: 'Auth Service', line: 'Insurance', status: 'Active', createdBy: 'James Park' },
  { id: '6', customer: 'DataFlow Inc', product: 'ETL Pipeline', line: 'Lending', status: 'Inactive', createdBy: 'Rachel Wong' },
  { id: '7', customer: 'InnoSoft Solutions', product: 'User Service', line: 'Wealth', status: 'Active', createdBy: 'Emily Davis' },
  { id: '8', customer: 'NexGen Tech', product: 'Notification Hub', line: 'Digital Banking', status: 'Active', createdBy: 'Lisa Tran' },
  { id: '9', customer: 'Finova Group', product: 'Risk Engine', line: 'Lending', status: 'Suspended', createdBy: 'Daniel Ortiz' },
  { id: '10', customer: 'BrightPath Ltd', product: 'Customer Portal', line: 'Insurance', status: 'Onboarding', createdBy: 'Nina Patel' },
];

const CustomerManagement = ({ onNavigate }) => {
  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [lineFilter, setLineFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const tableContainerRef = useRef(null);

  const cards = [
    { title: 'Total Customers', value: '156', sub: 'From API', color: theme.palette.info.main, icon: <TotalIcon /> },
    { title: 'Active Releases', value: '42', sub: 'Across all customers', color: theme.palette.success.main, icon: <ReleasesIcon /> },
    { title: 'Avg Compliance', value: '94.7%', sub: 'Last 30 days', color: '#7B1FA2', icon: <ComplianceIcon /> },
    { title: 'Enterprise Tier', value: '38', sub: '24% of total', color: '#C2185B', icon: <EnterpriseIcon /> },
  ];

  const filteredData = useMemo(() => {
    let data = mockCustomers;
    if (lineFilter !== 'All') data = data.filter((r) => r.line === lineFilter);
    if (statusFilter !== 'All') data = data.filter((r) => r.status === statusFilter);
    return data;
  }, [lineFilter, statusFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'customer',
        header: 'Customer Name',
        size: 160,
        Cell: ({ cell }) => (
          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: theme.palette.primary.main }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      { accessorKey: 'product', header: 'Product Name', size: 150 },
      {
        accessorKey: 'line',
        header: 'Line of Product',
        size: 140,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            label={cell.getValue()}
            sx={{
              fontWeight: 500,
              fontSize: '0.7rem',
              height: 22,
              borderRadius: '6px',
              bgcolor: alpha(theme.palette.info.main, 0.08),
              color: theme.palette.info.dark,
              border: `1px solid ${alpha(theme.palette.info.main, 0.18)}`,
            }}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        Cell: ({ cell }) => {
          const val = cell.getValue();
          const cfg = STATUS_MAP[val] || { color: 'default' };
          return (
            <Chip
              size="small"
              label={val}
              color={cfg.color}
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: '0.7rem', height: 22, borderRadius: '12px' }}
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
            <Tooltip title="Assign">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
                <AssignIcon sx={{ fontSize: 16 }} />
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
      sorting: [{ id: 'customer', desc: false }],
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
            placeholder="Search customers..."
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
              flex: '1 1 220px',
              minWidth: { xs: '100%', sm: 180 },
              '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Line of Product</InputLabel>
            <Select value={lineFilter} label="Line of Product" onChange={(e) => setLineFilter(e.target.value)}>
              {LINE_OPTIONS.map((l) => (
                <MenuItem key={l} value={l}>{l === 'All' ? 'All Lines' : l}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Onboarding">Onboarding</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Rows per page</InputLabel>
            <Select
              value={pageSize}
              label="Rows per page"
              onChange={(e) => {
                const s = Number(e.target.value);
                setPageSize(s);
                tbl.setPageSize(s);
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
        display: 'flex',
        flexDirection: 'column',
        gap: 1.8,
        height: '100%',
        overflow: 'auto',
        p: 0,
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
          <CustomersIcon sx={{ color: '#fff', fontSize: 22, opacity: 0.9 }} />
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Customer Management
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', lineHeight: 1.3 }}>
              Manage customer accounts, products, and compliance status
            </Typography>
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
            Add Customer
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

      {/* ── Compact Metric Cards ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        {cards.map((card, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              borderRadius: '10px',
              border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
              borderTop: `2.5px solid ${alpha(card.color, 0.5)}`,
              bgcolor: theme.palette.background.paper,
              px: 1.5,
              py: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              '&:hover': {
                boxShadow: `0 2px 10px ${alpha(theme.palette.text.primary, 0.04)}`,
                borderColor: alpha(theme.palette.divider, 0.65),
                borderTopColor: alpha(card.color, 0.65),
              },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.66rem', fontWeight: 450, color: 'text.disabled', lineHeight: 1.3 }}>
                {card.title}
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
                {card.value}
              </Typography>
              <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled', fontWeight: 400 }}>
                {card.sub}
              </Typography>
            </Box>
            <Box sx={{ color: card.color, opacity: 0.4, flexShrink: 0 }}>
              {React.cloneElement(card.icon, { sx: { fontSize: 18 } })}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Customer Table ── */}
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CustomerManagement;
