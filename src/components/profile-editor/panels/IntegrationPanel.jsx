import React from 'react';
import {
  Box, Typography, Grid, TextField, Accordion, AccordionSummary,
  AccordionDetails, useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Timer as TimeoutIcon,
  Replay as RetryIcon,
  FlashOff as CircuitIcon,
} from '@mui/icons-material';
import SectionHeader from '../SectionHeader';
import { accordionSx } from '../constants';

const IntegrationPanel = ({ integrationConfig, onChange }) => {
  const theme = useTheme();

  const set = (path, value) => {
    const keys = path.split('.');
    const next = { ...integrationConfig };
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
    let cur = integrationConfig;
    for (const k of keys) {
      if (cur == null) return '';
      cur = cur[k];
    }
    return cur ?? '';
  };

  const numField = (path) => ({
    value: get(path),
    onChange: (e) => set(path, e.target.value === '' ? '' : parseInt(e.target.value) || ''),
  });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Integration Configuration</Typography>
        <Typography variant="body2" color="text.secondary">External API timeouts, retry logic and circuit breaker — all fields optional</Typography>
      </Box>

      {/* ── Timeouts ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<TimeoutIcon />} title="Timeouts" desc="Connect, read and write timeouts (ms)" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Connect (ms)" fullWidth size="small" type="number" {...numField('timeouts.connect')} placeholder="5000" /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Read (ms)" fullWidth size="small" type="number" {...numField('timeouts.read')} placeholder="30000" /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Write (ms)" fullWidth size="small" type="number" {...numField('timeouts.write')} placeholder="30000" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Retry ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<RetryIcon />} title="Retry" desc="Max attempts, backoff and intervals" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Max Attempts" fullWidth size="small" type="number" {...numField('retry.maxAttempts')} placeholder="3" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Backoff Multiplier" fullWidth size="small" type="number" {...numField('retry.backoffMultiplier')} placeholder="2" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Initial Interval (ms)" fullWidth size="small" type="number" {...numField('retry.initialInterval')} placeholder="1000" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Max Interval (ms)" fullWidth size="small" type="number" {...numField('retry.maxInterval')} placeholder="10000" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Circuit Breaker ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<CircuitIcon />} title="Circuit Breaker" desc="Failure/success thresholds and timeout" color={theme.palette.error.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Failure Threshold" fullWidth size="small" type="number" {...numField('circuitBreaker.failureThreshold')} placeholder="5" /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Success Threshold" fullWidth size="small" type="number" {...numField('circuitBreaker.successThreshold')} placeholder="3" /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Timeout (ms)" fullWidth size="small" type="number" {...numField('circuitBreaker.timeout')} placeholder="60000" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default IntegrationPanel;
