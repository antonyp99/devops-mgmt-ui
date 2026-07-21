import React from 'react';
import {
  Box, Typography, Grid, TextField, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, useTheme,
  IconButton, Tooltip, Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Speed as ClusterIcon,
  DnsRounded as StandaloneIcon,
  PoolRounded as PoolIcon,
  Cached as CacheIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import SectionHeader from '../SectionHeader';
import { accordionSx } from '../constants';

const RedisConfigPanel = ({ redisConfig, onChange }) => {
  const theme = useTheme();

  const handleField = (field) => (e) => {
    const numericFields = ['standalonePort', 'connectionTimeout', 'maxActive', 'maxIdle', 'minIdle', 'database', 'maxWait', 'timeToLive', 'defaultExpiration'];
    const val = numericFields.includes(field)
      ? (e.target.value === '' ? '' : parseInt(e.target.value) || '')
      : e.target.value;
    onChange({ ...redisConfig, [field]: val });
  };

  const handleSwitch = (field) => (e) =>
    onChange({ ...redisConfig, [field]: e.target.checked });

  const handleNodeChange = (index, value) => {
    const nodes = [...redisConfig.clusterNodes];
    nodes[index] = value;
    onChange({ ...redisConfig, clusterNodes: nodes });
  };

  const handleAddNode = () => {
    onChange({ ...redisConfig, clusterNodes: [...redisConfig.clusterNodes, ''] });
  };

  const handleRemoveNode = (index) => {
    onChange({
      ...redisConfig,
      clusterNodes: redisConfig.clusterNodes.filter((_, i) => i !== index),
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Redis Configuration</Typography>
        <Typography variant="body2" color="text.secondary">Caching and session store — cluster, standalone, pool, cache settings</Typography>
      </Box>

      {/* ── Cluster Config ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ClusterIcon />} title="Cluster Configuration" desc={`${redisConfig.clusterEnabled ? 'Enabled' : 'Disabled'} · ${redisConfig.clusterNodes.length} node(s)`} color={theme.palette.error.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <FormControlLabel
            control={<Switch checked={redisConfig.clusterEnabled} onChange={handleSwitch('clusterEnabled')} color="primary" />}
            label={<Typography variant="body2" fontWeight={600}>Enable Redis Cluster Mode</Typography>}
            sx={{ mb: 2 }}
          />
          {redisConfig.clusterEnabled && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">Cluster Nodes</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddNode}>Add Node</Button>
              </Box>
              {redisConfig.clusterNodes.map((node, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <TextField fullWidth size="small" value={node} onChange={(e) => handleNodeChange(i, e.target.value)} placeholder="redis-node-0.redis:6379" slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.8125rem' } } }} />
                  <Tooltip title="Remove node">
                    <span>
                      <IconButton size="small" color="error" aria-label="Remove node" onClick={() => handleRemoveNode(i)} disabled={redisConfig.clusterNodes.length <= 1}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* ── Standalone Config ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<StandaloneIcon />} title="Standalone Configuration" desc="Single node host and port (fallback)" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField label="Host" fullWidth size="small" value={redisConfig.standaloneHost} onChange={handleField('standaloneHost')} placeholder="redis.example.com" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Port" fullWidth size="small" type="number" value={redisConfig.standalonePort} onChange={handleField('standalonePort')} helperText="Default: 6379" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Connection Pool ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<PoolIcon />} title="Connection Pool & Timeouts" desc="Pool sizing, timeout, database index and SSL" color={theme.palette.success.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Max Active" fullWidth size="small" type="number" value={redisConfig.maxActive} onChange={handleField('maxActive')} helperText="Max active connections" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Max Idle" fullWidth size="small" type="number" value={redisConfig.maxIdle} onChange={handleField('maxIdle')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Min Idle" fullWidth size="small" type="number" value={redisConfig.minIdle} onChange={handleField('minIdle')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Max Wait (ms)" fullWidth size="small" type="number" value={redisConfig.maxWait ?? ''} onChange={handleField('maxWait')} placeholder="3000" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Connection Timeout (ms)" fullWidth size="small" type="number" value={redisConfig.connectionTimeout} onChange={handleField('connectionTimeout')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Database Index" fullWidth size="small" type="number" value={redisConfig.database} onChange={handleField('database')} helperText="Redis DB number (0–15)" />
            </Grid>
          </Grid>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>Security</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Password Secret Key" fullWidth size="small" value={redisConfig.passwordKey ?? ''} onChange={handleField('passwordKey')} placeholder="REDIS_PASSWORD" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel control={<Switch checked={redisConfig.sslEnabled} onChange={handleSwitch('sslEnabled')} size="small" />} label={<Typography variant="body2">SSL Enabled</Typography>} />
            </Grid>
            {redisConfig.sslEnabled && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Trust Store Path" fullWidth size="small" value={redisConfig.trustStore ?? ''} onChange={handleField('trustStore')} placeholder="/app/certs/redis-truststore.jks" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Trust Store Password Key" fullWidth size="small" value={redisConfig.trustStorePasswordKey ?? ''} onChange={handleField('trustStorePasswordKey')} placeholder="REDIS_TRUSTSTORE_PASSWORD" />
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Cache Config (optional) ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<CacheIcon />} title="Cache Configuration" desc="TTL, key prefix, default expiration (optional)" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Leave fields empty to omit them from the generated YAML.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Time To Live (seconds)" fullWidth size="small" type="number" value={redisConfig.timeToLive ?? ''} onChange={handleField('timeToLive')} placeholder="3600" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Key Prefix" fullWidth size="small" value={redisConfig.keyPrefix ?? ''} onChange={handleField('keyPrefix')} placeholder="x28" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Default Expiration (seconds)" fullWidth size="small" type="number" value={redisConfig.defaultExpiration ?? ''} onChange={handleField('defaultExpiration')} placeholder="1800" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RedisConfigPanel;
