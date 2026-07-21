import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  AccountTree as SBOMIcon,
  Visibility as ViewIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useAlertCenter } from '../contexts/AlertCenter';

const SBOM = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [sbomData, setSbomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const tableContainerRef = useRef(null);

  const stats = useMemo(() => {
    const totalReleases = sbomData.length;
    const deprecated = sbomData.reduce((sum, s) => sum + s.deprecated, 0);
    const eol = sbomData.reduce((sum, s) => sum + s.eol, 0);
    const totalComponents = sbomData.reduce((sum, s) => sum + s.totalComponents, 0);
    const licenses = sbomData.reduce((sum, s) => sum + s.licenses, 0);
    return { totalReleases, deprecated, eol, totalComponents, licenses };
  }, [sbomData]);

  const mockData = [
    {
      id: '1',
      version: 'v2.1.0',
      customer: 'Acme Corp',
      product: 'Frontend Portal',
      lastGenerated: '7/6/2024',
      totalComponents: 245,
      deprecated: 3,
      eol: 0,
      licenses: 12,
      components: [
        {
          id: 'comp-1',
          name: 'auth-service',
          numComponents: 85,
          numLicenses: 3,
          size: '153.07 KB',
          format: 'SPDX',
          status: 'Current',
          generated: '7/6/2024',
          score: 9.98,
          saceVersion: '7.8',
        },
        {
          id: 'comp-2',
          name: 'web-frontend',
          numComponents: 160,
          numLicenses: 7,
          size: '229.07 KB',
          format: 'CycloneDX',
          status: 'Current',
          generated: '7/6/2024',
          score: 9.85,
          saceVersion: '7.8',
        },
      ],
    },
    {
      id: '2',
      version: 'v1.5.2',
      customer: 'TechCorp Industries',
      product: 'API Gateway',
      lastGenerated: '7/5/2024',
      totalComponents: 180,
      deprecated: 2,
      eol: 0,
      licenses: 8,
      components: [
        {
          id: 'comp-3',
          name: 'gateway-core',
          numComponents: 110,
          numLicenses: 5,
          size: '198.45 KB',
          format: 'SPDX',
          status: 'Current',
          generated: '7/5/2024',
          score: 9.72,
          saceVersion: '7.8',
        },
        {
          id: 'comp-4',
          name: 'rate-limiter',
          numComponents: 70,
          numLicenses: 3,
          size: '87.23 KB',
          format: 'CycloneDX',
          status: 'Deprecated',
          generated: '7/5/2024',
          score: 8.45,
          saceVersion: '7.7',
        },
      ],
    },
    {
      id: '3',
      version: 'v3.0.1',
      customer: 'Global Systems Ltd',
      product: 'Analytics Dashboard',
      lastGenerated: '7/4/2024',
      totalComponents: 320,
      deprecated: 5,
      eol: 2,
      licenses: 15,
      components: [
        {
          id: 'comp-5',
          name: 'analytics-engine',
          numComponents: 200,
          numLicenses: 10,
          size: '312.56 KB',
          format: 'SPDX',
          status: 'Current',
          generated: '7/4/2024',
          score: 9.56,
          saceVersion: '7.8',
        },
        {
          id: 'comp-6',
          name: 'data-connector',
          numComponents: 120,
          numLicenses: 5,
          size: '145.89 KB',
          format: 'CycloneDX',
          status: 'Current',
          generated: '7/4/2024',
          score: 9.34,
          saceVersion: '7.7',
        },
      ],
    },
    {
      id: '4',
      version: 'v2.0.8',
      customer: 'InnoSoft Solutions',
      product: 'User Service',
      lastGenerated: '7/3/2024',
      totalComponents: 88,
      deprecated: 0,
      eol: 1,
      licenses: 10,
      components: [
        {
          id: 'comp-7',
          name: 'user-management',
          numComponents: 55,
          numLicenses: 6,
          size: '95.12 KB',
          format: 'SPDX',
          status: 'Current',
          generated: '7/3/2024',
          score: 9.91,
          saceVersion: '7.8',
        },
        {
          id: 'comp-8',
          name: 'notification-service',
          numComponents: 33,
          numLicenses: 4,
          size: '67.34 KB',
          format: 'CycloneDX',
          status: 'EOL',
          generated: '7/3/2024',
          score: 7.20,
          saceVersion: '7.6',
        },
      ],
    },
  ];

  useEffect(() => {
    loadSBOM();
  }, []);

  const loadSBOM = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSbomData(mockData);
    } catch (err) {
      console.error('Error loading SBOM data:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'version',
        header: 'Version',
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight={600}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        size: 150,
      },
      {
        accessorKey: 'product',
        header: 'Product',
        size: 140,
      },
      {
        accessorKey: 'lastGenerated',
        header: 'Last Generated',
        size: 130,
      },
      {
        accessorKey: 'totalComponents',
        header: 'Total Components',
        size: 140,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight={600}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'deprecated',
        header: 'Deprecated',
        size: 110,
        Cell: ({ cell }) => {
          const v = cell.getValue();
          return (
            <Typography
              variant="body2"
              fontWeight={600}
              color={v > 0 ? 'error.main' : 'text.primary'}
            >
              {v}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'eol',
        header: 'EOL',
        size: 80,
        Cell: ({ cell }) => (
          <Typography variant="body2">{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: 'licenses',
        header: 'Licenses',
        size: 100,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setSelectedRow(row.original);
                setViewDialogOpen(true);
              }}
              sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 50 }}
            >
              View
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: sbomData,
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
        '& .MuiTableHead-root': { position: 'sticky', top: 0, zIndex: 2 },
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
        '& .MuiTableCell-body': { padding: '6px 12px', fontSize: '0.85rem' },
        '& .MuiTableRow-root': { minHeight: 36 },
      },
    },
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: { flex: 1, overflowY: 'auto', overflowX: 'auto' },
    },
    muiTablePaperProps: {
      sx: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
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
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search SBOMs..."
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

          <FormControl
            size="small"
            sx={{ minWidth: 150, '& .MuiInputBase-root': { height: 40 } }}
          >
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
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              flexWrap: 'wrap',
            }}
          >
            {totalRows > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Page {pageIndex + 1} of {Math.ceil(totalRows / ps)}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => table.firstPage()}
                disabled={pageIndex === 0}
              >
                <FirstPageIcon titleAccess="First Page" sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon
                  titleAccess="Previous Page"
                  sx={{ fontSize: 18 }}
                />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon
                  titleAccess="Next Page"
                  sx={{ fontSize: 18 }}
                />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => table.lastPage()}
                disabled={
                  pageIndex >= Math.ceil(totalRows / ps) - 1
                }
              >
                <LastPageIcon titleAccess="Last Page" sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {totalRows > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'nowrap' }}
            >
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
    <Box
      sx={{
        p: 2,
        height: 'calc(100vh - 112px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
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
          <SBOMIcon
            sx={{ color: '#fff', fontSize: 28 }}
            titleAccess="SBOM"
          />
          <Box>
            <Typography
              variant="h6"
              sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}
            >
              Software Bill of Materials (SBOM)
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Component tracking and license management across all releases
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            Generate
          </Button>
          <Tooltip title="Refresh data">
            <IconButton
              onClick={loadSBOM}
              disabled={loading}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' },
              }}
            >
              <RefreshIcon titleAccess="Refresh Data" sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Button
            title="Back"
            startIcon={
              <ArrowBackIcon titleAccess="Back" sx={{ fontSize: 18 }} />
            }
            onClick={() => onNavigate('dashboard')}
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(255,255,255,0.15)',
              },
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
          gap: 1,
          px: 2,
          py: 1,
          flexShrink: 0,
          flexWrap: 'wrap',
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Chip
          size="small"
          label={`Total Releases: ${stats.totalReleases}`}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          size="small"
          label={`Deprecated: ${stats.deprecated}`}
          color="error"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`EOL: ${stats.eol}`}
          color="warning"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Components: ${stats.totalComponents}`}
          color="info"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Licenses: ${stats.licenses}`}
          color="success"
          variant="outlined"
        />
      </Box>

      {/* ── MRT Table ── */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <MaterialReactTable table={table} />
      </Box>

      {/* ── View Dialog ── */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          SBOM Details — {selectedRow?.version} ({selectedRow?.product})
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {selectedRow && (
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Customer
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedRow.customer}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Product
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedRow.product}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Version
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedRow.version}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Generated
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedRow.lastGenerated}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip size="small" label={`Components: ${selectedRow.totalComponents}`} />
                <Chip size="small" label={`Deprecated: ${selectedRow.deprecated}`} color="error" variant="outlined" />
                <Chip size="small" label={`EOL: ${selectedRow.eol}`} color="warning" variant="outlined" />
                <Chip size="small" label={`Licenses: ${selectedRow.licenses}`} color="success" variant="outlined" />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Components
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>SBOM / Component</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Components</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Licenses</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Format</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Generated</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRow.components.map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell>{comp.name}</TableCell>
                          <TableCell>{comp.numComponents}</TableCell>
                          <TableCell>{comp.numLicenses}</TableCell>
                          <TableCell>{comp.size}</TableCell>
                          <TableCell>
                            <Chip size="small" label={comp.format} variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={comp.status}
                              color={
                                comp.status === 'Current'
                                  ? 'success'
                                  : comp.status === 'Deprecated'
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell>{comp.score}</TableCell>
                          <TableCell>{comp.generated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewDialogOpen(false)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Expanded Detail Panel — inner component table
const SBOMDetailPanel = ({ row }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-head': {
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <TableCell padding="checkbox" />
              <TableCell>SPDX / CycloneDX</TableCell>
              <TableCell align="center"># Components</TableCell>
              <TableCell align="center">Licenses</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Generated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {row.components.map((comp) => (
              <TableRow key={comp.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {comp.name}
                  </Typography>
                </TableCell>
                <TableCell align="center">{comp.numComponents}</TableCell>
                <TableCell align="center">{comp.numLicenses}</TableCell>
                <TableCell align="right">{comp.size}</TableCell>
                <TableCell>
                  <Chip size="small" label={comp.format} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={comp.status}
                    color={
                      comp.status === 'Current'
                        ? 'success'
                        : comp.status === 'Deprecated'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{comp.generated}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', textTransform: 'none', minWidth: 80 }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SBOM;
