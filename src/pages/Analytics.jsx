import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
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
  Assessment as AnalyticsIcon,
  LocalOffer as ReleasesIcon,
  CheckCircle as SuccessIcon,
  Shield as VulnIcon,
  People as CustomersIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FilterList as FilterListIcon,
  NoteAdd as GenerateIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  ChevronLeft as PrevPageIcon,
  ChevronRight as NextPageIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const TIME_RANGES = [
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days', disabled: true },
  { key: '90d', label: 'Last 90 Days' },
  { key: '1y', label: 'Last Year' },
];

const REPORT_DATA = [
  { id: '1', name: 'Q1 2026 Security Assessment', type: 'Security', typeColor: 'info', date: 'Apr 10, 2026', fileType: 'PDF', size: '2.4 MB' },
  { id: '2', name: 'Monthly Performance Report — March', type: 'Performance', typeColor: 'secondary', date: 'Apr 5, 2026', fileType: 'PDF', size: '1.8 MB' },
  { id: '3', name: 'SOC 2 Compliance Audit Report', type: 'Compliance', typeColor: 'success', date: 'Mar 28, 2026', fileType: 'PDF', size: '3.1 MB' },
  { id: '4', name: 'Vulnerability Scan Summary — Week 14', type: 'Security', typeColor: 'info', date: 'Mar 22, 2026', fileType: 'PDF', size: '0.9 MB' },
  { id: '5', name: 'Release Pipeline Health Check', type: 'Performance', typeColor: 'secondary', date: 'Mar 15, 2026', fileType: 'PDF', size: '1.2 MB' },
  { id: '6', name: 'GDPR Data Processing Audit', type: 'Compliance', typeColor: 'success', date: 'Mar 10, 2026', fileType: 'PDF', size: '4.5 MB' },
  { id: '7', name: 'Dependency Risk Analysis — Q1', type: 'Security', typeColor: 'info', date: 'Mar 5, 2026', fileType: 'PDF', size: '2.0 MB' },
  { id: '8', name: 'Infrastructure Cost Report — Feb', type: 'Performance', typeColor: 'secondary', date: 'Feb 28, 2026', fileType: 'XLSX', size: '0.7 MB' },
  { id: '9', name: 'PCI-DSS Compliance Summary', type: 'Compliance', typeColor: 'success', date: 'Feb 20, 2026', fileType: 'PDF', size: '3.8 MB' },
  { id: '10', name: 'Penetration Test Results — Feb', type: 'Security', typeColor: 'info', date: 'Feb 15, 2026', fileType: 'PDF', size: '5.2 MB' },
  { id: '11', name: 'SLA Performance Summary — Feb', type: 'Performance', typeColor: 'secondary', date: 'Feb 10, 2026', fileType: 'PDF', size: '1.1 MB' },
  { id: '12', name: 'ISO 27001 Gap Analysis', type: 'Compliance', typeColor: 'success', date: 'Feb 5, 2026', fileType: 'PDF', size: '2.9 MB' },
];

const ReportsTable = ({ theme, reportSearch, setReportSearch, reportPageSize, setReportPageSize }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Report Name',
        size: 260,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 120,
        Cell: ({ row }) => {
          const { type, typeColor } = row.original;
          return (
            <Chip
              size="small"
              label={type}
              sx={{
                height: 20,
                fontSize: '0.62rem',
                fontWeight: 500,
                borderRadius: '5px',
                bgcolor: alpha(theme.palette[typeColor].main, 0.08),
                color: theme.palette[typeColor].dark,
                border: `1px solid ${alpha(theme.palette[typeColor].main, 0.18)}`,
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Generated Date',
        size: 130,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'fileType',
        header: 'File Type',
        size: 80,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'size',
        header: 'Size',
        size: 80,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{cell.getValue()}</Typography>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 150,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        Cell: () => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View report">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.06) } }}>
                <ViewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download report">
              <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.06) } }}>
                <DownloadIcon sx={{ fontSize: 16 }} />
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
    data: REPORT_DATA,
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
      sorting: [{ id: 'date', desc: true }],
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
      sx: {
        overflowY: reportPageSize > 10 ? 'auto' : 'hidden',
        overflowX: 'hidden',
        ...(reportPageSize > 10 && { maxHeight: 400 }),
        transition: 'max-height 0.2s ease',
      },
    },
    muiTablePaperProps: {
      sx: {
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
        <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search reports..."
            value={reportSearch ?? ''}
            onChange={(e) => setReportSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon titleAccess="Search" sx={{ fontSize: 16, color: 'text.disabled' }} /></InputAdornment> }}
            sx={{ flex: '1 1 280px', minWidth: { xs: '100%', sm: 200 }, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}
          />

          <FormControl size="small" sx={{ minWidth: 120, '& .MuiInputBase-root': { height: 34, fontSize: '0.8rem', borderRadius: '8px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.6) } }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Rows</InputLabel>
            <Select value={reportPageSize} label="Rows" onChange={(e) => { const v = Number(e.target.value); setReportPageSize(v); tbl.setPageSize(v); }}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', ml: 'auto' }}>
            {totalRows > 0 && <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>Showing {startRow}–{endRow} of {totalRows}</Typography>}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <IconButton size="small" onClick={() => tbl.firstPage()} disabled={pageIndex === 0}><FirstPageIcon sx={{ fontSize: 18 }} /></IconButton>
              <IconButton size="small" onClick={() => tbl.previousPage()} disabled={!tbl.getCanPreviousPage()}><PrevPageIcon sx={{ fontSize: 18 }} /></IconButton>
              <IconButton size="small" onClick={() => tbl.nextPage()} disabled={!tbl.getCanNextPage()}><NextPageIcon sx={{ fontSize: 18 }} /></IconButton>
              <IconButton size="small" onClick={() => tbl.lastPage()} disabled={pageIndex >= Math.ceil(totalRows / ps) - 1}><LastPageIcon sx={{ fontSize: 18 }} /></IconButton>
            </Box>
          </Box>
        </Box>
      );
    },
    state: { globalFilter: reportSearch },
  });

  return <MaterialReactTable table={table} />;
};

const Analytics = ({ onNavigate }) => {
  const theme = useTheme();
  const [selectedRange, setSelectedRange] = useState('7d');
  const custScrollRef = useRef(null);
  const [custSlide, setCustSlide] = useState(0);

  const allCustomers = useMemo(() => [
    { name: 'Acme Corp', status: 'excellent', releases: 42, vulns: 3 },
    { name: 'TechCorp Industries', status: 'good', releases: 35, vulns: 7 },
    { name: 'Global Systems Ltd', status: 'needs attention', releases: 28, vulns: 18 },
    { name: 'CloudNet Corp', status: 'excellent', releases: 31, vulns: 2 },
    { name: 'SecureVault Ltd', status: 'good', releases: 26, vulns: 5 },
    { name: 'DataFlow Inc', status: 'needs attention', releases: 19, vulns: 22 },
    { name: 'NexGen Tech', status: 'excellent', releases: 38, vulns: 1 },
    { name: 'InnoSoft Solutions', status: 'good', releases: 24, vulns: 9 },
  ], []);

  const CARDS_PER_VIEW = 2;
  const totalSlides = Math.ceil(allCustomers.length / CARDS_PER_VIEW);

  // ── Reports table state ──
  const [reportSearch, setReportSearch] = useState('');
  const [reportPageSize, setReportPageSize] = useState(10);

  const scrollToSlide = useCallback((index) => {
    const el = custScrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, totalSlides - 1));
    setCustSlide(clamped);
    const cardWidth = el.scrollWidth / totalSlides;
    el.scrollTo({ left: cardWidth * clamped, behavior: 'smooth' });
  }, [totalSlides]);

  useEffect(() => {
    const el = custScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / totalSlides;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setCustSlide(Math.max(0, Math.min(idx, totalSlides - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [totalSlides]);

  const cards = [
    {
      title: 'Total Releases',
      value: '184',
      sub: '+15% from last period',
      trend: 'up',
      color: theme.palette.primary.main,
      icon: <ReleasesIcon />,
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      sub: '+3.1% from last period',
      trend: 'up',
      color: theme.palette.success.main,
      icon: <SuccessIcon />,
    },
    {
      title: 'Active Vulnerabilities',
      value: '23',
      sub: '-8% from last period',
      trend: 'down',
      color: theme.palette.warning.dark,
      icon: <VulnIcon />,
    },
    {
      title: 'Active Customers',
      value: '47',
      sub: '+5 new this period',
      trend: 'up',
      color: theme.palette.info.main,
      icon: <CustomersIcon />,
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
          <AnalyticsIcon sx={{ color: '#fff', fontSize: 22, opacity: 0.9 }} titleAccess="Analytics" />
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Analytics &amp; Reporting
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', lineHeight: 1.3 }}>
              Comprehensive insights and metrics for release management
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

      {/* ── Time Range Filter ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 0.5,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: 'text.secondary', mr: 0.5 }}>
          Time Range:
        </Typography>
        {TIME_RANGES.map((r) => (
          <Button
            key={r.key}
            size="small"
            disabled={r.disabled}
            onClick={() => setSelectedRange(r.key)}
            sx={{
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: selectedRange === r.key ? 600 : 400,
              py: 0.35,
              px: 1.25,
              borderRadius: '7px',
              minWidth: 'auto',
              color: selectedRange === r.key ? theme.palette.primary.main : 'text.secondary',
              bgcolor: selectedRange === r.key ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              border: `1px solid ${selectedRange === r.key ? alpha(theme.palette.primary.main, 0.3) : 'transparent'}`,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: selectedRange === r.key
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.action.hover, 0.04),
              },
              '&.Mui-disabled': {
                color: alpha(theme.palette.text.disabled, 0.45),
                border: '1px solid transparent',
              },
            }}
          >
            {r.label}
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
              position: 'relative',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              '&:hover': {
                boxShadow: `0 2px 12px ${alpha(card.color, 0.1)}`,
                borderColor: alpha(card.color, 0.25),
              },
            }}
          >
            {/* Title + Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.74rem', fontWeight: 500, color: 'text.secondary' }}>
                {card.title}
              </Typography>
              <Box sx={{ color: card.color, opacity: 0.55 }}>
                {React.cloneElement(card.icon, { sx: { fontSize: 20 } })}
              </Box>
            </Box>

            {/* Value */}
            <Typography sx={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.1, color: 'text.primary' }}>
              {card.value}
            </Typography>

            {/* Sub text */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              {card.trend === 'up' && (
                <TrendingUpIcon sx={{ fontSize: 13, color: 'success.main' }} />
              )}
              {card.trend === 'down' && (
                <TrendingDownIcon sx={{ fontSize: 13, color: card.color === theme.palette.warning.dark ? 'success.main' : 'error.main' }} />
              )}
              <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', fontWeight: 400 }}>
                {card.sub}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Key Trends ── */}
      <Box sx={{ flexShrink: 0, mt: 0.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', mb: 1.25, color: 'text.primary' }}>
          Key Trends
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 1.5,
          }}
        >
          {[
            { title: 'Release Velocity', value: '+15%', type: 'positive' },
            { title: 'Deployment Success Rate', value: '96.8%', type: 'neutral' },
            { title: 'Critical Vulnerabilities', value: '-22%', type: 'positive' },
            { title: 'Average Fix Time', value: '-8%', type: 'positive' },
            { title: 'Customer Satisfaction', value: '+12%', type: 'positive' },
            { title: 'Compliance Score', value: '98.5%', type: 'neutral' },
          ].map((t) => {
            const isPositive = t.type === 'positive' && t.value.startsWith('+');
            const isNegativeGood = t.type === 'positive' && t.value.startsWith('-');
            const isNeutral = t.type === 'neutral';
            const valueColor = isNeutral
              ? theme.palette.primary.main
              : (isPositive || isNegativeGood)
                ? theme.palette.success.main
                : theme.palette.error.main;
            const trendIcon = isNeutral
              ? <TrendingUpIcon sx={{ fontSize: 16, color: alpha(theme.palette.primary.main, 0.5) }} />
              : (isPositive || isNegativeGood)
                ? <TrendingUpIcon sx={{ fontSize: 16, color: alpha(theme.palette.success.main, 0.5) }} />
                : <TrendingDownIcon sx={{ fontSize: 16, color: alpha(theme.palette.error.main, 0.5) }} />;

            return (
              <Paper
                key={t.title}
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
                    boxShadow: `0 2px 10px ${alpha(valueColor, 0.1)}`,
                    borderColor: alpha(valueColor, 0.25),
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.74rem', fontWeight: 500, color: 'text.secondary' }}>
                    {t.title}
                  </Typography>
                  {trendIcon}
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.1, color: valueColor }}>
                  {t.value}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* ── Charts ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        {[
          { title: 'Release Velocity Over Time', icon: <LineChartIcon /> },
          { title: 'Vulnerability Distribution', icon: <PieChartIcon /> },
        ].map((chart) => (
          <Paper
            key={chart.title}
            elevation={0}
            sx={{
              borderRadius: '10px',
              border: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 2, pt: 1.75, pb: 1 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.primary' }}>
                {chart.title}
              </Typography>
            </Box>
            <Box
              sx={{
                mx: 1.5,
                mb: 1.5,
                borderRadius: '8px',
                bgcolor: alpha(theme.palette.background.default, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.25,
              }}
            >
              {React.cloneElement(chart.icon, { sx: { fontSize: 36, color: alpha(theme.palette.text.disabled, 0.3) } })}
              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 500 }}>
                Chart visualization will be implemented here
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Top Customers ── */}
      <Box
        sx={{
          flexShrink: 0,
          mt: 0.5,
          background: `linear-gradient(135deg, ${alpha(theme.palette.action.hover, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
          borderRadius: '14px',
          p: 2.5,
          position: 'relative',
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', mb: 1.5, color: 'text.primary' }}>
          Top Customers
        </Typography>

        {/* Carousel row: [Arrow] [Cards] [Arrow] */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Left arrow */}
          <IconButton
            size="small"
            disabled={custSlide === 0}
            onClick={() => scrollToSlide(custSlide - 1)}
            sx={{
              flexShrink: 0,
              width: 28,
              height: 28,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.06)}`,
              '&:hover': { bgcolor: theme.palette.background.paper, boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}` },
              '&.Mui-disabled': { opacity: 0.35, bgcolor: theme.palette.background.paper },
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 16 }} />
          </IconButton>

          {/* Scrollable track */}
          <Box
            ref={custScrollRef}
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              py: 0.5,
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {allCustomers.map((c) => {
              const statusMap = {
                excellent: { color: theme.palette.success, label: 'excellent' },
                good: { color: theme.palette.info, label: 'good' },
                'needs attention': { color: theme.palette.warning, label: 'needs attention' },
              };
              const sc = statusMap[c.status] || statusMap.good;
              const highVulns = c.vulns >= 15;

              return (
                <Paper
                  key={c.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: { xs: '85%', sm: 'calc(50% - 6px)' },
                    maxWidth: { xs: '85%', sm: 'calc(50% - 6px)' },
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    borderRadius: '10px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    bgcolor: theme.palette.background.paper,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                    '&:hover': {
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.25),
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {/* Name + Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.primary' }}>
                      {c.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={sc.label}
                      sx={{
                        height: 20,
                        fontSize: '0.62rem',
                        fontWeight: 500,
                        borderRadius: '5px',
                        bgcolor: alpha(sc.color.main, 0.08),
                        color: sc.color.dark,
                        border: `1px solid ${alpha(sc.color.main, 0.2)}`,
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  </Box>

                  {/* Releases row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Releases</Typography>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>{c.releases}</Typography>
                  </Box>

                  {/* Vulnerabilities row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Vulnerabilities</Typography>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: highVulns ? 'error.main' : 'text.primary' }}>{c.vulns}</Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {/* Right arrow */}
          <IconButton
            size="small"
            disabled={custSlide >= totalSlides - 1}
            onClick={() => scrollToSlide(custSlide + 1)}
            sx={{
              flexShrink: 0,
              width: 28,
              height: 28,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.06)}`,
              '&:hover': { bgcolor: theme.palette.background.paper, boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}` },
              '&.Mui-disabled': { opacity: 0.35, bgcolor: theme.palette.background.paper },
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Dot indicators */}
        {totalSlides > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
            {Array.from({ length: totalSlides }, (_, i) => (
              <Box
                key={i}
                onClick={() => scrollToSlide(i)}
                sx={{
                  width: custSlide === i ? 16 : 6,
                  height: 6,
                  borderRadius: '3px',
                  bgcolor: custSlide === i ? theme.palette.primary.main : alpha(theme.palette.text.disabled, 0.25),
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: custSlide === i ? theme.palette.primary.main : alpha(theme.palette.text.disabled, 0.4) },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ── Recent Reports ── */}
      <Box sx={{ flexShrink: 0, mt: 0.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25, flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: 'text.primary' }}>
            Recent Reports
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Button
              size="small"
              startIcon={<FilterListIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.72rem',
                fontWeight: 500,
                py: 0.35,
                px: 1.25,
                borderRadius: '7px',
                color: 'text.secondary',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.04) },
              }}
            >
              Filter
            </Button>
            <Button
              size="small"
              disabled
              startIcon={<GenerateIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.72rem',
                fontWeight: 500,
                py: 0.35,
                px: 1.25,
                borderRadius: '7px',
              }}
            >
              Generate Report
            </Button>
          </Box>
        </Box>

        <ReportsTable theme={theme} reportSearch={reportSearch} setReportSearch={setReportSearch} reportPageSize={reportPageSize} setReportPageSize={setReportPageSize} />
      </Box>
    </Box>
  );
};

export default Analytics;
