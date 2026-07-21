import React, { useMemo, useCallback, useState } from 'react';
import {
  Box, Typography, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Accordion, AccordionSummary,
  AccordionDetails, useTheme, IconButton, Tooltip, Button, Autocomplete,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Public as GlobalIcon,
  Code as EnvIcon,
  Business as TenantIcon,
  DeviceHub as MappingIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable, MRT_TablePagination } from 'material-react-table';
import EditableCell from '../EditableCell';
import SectionHeader from '../SectionHeader';
import { accordionSx, MICROSERVICE_OPTIONS } from '../constants';

const PAGE_SIZE = 10;

/* ── Env Vars MRT ── */
const EnvVarsTable = ({ rows, onChange }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  const handleChange = useCallback((id, field, value) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, [rows, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(rows.filter((r) => r.id !== id));
  }, [rows, onChange]);

  const handleAdd = useCallback(() => {
    const newRows = [...rows, { id: Date.now(), key: '', value: '' }];
    onChange(newRows);
    const lastPage = Math.max(0, Math.ceil(newRows.length / PAGE_SIZE) - 1);
    setPagination((prev) => ({ ...prev, pageIndex: lastPage }));
  }, [rows, onChange]);

  const columns = useMemo(() => [
    {
      accessorKey: 'key', header: 'Variable Name', size: 180,
      Cell: ({ row }) => <EditableCell value={row.original.key} onChange={(v) => handleChange(row.original.id, 'key', v)} placeholder="JAVA_OPTS" />,
    },
    {
      accessorKey: 'value', header: 'Value', size: 260,
      Cell: ({ row }) => <EditableCell value={row.original.value} onChange={(v) => handleChange(row.original.id, 'value', v)} placeholder="-Xms512m -Xmx1024m" />,
    },
    {
      id: 'actions', header: '', size: 50, enableHiding: false,
      Cell: ({ row }) => (
        <Tooltip title="Remove variable"><IconButton size="small" color="error" aria-label="Remove variable" onClick={() => handleDelete(row.original.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      ),
    },
  ], [handleChange, handleDelete]);

  const table = useMaterialReactTable({
    columns, data: rows, enableColumnActions: false, enableColumnFilters: false,
    enablePagination: true, enableSorting: false, enableBottomToolbar: false,
    enableTopToolbar: true, enableGlobalFilter: false, enableFullScreenToggle: false,
    enableHiding: false, enableDensityToggle: false,
    autoResetPageIndex: false,
    state: { pagination },
    onPaginationChange: setPagination,
    paginationDisplayMode: 'pages',
    muiPaginationProps: { showFirstButton: true, showLastButton: true, showRowsPerPage: false, shape: 'rounded', variant: 'outlined', size: 'small' },
    renderTopToolbarCustomActions: () => <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>Add Variable</Button>,
    renderTopToolbar: ({ table }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.5, gap: 1 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>Add Variable</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">{rows.length} row{rows.length !== 1 ? 's' : ''}</Typography>
          <MRT_TablePagination table={table} />
        </Box>
      </Box>
    ),
    muiTablePaperProps: { elevation: 0, sx: { border: '1px solid', borderColor: 'divider', borderRadius: 2 } },
    muiTableContainerProps: { sx: { maxHeight: 300 } },
    muiTableBodyCellProps: { sx: { py: 0.75, px: 1 } },
    muiTableHeadCellProps: { sx: { py: 1, px: 1, fontSize: '0.78rem', fontWeight: 700 } },
  });

  return <MaterialReactTable table={table} />;
};

/* ── Tenants MRT ── */
const TenantsTable = ({ rows, onChange }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  const handleChange = useCallback((id, field, value) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, [rows, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(rows.filter((r) => r.id !== id));
  }, [rows, onChange]);

  const handleAdd = useCallback(() => {
    const newRows = [...rows, { id: Date.now(), tenantId: '', name: '' }];
    onChange(newRows);
    const lastPage = Math.max(0, Math.ceil(newRows.length / PAGE_SIZE) - 1);
    setPagination((prev) => ({ ...prev, pageIndex: lastPage }));
  }, [rows, onChange]);

  const columns = useMemo(() => [
    {
      accessorKey: 'tenantId', header: 'Tenant ID', size: 160,
      Cell: ({ row }) => <EditableCell value={row.original.tenantId} onChange={(v) => handleChange(row.original.id, 'tenantId', v)} placeholder="TENANT001" />,
    },
    {
      accessorKey: 'name', header: 'Organization Name', size: 240,
      Cell: ({ row }) => <EditableCell value={row.original.name} onChange={(v) => handleChange(row.original.id, 'name', v)} placeholder="Acme Corporation" />,
    },
    {
      id: 'actions', header: '', size: 50,
      Cell: ({ row }) => (
        <Tooltip title="Remove tenant"><IconButton size="small" color="error" aria-label="Remove tenant" onClick={() => handleDelete(row.original.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      ),
    },
  ], [handleChange, handleDelete]);

  const table = useMaterialReactTable({
    columns, data: rows, enableColumnActions: false, enableColumnFilters: false,
    enablePagination: true, enableSorting: false, enableBottomToolbar: false,
    enableGlobalFilter: false, enableFullScreenToggle: false, enableHiding: false,
    enableDensityToggle: false,
    autoResetPageIndex: false,
    state: { pagination },
    onPaginationChange: setPagination,
    paginationDisplayMode: 'pages',
    muiPaginationProps: { showFirstButton: true, showLastButton: true, showRowsPerPage: false, shape: 'rounded', variant: 'outlined', size: 'small' },
    renderTopToolbar: ({ table }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.5, gap: 1 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>Add Tenant</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">{rows.length} row{rows.length !== 1 ? 's' : ''}</Typography>
          <MRT_TablePagination table={table} />
        </Box>
      </Box>
    ),
    muiTablePaperProps: { elevation: 0, sx: { border: '1px solid', borderColor: 'divider', borderRadius: 2 } },
    muiTableContainerProps: { sx: { maxHeight: 300 } },
    muiTableBodyCellProps: { sx: { py: 0.75, px: 1 } },
    muiTableHeadCellProps: { sx: { py: 1, px: 1, fontSize: '0.78rem', fontWeight: 700 } },
  });

  return <MaterialReactTable table={table} />;
};

/* ── Tenant Autocomplete (per mapping row) ── */
const TenantAutocomplete = React.memo(function TenantAutocomplete({
  rowId, rowMicroservice, rowTenants, allRows, allTenants, onChange,
}) {
  const usedInOtherRows = useMemo(
    () => allRows.filter((r) => r.id !== rowId && r.microservice === rowMicroservice).flatMap((r) => (Array.isArray(r.tenants) ? r.tenants : [])),
    [allRows, rowId, rowMicroservice],
  );

  const availableOptions = useMemo(
    () => allTenants.filter((t) => !usedInOtherRows.includes(t.tenantId)),
    [allTenants, usedInOtherRows],
  );

  const selectedObjects = useMemo(
    () => allTenants.filter((t) => Array.isArray(rowTenants) && rowTenants.includes(t.tenantId)),
    [allTenants, rowTenants],
  );

  return (
    <Autocomplete
      multiple size="small" options={availableOptions} value={selectedObjects}
      getOptionLabel={(opt) => opt.tenantId}
      isOptionEqualToValue={(opt, val) => opt.tenantId === val.tenantId}
      disableCloseOnSelect
      onChange={(_, newValue) => onChange(newValue.map((v) => v.tenantId))}
      renderTags={(value, getTagProps) => value.map((opt, index) => (
        <Chip key={opt.tenantId} label={opt.tenantId} size="small" {...getTagProps({ index })} sx={{ fontSize: '0.68rem', height: 20, maxWidth: 120 }} />
      ))}
      renderOption={(props, opt) => (
        <li {...props} key={opt.tenantId}><Box><Typography variant="caption" fontWeight={700} display="block">{opt.tenantId}</Typography>{opt.name && <Typography variant="caption" color="text.secondary">{opt.name}</Typography>}</Box></li>
      )}
      renderInput={(params) => <TextField {...params} size="small" placeholder={selectedObjects.length === 0 ? 'Select tenants…' : ''} />}
      noOptionsText={allTenants.length === 0 ? 'No tenants defined — add them in Multi-Tenant Configuration' : 'All tenants are already assigned'}
      sx={{ minWidth: 200 }}
    />
  );
});

/* ── Mapping MRT ── */
const MappingTable = ({ rows, onChange, allTenants }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  const handleChange = useCallback((id, field, value) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, [rows, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(rows.filter((r) => r.id !== id));
  }, [rows, onChange]);

  const handleAdd = useCallback(() => {
    const newRows = [...rows, { id: Date.now(), microservice: 'xconnect', instance: '', tenants: [], replicas: 1 }];
    onChange(newRows);
    const lastPage = Math.max(0, Math.ceil(newRows.length / PAGE_SIZE) - 1);
    setPagination((prev) => ({ ...prev, pageIndex: lastPage }));
  }, [rows, onChange]);

  const columns = useMemo(() => [
    {
      accessorKey: 'microservice', header: 'Service', size: 140,
      Cell: ({ row }) => (
        <FormControl size="small" fullWidth>
          <Select value={row.original.microservice} onChange={(e) => handleChange(row.original.id, 'microservice', e.target.value)} sx={{ fontSize: '0.8125rem' }}>
            {MICROSERVICE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.8125rem' }}>{o.label}</MenuItem>)}
          </Select>
        </FormControl>
      ),
    },
    {
      accessorKey: 'instance', header: 'Instance Name', size: 160,
      Cell: ({ row }) => <EditableCell value={row.original.instance} onChange={(v) => handleChange(row.original.id, 'instance', v)} placeholder="xconnect-group1" />,
    },
    {
      accessorKey: 'tenants', header: 'Tenants', size: 280,
      Cell: ({ row }) => (
        <TenantAutocomplete
          rowId={row.original.id} rowMicroservice={row.original.microservice}
          rowTenants={Array.isArray(row.original.tenants) ? row.original.tenants : []}
          allRows={rows} allTenants={allTenants}
          onChange={(val) => handleChange(row.original.id, 'tenants', val)}
        />
      ),
    },
    {
      accessorKey: 'replicas', header: 'Replicas', size: 90,
      Cell: ({ row }) => <EditableCell value={String(row.original.replicas)} onChange={(v) => handleChange(row.original.id, 'replicas', parseInt(v) || 1)} placeholder="3" type="number" />,
    },
    {
      id: 'actions', header: '', size: 50,
      Cell: ({ row }) => (
        <Tooltip title="Remove mapping"><IconButton size="small" color="error" aria-label="Remove mapping" onClick={() => handleDelete(row.original.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      ),
    },
  ], [handleChange, handleDelete, rows, allTenants]);

  const table = useMaterialReactTable({
    columns, data: rows, enableColumnActions: false, enableColumnFilters: false,
    enablePagination: true, enableSorting: false, enableBottomToolbar: false,
    enableGlobalFilter: false, enableFullScreenToggle: false, enableHiding: false,
    enableDensityToggle: false,
    autoResetPageIndex: false,
    state: { pagination },
    onPaginationChange: setPagination,
    paginationDisplayMode: 'pages',
    muiPaginationProps: { showFirstButton: true, showLastButton: true, showRowsPerPage: false, shape: 'rounded', variant: 'outlined', size: 'small' },
    renderTopToolbar: ({ table }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.5, gap: 1 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>Add Mapping</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">{rows.length} row{rows.length !== 1 ? 's' : ''}</Typography>
          <MRT_TablePagination table={table} />
        </Box>
      </Box>
    ),
    muiTablePaperProps: { elevation: 0, sx: { border: '1px solid', borderColor: 'divider', borderRadius: 2 } },
    muiTableContainerProps: { sx: { maxHeight: 360 } },
    muiTableBodyCellProps: { sx: { py: 0.75, px: 1 } },
    muiTableHeadCellProps: { sx: { py: 1, px: 1, fontSize: '0.78rem', fontWeight: 700 } },
  });

  return <MaterialReactTable table={table} />;
};

/* ── Main Panel ── */
const GlobalConfigPanel = ({
  globalSettings, onGlobalSettingsChange,
  globalEnvVars, onEnvVarsChange,
  tenants, onTenantsChange,
  tenantMicroserviceMapping, onMappingChange,
}) => {
  const theme = useTheme();

  const handleField = (field) => (e) => onGlobalSettingsChange({ ...globalSettings, [field]: e.target.value });
  const handleSwitch = (field) => (e) => onGlobalSettingsChange({ ...globalSettings, [field]: e.target.checked });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Global Configuration</Typography>
        <Typography variant="body2" color="text.secondary">Global settings and environment variables applied to all components</Typography>
      </Box>

      {/* 1. Global Settings */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<GlobalIcon />} title="Global Settings" desc="Image registry, storage class, target environment" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField label="Image Registry" fullWidth size="small" value={globalSettings.imageRegistry} onChange={handleField('imageRegistry')} placeholder="your-registry.azurecr.io" helperText="Azure Container Registry or Docker Hub endpoint" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Environment</InputLabel>
                <Select value={globalSettings.environment} onChange={handleField('environment')} label="Environment">
                  {['dev', 'test', 'uat', 'stage', 'prod'].map((e) => <MenuItem key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField label="Image Pull Secret Name" fullWidth size="small" value={globalSettings.imagePullSecretName ?? ''} onChange={handleField('imagePullSecretName')} placeholder="x28-registry-secret" helperText="Kubernetes secret for pulling container images" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Storage Class" fullWidth size="small" value={globalSettings.storageClass} onChange={handleField('storageClass')} placeholder="managed-premium" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel
                control={<Switch checked={globalSettings.namespacePrefix} onChange={handleSwitch('namespacePrefix')} color="primary" />}
                label={<Typography variant="body2" fontWeight={600}>Namespace Prefix</Typography>}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* 2. Environment Variables */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<EnvIcon />} title="Global Environment Variables" desc={`${globalEnvVars.length} variable${globalEnvVars.length !== 1 ? 's' : ''} applied to all microservices`} color={theme.palette.secondary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <EnvVarsTable rows={globalEnvVars} onChange={onEnvVarsChange} />
        </AccordionDetails>
      </Accordion>

      {/* 3. Tenants */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<TenantIcon />} title="Multi-Tenant Configuration" desc={`${tenants.length} tenant${tenants.length !== 1 ? 's' : ''} defined`} color={theme.palette.success.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Define all tenants supported by this deployment. Each tenant ID must be unique.
          </Typography>
          <TenantsTable rows={tenants} onChange={onTenantsChange} />
        </AccordionDetails>
      </Accordion>

      {/* 4. Microservice-Tenant Mapping */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<MappingIcon />} title="Microservice-to-Tenant Mapping" desc={`${tenantMicroserviceMapping.length} instance${tenantMicroserviceMapping.length !== 1 ? 's' : ''} configured`} color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Configure which tenants are served by each microservice instance and replica count.
          </Typography>
          <MappingTable rows={tenantMicroserviceMapping} onChange={onMappingChange} allTenants={tenants} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GlobalConfigPanel;
