import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Chip,
  Avatar, Paper, alpha, useTheme, Accordion, AccordionSummary,
  AccordionDetails, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Storage as DbIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { DB_PRESETS, accordionSx } from '../constants';
import SectionHeader from '../SectionHeader';

const DatabaseConfigPanel = ({ databaseConfig, onChange }) => {
  const theme = useTheme();
  const preset = DB_PRESETS[databaseConfig.type] || DB_PRESETS.postgresql;

  const handleField = (field) => (e) => {
    const value = field === 'port' ? parseInt(e.target.value) || '' : e.target.value;
    onChange({ ...databaseConfig, [field]: value });
  };

  const handleNumericField = (field) => (e) => {
    const raw = e.target.value;
    onChange({ ...databaseConfig, [field]: raw === '' ? '' : parseInt(raw) || '' });
  };

  const handleTypeChange = (type) => {
    const p = DB_PRESETS[type];
    onChange({ ...databaseConfig, type, port: p.defaultPort });
  };

  const jdbcUrl = preset.urlTemplate(
    databaseConfig.host || 'localhost',
    databaseConfig.port || preset.defaultPort,
    databaseConfig.dbname || 'database',
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">
          Database Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Connection settings, connection pool, JPA settings and credential references
        </Typography>
      </Box>

      {/* ── Database Type ── */}
      <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 1.5 }} elevation={0}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Database Type
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {Object.entries(DB_PRESETS).map(([key, p]) => {
              const selected = databaseConfig.type === key;
              return (
                <Grid size={{ xs: 6, sm: 3 }} key={key}>
                  <Box
                    onClick={() => handleTypeChange(key)}
                    sx={{
                      p: 1.5, borderRadius: 2, border: '2px solid',
                      borderColor: selected ? p.color : 'divider', cursor: 'pointer',
                      textAlign: 'center', bgcolor: selected ? alpha(p.color, 0.06) : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: p.color, bgcolor: alpha(p.color, 0.04) },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(p.color, 0.15), mx: 'auto', mb: 0.5 }}>
                      <DbIcon sx={{ fontSize: 18, color: p.color }} titleAccess={p.label} />
                    </Avatar>
                    <Typography variant="caption" fontWeight={selected ? 700 : 500} sx={{ color: selected ? p.color : 'text.secondary', display: 'block' }}>
                      {p.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.68rem' }}>
                      :{p.defaultPort}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Connection fields */}
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Connection Details
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField label="Hostname" fullWidth size="small" value={databaseConfig.host} onChange={handleField('host')} placeholder="database.example.com" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Port" fullWidth size="small" type="number" value={databaseConfig.port} onChange={handleField('port')} helperText={`Default: ${preset.defaultPort}`} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Database Name" fullWidth size="small" value={databaseConfig.dbname} onChange={handleField('dbname')} placeholder="mydatabase" />
            </Grid>
          </Grid>

          {/* Generated JDBC URL preview */}
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Generated JDBC URL
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.03), borderColor: alpha(theme.palette.primary.main, 0.2), borderRadius: 2 }}
          >
            <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', color: 'primary.dark', fontSize: '0.8rem' }}>
              {jdbcUrl}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip size="small" label={`Driver: ${preset.driver.split('.').pop()}`} variant="outlined" sx={{ fontSize: '0.7rem', height: 22, borderColor: alpha(preset.color, 0.4), color: preset.color }} />
            <Chip size="small" label={`Default port: ${preset.defaultPort}`} variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
          </Box>
        </CardContent>
      </Card>

      {/* ── Connection Pool (optional) ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<DbIcon />} title="Connection Pool" desc="HikariCP pool sizing and timeouts (optional)" color={theme.palette.success.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Leave fields empty to omit them from the generated YAML.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Maximum Pool Size" fullWidth size="small" type="number" value={databaseConfig.maximumPoolSize ?? ''} onChange={handleNumericField('maximumPoolSize')} placeholder="20" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Minimum Idle" fullWidth size="small" type="number" value={databaseConfig.minimumIdle ?? ''} onChange={handleNumericField('minimumIdle')} placeholder="5" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Connection Timeout (ms)" fullWidth size="small" type="number" value={databaseConfig.connectionTimeout ?? ''} onChange={handleNumericField('connectionTimeout')} placeholder="30000" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Idle Timeout (ms)" fullWidth size="small" type="number" value={databaseConfig.idleTimeout ?? ''} onChange={handleNumericField('idleTimeout')} placeholder="600000" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Max Lifetime (ms)" fullWidth size="small" type="number" value={databaseConfig.maxLifetime ?? ''} onChange={handleNumericField('maxLifetime')} placeholder="1800000" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── JPA / Hibernate (optional) ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<DbIcon />} title="JPA / Hibernate" desc="Dialect, DDL strategy, SQL logging (optional)" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Leave fields empty to omit them from the generated YAML.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Hibernate Dialect" fullWidth size="small" value={databaseConfig.hibernateDialect ?? ''} onChange={handleField('hibernateDialect')} placeholder={preset.dialect} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel shrink>DDL Auto</InputLabel>
                <Select value={databaseConfig.hibernateDdlAuto ?? ''} onChange={handleField('hibernateDdlAuto')} label="DDL Auto" displayEmpty notched>
                  <MenuItem value=""><em>Not set</em></MenuItem>
                  {['validate', 'update', 'create', 'create-drop', 'none'].map((v) => (
                    <MenuItem key={v} value={v}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel shrink>Show SQL</InputLabel>
                <Select value={databaseConfig.showSql ?? ''} onChange={handleField('showSql')} label="Show SQL" displayEmpty notched>
                  <MenuItem value=""><em>Not set</em></MenuItem>
                  <MenuItem value="true">true</MenuItem>
                  <MenuItem value="false">false</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel shrink>Format SQL</InputLabel>
                <Select value={databaseConfig.formatSql ?? ''} onChange={handleField('formatSql')} label="Format SQL" displayEmpty notched>
                  <MenuItem value=""><em>Not set</em></MenuItem>
                  <MenuItem value="true">true</MenuItem>
                  <MenuItem value="false">false</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── Credentials (optional) ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<DbIcon />} title="Credentials" desc="Secret key references for username & password (optional)" color={theme.palette.error.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Reference Kubernetes secret keys. Leave empty to omit.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Username Secret Key" fullWidth size="small" value={databaseConfig.usernameKey ?? ''} onChange={handleField('usernameKey')} placeholder="DB_USERNAME" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Password Secret Key" fullWidth size="small" value={databaseConfig.passwordKey ?? ''} onChange={handleField('passwordKey')} placeholder="DB_PASSWORD" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DatabaseConfigPanel;
