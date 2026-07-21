import React, { useCallback } from 'react';
import {
  Box, Typography, Grid, TextField, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, useTheme,
  IconButton, Tooltip, Button, Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  VpnKey as JwtIcon,
  CloudCircle as OAuthIcon,
  Language as CorsIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import SectionHeader from '../SectionHeader';
import { accordionSx } from '../constants';

const SecurityPanel = ({ securityConfig, onChange }) => {
  const theme = useTheme();

  const set = (path, value) => {
    const keys = path.split('.');
    const next = { ...securityConfig };
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
    let cur = securityConfig;
    for (const k of keys) {
      if (cur == null) return '';
      cur = cur[k];
    }
    return cur ?? '';
  };

  const getBool = (path) => get(path) === true;

  /* ── CORS allowed origins list ── */
  const origins = get('cors.allowedOrigins');
  const originsList = Array.isArray(origins) ? origins : [];

  const handleAddOrigin = useCallback(() => {
    set('cors.allowedOrigins', [...originsList, '']);
  }, [originsList]);

  const handleOriginChange = useCallback((index, value) => {
    const updated = [...originsList];
    updated[index] = value;
    set('cors.allowedOrigins', updated);
  }, [originsList]);

  const handleRemoveOrigin = useCallback((index) => {
    set('cors.allowedOrigins', originsList.filter((_, i) => i !== index));
  }, [originsList]);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">Security Configuration</Typography>
        <Typography variant="body2" color="text.secondary">JWT, OAuth2 / Azure AD and CORS — all fields optional</Typography>
      </Box>

      {/* ── JWT ── */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<JwtIcon />} title="JWT" desc="Token signing, expiration and audience" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Secret Key Ref" fullWidth size="small" value={get('jwt.secretKey')} onChange={(e) => set('jwt.secretKey', e.target.value)} placeholder="JWT_SECRET" />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField label="Expiration (s)" fullWidth size="small" type="number" value={get('jwt.expiration')} onChange={(e) => set('jwt.expiration', e.target.value === '' ? '' : parseInt(e.target.value) || '')} placeholder="86400" helperText="24 h = 86400" />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField label="Refresh Expiration (s)" fullWidth size="small" type="number" value={get('jwt.refreshTokenExpiration')} onChange={(e) => set('jwt.refreshTokenExpiration', e.target.value === '' ? '' : parseInt(e.target.value) || '')} placeholder="604800" helperText="7 d = 604800" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Issuer" fullWidth size="small" value={get('jwt.issuer')} onChange={(e) => set('jwt.issuer', e.target.value)} placeholder="x28-platform" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Audience" fullWidth size="small" value={get('jwt.audience')} onChange={(e) => set('jwt.audience', e.target.value)} placeholder="x28-services" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── OAuth2 / Azure ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<OAuthIcon />} title="OAuth2 — Azure AD" desc="Client credentials and scope" color={theme.palette.secondary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Client ID Key" fullWidth size="small" value={get('oauth2.azure.clientId')} onChange={(e) => set('oauth2.azure.clientId', e.target.value)} placeholder="AZURE_CLIENT_ID" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Client Secret Key" fullWidth size="small" value={get('oauth2.azure.clientSecret')} onChange={(e) => set('oauth2.azure.clientSecret', e.target.value)} placeholder="AZURE_CLIENT_SECRET" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Tenant ID Key" fullWidth size="small" value={get('oauth2.azure.tenantId')} onChange={(e) => set('oauth2.azure.tenantId', e.target.value)} placeholder="AZURE_TENANT_ID" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Scope" fullWidth size="small" value={get('oauth2.azure.scope')} onChange={(e) => set('oauth2.azure.scope', e.target.value)} placeholder="openid,profile,email" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ── CORS ── */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<CorsIcon />} title="CORS" desc="Cross-origin resource sharing policy" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Allowed Origins</Typography>
          {originsList.map((origin, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField fullWidth size="small" value={origin} onChange={(e) => handleOriginChange(idx, e.target.value)} placeholder="https://app.x28.yourcompany.com" />
              <Tooltip title="Remove origin"><IconButton size="small" color="error" aria-label="Remove origin" onClick={() => handleRemoveOrigin(idx)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            </Box>
          ))}
          <Button size="small" startIcon={<AddIcon />} onClick={handleAddOrigin} sx={{ mb: 2 }}>Add Origin</Button>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Allowed Methods" fullWidth size="small" value={get('cors.allowedMethods')} onChange={(e) => set('cors.allowedMethods', e.target.value)} placeholder="GET,POST,PUT,DELETE,PATCH,OPTIONS" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Allowed Headers" fullWidth size="small" value={get('cors.allowedHeaders')} onChange={(e) => set('cors.allowedHeaders', e.target.value)} placeholder="*" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel control={<Switch checked={getBool('cors.allowCredentials')} onChange={(e) => set('cors.allowCredentials', e.target.checked)} size="small" />} label={<Typography variant="body2">Allow Credentials</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Max Age (s)" fullWidth size="small" type="number" value={get('cors.maxAge')} onChange={(e) => set('cors.maxAge', e.target.value === '' ? '' : parseInt(e.target.value) || '')} placeholder="3600" />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SecurityPanel;
