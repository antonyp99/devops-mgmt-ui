import React from 'react';
import {
  Box, Typography, Grid, TextField, Switch, FormControlLabel, FormControl,
  InputLabel, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Speed as MetricsIcon,
  Grain as TracingIcon,
  Description as LoggingIcon,
} from '@mui/icons-material';
import SectionHeader from '../SectionHeader';
import { accordionSx } from '../constants';

const ObservabilityPanel = ({ observabilityConfig, onChange }) => {
  const theme = useTheme();

  const set = (path, value) => {
    const keys = path.split('.');
    const next = { ...observabilityConfig };
    let cur = next;
    for (let i = 0; i < keys.length - 1; i++) {
      cur[keys[i]] = { ...cur[keys[i]] };
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    onChange(next);
  };

  const get = (path) => {
    const keys = path.split('.');
    let cur = observabilityConfig;
    for (const k of keys) {
      if (cur == null) return '';
      cur = cur[k];
    }
    return cur ?? '';
  };

  const getBool = (path) => {
    const v = get(path);
    return v === true;
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Observability Configuration</Typography>
        <Typography variant="body2" color="text.secondary">Metrics, distributed tracing and logging — all fields optional</Typography>
      </Box>

      {/* ── Metrics ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<MetricsIcon />} title="Metrics" desc="Prometheus endpoint and scrape interval" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('metrics.enabled')} onChange={(e) => set('metrics.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">Enabled</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField label="Endpoint" fullWidth size="small" value={get('metrics.endpoint')} onChange={(e) => set('metrics.endpoint', e.target.value)} placeholder="/actuator/prometheus" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Interval" fullWidth size="small" value={get('metrics.interval')} onChange={(e) => set('metrics.interval', e.target.value)} placeholder="30s" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Tracing ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<TracingIcon />} title="Tracing" desc="Jaeger / OpenTelemetry" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('tracing.enabled')} onChange={(e) => set('tracing.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">Enabled</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <TextField label="Jaeger Collector Endpoint" fullWidth size="small" value={get('tracing.jaeger.endpoint')} onChange={(e) => set('tracing.jaeger.endpoint', e.target.value)} placeholder="http://x28-jaeger-collector.observability:14268/api/traces" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sampler Type</InputLabel>
                <Select value={get('tracing.jaeger.sampler.type') || ''} onChange={(e) => set('tracing.jaeger.sampler.type', e.target.value)} label="Sampler Type">
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="probabilistic">Probabilistic</MenuItem>
                  <MenuItem value="const">Const</MenuItem>
                  <MenuItem value="ratelimiting">Rate Limiting</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Sampler Param" fullWidth size="small" value={get('tracing.jaeger.sampler.param')} onChange={(e) => { const v = e.target.value; set('tracing.jaeger.sampler.param', v === '' ? '' : parseFloat(v) || ''); }} placeholder="0.1" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Sample Rate" fullWidth size="small" value={get('tracing.sampleRate')} onChange={(e) => { const v = e.target.value; set('tracing.sampleRate', v === '' ? '' : parseFloat(v) || ''); }} placeholder="0.01" helperText="Override: 1.0 = all traces, 0.01 = 1%" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Logging ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<LoggingIcon />} title="Logging" desc="Log levels, patterns and file output" color={theme.palette.info.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Log Levels</Typography>
          <Grid container spacing={2}>
            {[
              { key: 'root', label: 'Root', ph: 'INFO' },
              { key: 'x28', label: 'x28', ph: 'DEBUG' },
              { key: 'org.springframework', label: 'org.springframework', ph: 'WARN' },
              { key: 'org.hibernate', label: 'org.hibernate', ph: 'WARN' },
            ].map(({ key, label, ph }) => (
              <Grid size={{ xs: 12, sm: 3 }} key={key}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select value={get(`logging.level.${key}`) || ''} onChange={(e) => set(`logging.level.${key}`, e.target.value)} label={label}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    {['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>Log Patterns</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Console Pattern" fullWidth size="small" value={get('logging.pattern.console')} onChange={(e) => set('logging.pattern.console', e.target.value)} placeholder="%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="File Pattern" fullWidth size="small" value={get('logging.pattern.file')} onChange={(e) => set('logging.pattern.file', e.target.value)} placeholder="%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n" />
            </Grid>
          </Grid>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>Log File Output</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('logging.file.enabled')} onChange={(e) => set('logging.file.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">File Enabled</Typography>} />
            </Grid>
            {getBool('logging.file.enabled') && (
              <>
                <Grid size={{ xs: 12, sm: 3 }}><TextField label="Path" fullWidth size="small" value={get('logging.file.path')} onChange={(e) => set('logging.file.path', e.target.value)} placeholder="/app/logs" /></Grid>
                <Grid size={{ xs: 12, sm: 3 }}><TextField label="Max Size" fullWidth size="small" value={get('logging.file.maxSize')} onChange={(e) => set('logging.file.maxSize', e.target.value)} placeholder="100MB" /></Grid>
                <Grid size={{ xs: 12, sm: 3 }}><TextField label="Max History" fullWidth size="small" type="number" value={get('logging.file.maxHistory')} onChange={(e) => set('logging.file.maxHistory', e.target.value === '' ? '' : parseInt(e.target.value) || '')} placeholder="30" /></Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ObservabilityPanel;
