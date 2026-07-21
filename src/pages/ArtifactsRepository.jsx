import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Button,
  InputAdornment,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Grid,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Inventory2 as PackageIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useAlertCenter } from '../contexts/AlertCenter';

const ArtifactsRepository = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [artifactDialogOpen, setArtifactDialogOpen] = useState(false);
  const [activeReleaseTab, setActiveReleaseTab] = useState({});
  const tableContainerRef = useRef(null);

  // Mock data based on shared structure
  const mockData = [
    {
      customer: 'Acme Corporation',
      products: [
        {
          productId: 'acme-portal',
          productName: 'Frontend Portal',
          description: 'Customer-facing web portal with authentication and dashboards',
          category: 'Web Applications',
          latestVersion: 'v2.1.0',
          lastBuildDate: '2024-07-06',
          totalArtifacts: 8,
          releases: [
            {
              version: 'v2.1.0',
              releaseDate: '2024-07-06',
              buildDate: '2024-07-06',
              status: 'current',
              totalSize: 45678912,
              artifacts: [
                {
                  id: 'artifact-1',
                  groupId: 'com.acme.portal',
                  artifactId: 'auth-service',
                  version: '2.1.0',
                  type: 'jar',
                  size: 2457600,
                  uploadDate: '2024-07-06',
                  uploadedBy: 'Bob Smith',
                  description: 'Authentication microservice',
                  checksums: { md5: 'a1b2c3d4e5f6789', sha1: 'f6e5d4c3b2a19876543210', sha256: '9876543210abcdef1234567890' }
                },
                {
                  id: 'artifact-2',
                  groupId: 'com.acme.portal',
                  artifactId: 'web-frontend',
                  version: '2.1.0',
                  type: 'zip',
                  size: 8976543,
                  uploadDate: '2024-07-06',
                  uploadedBy: 'Carol Davis',
                  description: 'React frontend application bundle',
                  checksums: { md5: 'b2c3d4e5f6789012', sha1: 'e5d4c3b2a1987654321', sha256: '8765432109abcdef123456789' }
                },
                {
                  id: 'artifact-3',
                  groupId: 'com.acme.portal',
                  artifactId: 'portal-gateway',
                  version: '2.1.0',
                  type: 'docker',
                  size: 34244769,
                  uploadDate: '2024-07-06',
                  uploadedBy: 'Alice Johnson',
                  description: 'API Gateway Docker image',
                  checksums: { md5: 'c3d4e5f6789012ab', sha1: 'd4c3b2a19876543210', sha256: '7654321098abcdef12345678' }
                }
              ]
            },
            {
              version: 'v2.0.5',
              releaseDate: '2024-06-15',
              buildDate: '2024-06-15',
              status: 'deprecated',
              totalSize: 42345678,
              artifacts: [
                {
                  id: 'artifact-old-1',
                  groupId: 'com.acme.portal',
                  artifactId: 'auth-service',
                  version: '2.0.5',
                  type: 'jar',
                  size: 2345678,
                  uploadDate: '2024-06-15',
                  uploadedBy: 'Bob Smith',
                  description: 'Authentication microservice (legacy)',
                  checksums: { md5: 'x1y2z3a4b5c6789', sha1: 'g7h8i9j0k1l2m3n4o5p6', sha256: 'q8r9s0t1u2v3w4x5y6z7' }
                }
              ]
            }
          ]
        },
        {
          productId: 'acme-analytics',
          productName: 'Analytics Engine',
          description: 'Real-time data processing and analytics platform',
          category: 'Data Processing',
          latestVersion: 'v1.3.2',
          lastBuildDate: '2024-07-05',
          totalArtifacts: 4,
          releases: [
            {
              version: 'v1.3.2',
              releaseDate: '2024-07-05',
              buildDate: '2024-07-05',
              status: 'current',
              totalSize: 67890123,
              artifacts: [
                {
                  id: 'artifact-analytics-1',
                  groupId: 'com.acme.analytics',
                  artifactId: 'data-processor',
                  version: '1.3.2',
                  type: 'jar',
                  size: 45678912,
                  uploadDate: '2024-07-05',
                  uploadedBy: 'David Kim',
                  description: 'Core data processing engine',
                  checksums: { md5: 'e5f6g7h8i9j0123', sha1: 'k4l5m6n7o8p9q0r1s2t3', sha256: 'u6v7w8x9y0z1a2b3c4d5' }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      customer: 'TechCorp Industries',
      products: [
        {
          productId: 'techcorp-gateway',
          productName: 'API Gateway Suite',
          description: 'Enterprise API gateway with rate limiting and monitoring',
          category: 'Infrastructure',
          latestVersion: 'v1.5.2',
          lastBuildDate: '2024-07-05',
          totalArtifacts: 5,
          releases: [
            {
              version: 'v1.5.2',
              releaseDate: '2024-07-05',
              buildDate: '2024-07-05',
              status: 'current',
              totalSize: 23456789,
              artifacts: [
                {
                  id: 'artifact-gateway-1',
                  groupId: 'com.techcorp.gateway',
                  artifactId: 'gateway-core',
                  version: '1.5.2',
                  type: 'jar',
                  size: 12345678,
                  uploadDate: '2024-07-05',
                  uploadedBy: 'David Wilson',
                  description: 'Core gateway functionality',
                  checksums: { md5: 'd4e5f6789012abcd', sha1: 'c3b2a1987654321098', sha256: '654321098abcdef1234567' }
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    loadArtifacts();
  }, []);

  const loadArtifacts = async () => {
    setLoading(true);
    try {
      // Transform mock data into flat table format with hierarchy info
      const flatProducts = [];
      mockData.forEach((customerData) => {
        customerData.products.forEach((product) => {
          flatProducts.push({
            ...product,
            customer: customerData.customer,
          });
        });
      });
      setProducts(flatProducts);
    } catch (err) {
      console.error('Error loading artifacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeColor = (type) => {
    const typeColors = {
      jar: 'primary',
      war: 'secondary',
      zip: 'success',
      docker: 'info',
      npm: 'warning',
      exe: 'error',
    };
    return typeColors[type] || 'default';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      current: 'success',
      deprecated: 'warning',
      archived: 'default',
    };
    return statusColors[status] || 'default';
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'customer',
      header: 'Customer',
      size: 140,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={600}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorKey: 'productName',
      header: 'Product',
      size: 160,
      Cell: ({ cell }) => (
        <Typography variant="body2" fontWeight={600}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 130,
      Cell: ({ cell }) => (
        <Chip size="small" label={cell.getValue()} variant="outlined" />
      ),
    },
    {
      accessorKey: 'latestVersion',
      header: 'Latest Version',
      size: 120,
      Cell: ({ cell }) => (
        <Typography variant="body2">{cell.getValue()}</Typography>
      ),
    },
    {
      accessorKey: 'totalArtifacts',
      header: 'Artifacts',
      size: 100,
      Cell: ({ cell }) => (
        <Chip size="small" label={cell.getValue()} color="primary" variant="outlined" />
      ),
    },
    {
      accessorKey: 'lastBuildDate',
      header: 'Last Build',
      size: 120,
      Cell: ({ cell }) => (
        <Typography variant="body2">
          {new Date(cell.getValue()).toLocaleDateString()}
        </Typography>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: products,
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
    enableExpandAll: false,
    autoResetPageIndex: false,
    layoutMode: 'semantic',
    initialState: {
      pagination: { pageIndex: 0, pageSize: 25 },
      sorting: [{ id: 'customer', desc: false }],
      showGlobalFilter: true,
      density: 'compact',
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
    renderDetailPanel: ({ row }) => (
      <ProductDetailsPanel 
        product={row.original}
        formatFileSize={formatFileSize}
        getTypeColor={getTypeColor}
        getStatusColor={getStatusColor}
        onArtifactSelect={(artifact) => {
          setSelectedArtifact(artifact);
          setArtifactDialogOpen(true);
        }}
        activeTab={activeReleaseTab[row.id] || 0}
        onTabChange={(idx) => setActiveReleaseTab((prev) => ({ ...prev, [row.id]: idx }))}
      />
    ),
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
            placeholder="Search products & artifacts..."
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', ml: 'auto' }}>
            {totalRows > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                Page {pageIndex + 1} of {Math.ceil(totalRows / ps)}
              </Typography>
            )}
            {totalRows > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                Showing {startRow} to {endRow} of {totalRows}
              </Typography>
            )}
          </Box>
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
          <PackageIcon sx={{ color: '#fff', fontSize: 28 }} titleAccess="Artifacts Repository" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              Artifacts Repository
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Product suites and artifacts across all customers
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={loadArtifacts} disabled={loading} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
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
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <MaterialReactTable table={table} />
      </Box>

      {/* ── Artifact Details Dialog ── */}
      <Dialog 
        open={artifactDialogOpen} 
        onClose={() => setArtifactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Artifact Details - {selectedArtifact?.artifactId}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedArtifact && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                  Artifact ID
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedArtifact.artifactId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                  Group ID
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedArtifact.groupId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                  Version
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedArtifact.version}
                </Typography>
              </Box>
              {selectedArtifact.description && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedArtifact.description}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                  Type
                </Typography>
                <Chip 
                  size="small" 
                  label={selectedArtifact.type.toUpperCase()} 
                  color={getTypeColor(selectedArtifact.type)} 
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                  Size
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {formatFileSize(selectedArtifact.size)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                  Uploaded By
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedArtifact.uploadedBy} on {new Date(selectedArtifact.uploadDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={1}>
                  Checksums
                </Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ fontSize: '0.75rem', fontFamily: 'monospace', bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" display="block">
                      <strong>MD5:</strong> {selectedArtifact.checksums.md5}
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', fontFamily: 'monospace', bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" display="block">
                      <strong>SHA1:</strong> {selectedArtifact.checksums.sha1}
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', fontFamily: 'monospace', bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" display="block">
                      <strong>SHA256:</strong> {selectedArtifact.checksums.sha256}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button onClick={() => setArtifactDialogOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Product Details Panel Component - Shows releases and artifacts
const ProductDetailsPanel = ({ 
  product, 
  formatFileSize, 
  getTypeColor, 
  getStatusColor,
  onArtifactSelect,
  activeTab,
  onTabChange
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
      {/* Product Info */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Description
          </Typography>
          <Typography variant="body2">{product.description}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Category
          </Typography>
          <Chip size="small" label={product.category} />
        </Grid>
      </Grid>

      {/* Releases Tabs */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Releases & Artifacts
        </Typography>
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => onTabChange(val)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {product.releases.map((release, idx) => (
            <Tab 
              key={release.version} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{release.version}</span>
                  <Chip 
                    size="small" 
                    label={release.status} 
                    color={getStatusColor(release.status)}
                    variant="outlined"
                  />
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Release Content */}
        <Box sx={{ mt: 2 }}>
          {product.releases.map((release, idx) => (
            activeTab === idx && (
              <Box key={release.version}>
                <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Released
                      </Typography>
                      <Typography variant="body2">
                        {new Date(release.releaseDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Total Size
                      </Typography>
                      <Typography variant="body2">
                        {formatFileSize(release.totalSize)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Artifacts Grid */}
                <Grid container spacing={2}>
                  {release.artifacts.map((artifact) => (
                    <Grid item xs={12} sm={6} md={4} key={artifact.id}>
                      <ArtifactCard 
                        artifact={artifact}
                        formatFileSize={formatFileSize}
                        getTypeColor={getTypeColor}
                        onSelect={() => onArtifactSelect(artifact)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Artifact Card Component
const ArtifactCard = ({ artifact, formatFileSize, getTypeColor, onSelect }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: 'primary.main',
        },
      }}
      onClick={onSelect}
    >
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CodeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Chip 
            size="small" 
            label={artifact.type.toUpperCase()} 
            color={getTypeColor(artifact.type)}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {artifact.artifactId}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {artifact.groupId}
          </Typography>
        </Box>
        {artifact.description && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {artifact.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <Typography variant="caption">
            <StorageIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
            {formatFileSize(artifact.size)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(artifact.uploadDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<InfoIcon sx={{ fontSize: 16 }} />}
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          View
        </Button>
      </Stack>
    </Paper>
  );
};

export default ArtifactsRepository;
