import React, { useMemo, useCallback, useState } from 'react';
import {
  Box, Typography, Grid, TextField, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, useTheme,
  IconButton, Tooltip, Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Hub as ConnIcon,
  Security as SslIcon,
  SwapHoriz as ExchangeIcon,
  Inbox as QueueIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable, MRT_TablePagination } from 'material-react-table';
import EditableCell from '../EditableCell';
import SectionHeader from '../SectionHeader';
import { accordionSx } from '../constants';

const PAGE_SIZE = 10;

/* ── Key-Value MRT for exchanges/queues ── */
const KeyValueTable = ({ rows, onChange, addLabel, keyPlaceholder, valuePlaceholder }) => {
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
      accessorKey: 'key', header: 'Name', size: 180,
      Cell: ({ row }) => <EditableCell value={row.original.key} onChange={(v) => handleChange(row.original.id, 'key', v)} placeholder={keyPlaceholder} />,
    },
    {
      accessorKey: 'value', header: 'Value', size: 280,
      Cell: ({ row }) => <EditableCell value={row.original.value} onChange={(v) => handleChange(row.original.id, 'value', v)} placeholder={valuePlaceholder} />,
    },
    {
      id: 'actions', header: '', size: 50,
      Cell: ({ row }) => (
        <Tooltip title="Remove">
          <IconButton size="small" color="error" aria-label="Remove entry" onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [handleChange, handleDelete, keyPlaceholder, valuePlaceholder]);

  const table = useMaterialReactTable({
    columns, data: rows, enableColumnActions: false, enableColumnFilters: false,
    enablePagination: true, enableSorting: false, enableBottomToolbar: false,
    enableGlobalFilter: false, enableFullScreenToggle: false, enableHiding: false, enableDensityToggle: false,
    state: { pagination },
    onPaginationChange: setPagination,
    paginationDisplayMode: 'pages',
    muiPaginationProps: { showFirstButton: true, showLastButton: true, showRowsPerPage: false, shape: 'rounded', variant: 'outlined', size: 'small' },
    renderTopToolbar: ({ table }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.5, gap: 1 }}>
        <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>{addLabel}</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">{rows.length} row{rows.length !== 1 ? 's' : ''}</Typography>
          <MRT_TablePagination table={table} />
        </Box>
      </Box>
    ),
    muiTablePaperProps: { elevation: 0, sx: { border: '1px solid', borderColor: 'divider', borderRadius: 2 } },
    muiTableContainerProps: { sx: { maxHeight: 280 } },
    muiTableBodyCellProps: { sx: { py: 0.75, px: 1 } },
    muiTableHeadCellProps: { sx: { py: 1, px: 1, fontSize: '0.78rem', fontWeight: 700 } },
  });

  return <MaterialReactTable table={table} />;
};

const MessageQueuePanel = ({ mqConfig, onChange }) => {
  const theme = useTheme();

  const handleField = (field) => (e) => onChange({ ...mqConfig, [field]: e.target.value });

  const handleNumericField = (field) => (e) => {
    const raw = e.target.value;
    onChange({ ...mqConfig, [field]: raw === '' ? '' : parseInt(raw) || '' });
  };

  const handleSwitch = (field) => (e) => onChange({ ...mqConfig, [field]: e.target.checked });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Message Queue Configuration</Typography>
        <Typography variant="body2" color="text.secondary">RabbitMQ — connection, security, exchanges and queues</Typography>
      </Box>

      {/* ── Connection ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ConnIcon />} title="Connection" desc="Host, port, management and virtual host" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Host" fullWidth size="small" value={mqConfig.host ?? ''} onChange={handleField('host')} placeholder="x28-rabbitmq.messaging" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Port" fullWidth size="small" type="number" value={mqConfig.port ?? ''} onChange={handleNumericField('port')} placeholder="5672" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Virtual Host" fullWidth size="small" value={mqConfig.virtualHost ?? ''} onChange={handleField('virtualHost')} placeholder="x28-prod" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Management Host" fullWidth size="small" value={mqConfig.managementHost ?? ''} onChange={handleField('managementHost')} placeholder="x28-rabbitmq-management.messaging" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Management Port" fullWidth size="small" type="number" value={mqConfig.managementPort ?? ''} onChange={handleNumericField('managementPort')} placeholder="15672" /></Grid>
          </Grid>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>Timeouts</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Heartbeat (s)" fullWidth size="small" type="number" value={mqConfig.heartbeat ?? ''} onChange={handleNumericField('heartbeat')} placeholder="60" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Connection Timeout (ms)" fullWidth size="small" type="number" value={mqConfig.connectionTimeout ?? ''} onChange={handleNumericField('connectionTimeout')} placeholder="60000" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Handshake Timeout (ms)" fullWidth size="small" type="number" value={mqConfig.handshakeTimeout ?? ''} onChange={handleNumericField('handshakeTimeout')} placeholder="10000" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Shutdown Timeout (ms)" fullWidth size="small" type="number" value={mqConfig.shutdownTimeout ?? ''} onChange={handleNumericField('shutdownTimeout')} placeholder="5000" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Security ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<SslIcon />} title="Security & Credentials" desc="Secret key references and SSL (optional)" color={theme.palette.error.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Username Secret Key" fullWidth size="small" value={mqConfig.usernameKey ?? ''} onChange={handleField('usernameKey')} placeholder="RABBITMQ_USERNAME" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Password Secret Key" fullWidth size="small" value={mqConfig.passwordKey ?? ''} onChange={handleField('passwordKey')} placeholder="RABBITMQ_PASSWORD" /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel control={<Switch checked={mqConfig.sslEnabled ?? false} onChange={handleSwitch('sslEnabled')} size="small" />} label={<Typography variant="body2">SSL Enabled</Typography>} />
            </Grid>
            {mqConfig.sslEnabled && (
              <>
                <Grid size={{ xs: 12, sm: 4 }}><TextField label="Trust Store Path" fullWidth size="small" value={mqConfig.trustStore ?? ''} onChange={handleField('trustStore')} placeholder="/app/certs/rabbitmq-truststore.jks" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><TextField label="Trust Store Password Key" fullWidth size="small" value={mqConfig.trustStorePasswordKey ?? ''} onChange={handleField('trustStorePasswordKey')} placeholder="RABBITMQ_TRUSTSTORE_PASSWORD" /></Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Exchanges ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ExchangeIcon />} title="Exchanges" desc={`${(mqConfig.exchanges || []).length} exchange(s) (optional)`} color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <KeyValueTable rows={mqConfig.exchanges || []} onChange={(v) => onChange({ ...mqConfig, exchanges: v })} addLabel="Add Exchange" keyPlaceholder="user" valuePlaceholder="x28.user.exchange" />
        </AccordionDetails>
      </Accordion>

      {/* ── Queues ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<QueueIcon />} title="Queues" desc={`${(mqConfig.queues || []).length} queue(s) (optional)`} color={theme.palette.info.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <KeyValueTable rows={mqConfig.queues || []} onChange={(v) => onChange({ ...mqConfig, queues: v })} addLabel="Add Queue" keyPlaceholder="user-registration" valuePlaceholder="x28.user.registration.queue" />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MessageQueuePanel;
