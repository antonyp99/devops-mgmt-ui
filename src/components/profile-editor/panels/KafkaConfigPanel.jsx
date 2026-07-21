import React, { useMemo, useCallback, useState } from 'react';
import {
  Box, Typography, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Accordion, AccordionSummary,
  AccordionDetails, Paper, alpha, useTheme, IconButton,
  Tooltip, Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Hub as BrokerIcon,
  Security as SecurityIcon,
  Label as TopicFormatIcon,
  Topic as TopicsIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Psychology as ConsumerIcon,
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable, MRT_TablePagination } from 'material-react-table';
import EditableCell from '../EditableCell';
import SectionHeader from '../SectionHeader';
import { accordionSx, TOPIC_FORMAT_OPTIONS } from '../constants';

const PAGE_SIZE = 10;

/* ──────────────── Kafka Topics MRT Table ──────────────── */
const TopicsTable = ({ rows, onChange, topicNameFormat }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  const handleChange = useCallback((id, field, value) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, [rows, onChange]);

  const handleDelete = useCallback((id) => {
    onChange(rows.filter((r) => r.id !== id));
  }, [rows, onChange]);

  const handleAdd = useCallback(() => {
    const newRows = [...rows, { id: Date.now(), referenceId: '', topicName: '', isTenantSpecific: false }];
    onChange(newRows);
    const lastPage = Math.max(0, Math.ceil(newRows.length / PAGE_SIZE) - 1);
    setPagination((prev) => ({ ...prev, pageIndex: lastPage }));
  }, [rows, onChange]);

  const getPreview = (topic) => {
    if (!topic.topicName) return '—';
    if (topic.isTenantSpecific) {
      return topicNameFormat
        .replace('{tenantid}', 'T001')
        .replace('{topicName}', topic.topicName);
    }
    return topic.topicName;
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'referenceId', header: 'Reference ID', size: 160,
      Cell: ({ row }) => (
        <EditableCell value={row.original.referenceId} onChange={(v) => handleChange(row.original.id, 'referenceId', v)} placeholder="user-events" />
      ),
    },
    {
      accessorKey: 'topicName', header: 'Topic Name', size: 180,
      Cell: ({ row }) => (
        <EditableCell value={row.original.topicName} onChange={(v) => handleChange(row.original.id, 'topicName', v)} placeholder="user.events" />
      ),
    },
    {
      accessorKey: 'isTenantSpecific', header: 'Tenant Specific', size: 120,
      Cell: ({ row }) => (
        <Switch size="small" checked={row.original.isTenantSpecific} onChange={(e) => handleChange(row.original.id, 'isTenantSpecific', e.target.checked)} color="primary" />
      ),
    },
    {
      id: 'preview', header: 'Preview', size: 200,
      Cell: ({ row }) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 0.75, py: 0.25, borderRadius: 1, display: 'inline-block', color: 'primary.dark', fontSize: '0.72rem' }}>
          {getPreview(row.original)}
        </Typography>
      ),
    },
    {
      id: 'actions', header: '', size: 50,
      Cell: ({ row }) => (
        <Tooltip title="Remove topic">
          <IconButton size="small" color="error" aria-label="Remove topic" onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [handleChange, handleDelete, topicNameFormat]);

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
        <Button size="small" startIcon={<AddIcon />} onClick={handleAdd}>Add Topic</Button>
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

/* ──────────────── Main Panel ──────────────── */
const KafkaConfigPanel = ({
  kafkaConfig,
  onKafkaConfigChange,
  kafkaTopics,
  onTopicsChange,
  topicNameFormat,
  onTopicFormatChange,
}) => {
  const theme = useTheme();

  const handleField = (field) => (e) =>
    onKafkaConfigChange({ ...kafkaConfig, [field]: e.target.value });

  const handleNumericField = (field) => (e) => {
    const raw = e.target.value;
    onKafkaConfigChange({ ...kafkaConfig, [field]: raw === '' ? '' : parseInt(raw) || '' });
  };

  const handleSwitch = (field) => (e) =>
    onKafkaConfigChange({ ...kafkaConfig, [field]: e.target.checked });

  const exampleName = (topicNameFormat || '{tenantid}.{topicName}')
    .replace('{tenantid}', 'TENANT001')
    .replace('{topicName}', 'user.events');

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Kafka Configuration</Typography>
        <Typography variant="body2" color="text.secondary">Apache Kafka event streaming — brokers, security, topics</Typography>
      </Box>

      {/* ── Brokers ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<BrokerIcon />} title="Kafka Brokers" desc="Bootstrap, internal and external endpoints" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField label="Bootstrap Servers" fullWidth size="small" value={kafkaConfig.bootstrapServers} onChange={handleField('bootstrapServers')} placeholder="kafka-bootstrap:9092" helperText="Primary broker endpoint" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Internal Endpoint" fullWidth size="small" value={kafkaConfig.internalEndpoint ?? ''} onChange={handleField('internalEndpoint')} placeholder="kafka-internal:9093" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="External Endpoint" fullWidth size="small" value={kafkaConfig.externalEndpoint ?? ''} onChange={handleField('externalEndpoint')} placeholder="kafka.external.com:9094" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Security ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<SecurityIcon />} title="Security Settings" desc="Protocol, SASL, truststore & keystore" color={theme.palette.error.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Security Protocol</InputLabel>
                <Select value={kafkaConfig.protocol} onChange={handleField('protocol')} label="Security Protocol">
                  {['SASL_SSL', 'PLAINTEXT', 'SSL', 'SASL_PLAINTEXT'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>SASL Mechanism</InputLabel>
                <Select value={kafkaConfig.mechanism} onChange={handleField('mechanism')} label="SASL Mechanism">
                  {['SCRAM-SHA-256', 'SCRAM-SHA-512', 'PLAIN', 'GSSAPI'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Truststore Location" fullWidth size="small" value={kafkaConfig.truststoreLocation ?? ''} onChange={handleField('truststoreLocation')} placeholder="/app/certs/kafka-truststore.jks" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Truststore Password Key" fullWidth size="small" value={kafkaConfig.truststorePasswordKey ?? ''} onChange={handleField('truststorePasswordKey')} placeholder="KAFKA_TRUSTSTORE_PASSWORD" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Keystore Location" fullWidth size="small" value={kafkaConfig.keystoreLocation ?? ''} onChange={handleField('keystoreLocation')} placeholder="/app/certs/kafka-keystore.jks" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Keystore Password Key" fullWidth size="small" value={kafkaConfig.keystorePasswordKey ?? ''} onChange={handleField('keystorePasswordKey')} placeholder="KAFKA_KEYSTORE_PASSWORD" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Consumer / Producer ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ConsumerIcon />} title="Consumer & Producer Settings" desc="Consumer group, offset strategy, producer acks, advanced tuning" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Consumer</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Consumer Group ID Prefix" fullWidth size="small" value={kafkaConfig.groupIdPrefix} onChange={handleField('groupIdPrefix')} placeholder="x28" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Auto Offset Reset</InputLabel>
                <Select value={kafkaConfig.autoOffsetReset} onChange={handleField('autoOffsetReset')} label="Auto Offset Reset">
                  {['latest', 'earliest', 'none'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel control={<Switch checked={kafkaConfig.enableAutoCommit} onChange={handleSwitch('enableAutoCommit')} size="small" />} label={<Typography variant="body2">Enable Auto Commit</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Max Poll Records" fullWidth size="small" type="number" value={kafkaConfig.maxPollRecords ?? ''} onChange={handleNumericField('maxPollRecords')} placeholder="500" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Session Timeout (ms)" fullWidth size="small" type="number" value={kafkaConfig.sessionTimeoutMs ?? ''} onChange={handleNumericField('sessionTimeoutMs')} placeholder="30000" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Heartbeat Interval (ms)" fullWidth size="small" type="number" value={kafkaConfig.heartbeatIntervalMs ?? ''} onChange={handleNumericField('heartbeatIntervalMs')} placeholder="3000" />
            </Grid>
          </Grid>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Producer</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Producer Acks</InputLabel>
                <Select value={kafkaConfig.acks} onChange={handleField('acks')} label="Producer Acks">
                  {['all', '1', '0'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Compression Type</InputLabel>
                <Select value={kafkaConfig.compressionType} onChange={handleField('compressionType')} label="Compression Type">
                  {['snappy', 'gzip', 'lz4', 'zstd', 'none'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Retries" fullWidth size="small" type="number" value={kafkaConfig.retries ?? ''} onChange={handleNumericField('retries')} placeholder="2147483647" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Batch Size" fullWidth size="small" type="number" value={kafkaConfig.batchSize ?? ''} onChange={handleNumericField('batchSize')} placeholder="16384" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Linger (ms)" fullWidth size="small" type="number" value={kafkaConfig.lingerMs ?? ''} onChange={handleNumericField('lingerMs')} placeholder="5" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Buffer Memory" fullWidth size="small" type="number" value={kafkaConfig.bufferMemory ?? ''} onChange={handleNumericField('bufferMemory')} placeholder="33554432" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Topic Name Format ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<TopicFormatIcon />} title="Topic Name Format" desc={`Template: ${topicNameFormat}`} color={theme.palette.secondary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Format Template</InputLabel>
                <Select value={topicNameFormat} onChange={(e) => onTopicFormatChange(e.target.value)} label="Format Template">
                  {TOPIC_FORMAT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Paper variant="outlined" sx={{ p: 1.25, bgcolor: alpha(theme.palette.success.main, 0.04), borderColor: alpha(theme.palette.success.main, 0.3), borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Example output:{' '}
                  <strong style={{ fontFamily: 'monospace', color: theme.palette.success.dark }}>{exampleName}</strong>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Topics Table ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<TopicsIcon />} title="Topic Configuration" desc={`${kafkaTopics.length} topic${kafkaTopics.length !== 1 ? 's' : ''} defined`} color={theme.palette.info?.main || theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <TopicsTable rows={kafkaTopics} onChange={onTopicsChange} topicNameFormat={topicNameFormat} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default KafkaConfigPanel;
