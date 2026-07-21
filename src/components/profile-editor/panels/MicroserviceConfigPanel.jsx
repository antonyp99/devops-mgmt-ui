import React from 'react';
import {
  Box, Typography, Grid, TextField, Switch, FormControlLabel, FormControl,
  InputLabel, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Apps as AppIcon,
  Image as ImageIcon,
  CloudQueue as DeployIcon,
  Dns as ServiceIcon,
  Language as IngressIcon,
  Memory as ResourceIcon,
  TrendingUp as HpaIcon,
  Storage as PvcIcon,
} from '@mui/icons-material';
import SectionHeader from '../SectionHeader';
import { accordionSx, MICROSERVICE_OPTIONS } from '../constants';

/* ── Empty service config template ── */
export const emptyServiceConfig = () => ({
  microserviceEnabled: true,
  app: { name: '', component: '' },
  image: { repository: '', tag: '', pullPolicy: '' },
  deployment: { replicaCount: '' },
  service: { enabled: false, type: '', port: '', targetPort: '' },
  ingress: {
    enabled: false, className: '', host: '', path: '', pathType: '',
    tlsSecretName: '', annotations: '',
  },
  resources: {
    limits: { cpu: '', memory: '' },
    requests: { cpu: '', memory: '' },
  },
  hpa: { enabled: false, minReplicas: '', maxReplicas: '', targetCPUUtilizationPercentage: '' },
  pvc: { enabled: false, accessMode: '', size: '' },
});

/* ── Single service editor (all accordion sections) ── */
const ServiceEditor = ({ serviceId, config, onChange }) => {
  const theme = useTheme();

  const set = (path, value) => {
    const keys = path.split('.');
    const next = { ...config };
    let cur = next;
    for (let i = 0; i < keys.length - 1; i++) {
      cur[keys[i]] = { ...(cur[keys[i]] || {}) };
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    onChange(serviceId, next);
  };

  const get = (path) => {
    const keys = path.split('.');
    let cur = config;
    for (const k of keys) {
      if (cur == null) return '';
      cur = cur[k];
    }
    return cur ?? '';
  };

  const getBool = (path) => get(path) === true;

  const numChange = (path) => (e) => set(path, e.target.value === '' ? '' : parseInt(e.target.value) || '');

  return (
    <Box>
      {/* App */}
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<AppIcon />} title="Application" desc="Service name and component role" color={theme.palette.primary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Name" fullWidth size="small" value={get('app.name')} onChange={(e) => set('app.name', e.target.value)} placeholder={serviceId} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Component" fullWidth size="small" value={get('app.component')} onChange={(e) => set('app.component', e.target.value)} placeholder="api-gateway" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Image */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ImageIcon />} title="Image" desc="Container repository, tag and pull policy" color={theme.palette.secondary.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}><TextField label="Repository" fullWidth size="small" value={get('image.repository')} onChange={(e) => set('image.repository', e.target.value)} placeholder={`x28/${serviceId}`} /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Tag" fullWidth size="small" value={get('image.tag')} onChange={(e) => set('image.tag', e.target.value)} placeholder="1.0.0" /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Pull Policy</InputLabel>
                <Select value={get('image.pullPolicy') || ''} onChange={(e) => set('image.pullPolicy', e.target.value)} label="Pull Policy">
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="IfNotPresent">IfNotPresent</MenuItem>
                  <MenuItem value="Always">Always</MenuItem>
                  <MenuItem value="Never">Never</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Deployment */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<DeployIcon />} title="Deployment" desc="Replica count" color={theme.palette.info.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Replica Count" fullWidth size="small" type="number" value={get('deployment.replicaCount')} onChange={numChange('deployment.replicaCount')} placeholder="3" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Service */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ServiceIcon />} title="Service" desc="Kubernetes service type and ports" color={theme.palette.success.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('service.enabled')} onChange={(e) => set('service.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">Enabled</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={get('service.type') || ''} onChange={(e) => set('service.type', e.target.value)} label="Type">
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="ClusterIP">ClusterIP</MenuItem>
                  <MenuItem value="NodePort">NodePort</MenuItem>
                  <MenuItem value="LoadBalancer">LoadBalancer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Port" fullWidth size="small" type="number" value={get('service.port')} onChange={numChange('service.port')} placeholder="80" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Target Port" fullWidth size="small" type="number" value={get('service.targetPort')} onChange={numChange('service.targetPort')} placeholder="8080" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Ingress */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<IngressIcon />} title="Ingress" desc="Hostname, TLS and annotations" color={theme.palette.warning.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('ingress.enabled')} onChange={(e) => set('ingress.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">Enabled</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Class" fullWidth size="small" value={get('ingress.className')} onChange={(e) => set('ingress.className', e.target.value)} placeholder="nginx" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Host" fullWidth size="small" value={get('ingress.host')} onChange={(e) => set('ingress.host', e.target.value)} placeholder={`api.x28.yourcompany.com`} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Path" fullWidth size="small" value={get('ingress.path')} onChange={(e) => set('ingress.path', e.target.value)} placeholder="/" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Path Type</InputLabel>
                <Select value={get('ingress.pathType') || ''} onChange={(e) => set('ingress.pathType', e.target.value)} label="Path Type">
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Prefix">Prefix</MenuItem>
                  <MenuItem value="Exact">Exact</MenuItem>
                  <MenuItem value="ImplementationSpecific">ImplementationSpecific</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="TLS Secret Name" fullWidth size="small" value={get('ingress.tlsSecretName')} onChange={(e) => set('ingress.tlsSecretName', e.target.value)} placeholder={`${serviceId}-tls`} /></Grid>
            <Grid size={{ xs: 12 }}><TextField label="Annotations (JSON)" fullWidth size="small" multiline minRows={2} value={get('ingress.annotations')} onChange={(e) => set('ingress.annotations', e.target.value)} placeholder='{"nginx.ingress.kubernetes.io/rewrite-target": "/"}' /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Resources */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<ResourceIcon />} title="Resources" desc="CPU & memory limits and requests" color={theme.palette.error.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Limits</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="CPU" fullWidth size="small" value={get('resources.limits.cpu')} onChange={(e) => set('resources.limits.cpu', e.target.value)} placeholder="1000m" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Memory" fullWidth size="small" value={get('resources.limits.memory')} onChange={(e) => set('resources.limits.memory', e.target.value)} placeholder="1536Mi" /></Grid>
          </Grid>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>Requests</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="CPU" fullWidth size="small" value={get('resources.requests.cpu')} onChange={(e) => set('resources.requests.cpu', e.target.value)} placeholder="500m" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Memory" fullWidth size="small" value={get('resources.requests.memory')} onChange={(e) => set('resources.requests.memory', e.target.value)} placeholder="768Mi" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* HPA */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<HpaIcon />} title="Horizontal Pod Autoscaler" desc="Auto-scaling thresholds" color={theme.palette.info.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('hpa.enabled')} onChange={(e) => set('hpa.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">Enabled</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Min Replicas" fullWidth size="small" type="number" value={get('hpa.minReplicas')} onChange={numChange('hpa.minReplicas')} placeholder="3" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Max Replicas" fullWidth size="small" type="number" value={get('hpa.maxReplicas')} onChange={numChange('hpa.maxReplicas')} placeholder="15" /></Grid>
            <Grid size={{ xs: 12, sm: 3 }}><TextField label="Target CPU %" fullWidth size="small" type="number" value={get('hpa.targetCPUUtilizationPercentage')} onChange={numChange('hpa.targetCPUUtilizationPercentage')} placeholder="70" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* PVC */}
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader icon={<PvcIcon />} title="Persistent Volume Claim" desc="Storage access mode and size" color={theme.palette.success.main} />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel control={<Switch checked={getBool('pvc.enabled')} onChange={(e) => set('pvc.enabled', e.target.checked)} size="small" />} label={<Typography variant="body2">Enabled</Typography>} />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Access Mode</InputLabel>
                <Select value={get('pvc.accessMode') || ''} onChange={(e) => set('pvc.accessMode', e.target.value)} label="Access Mode">
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="ReadWriteOnce">ReadWriteOnce</MenuItem>
                  <MenuItem value="ReadOnlyMany">ReadOnlyMany</MenuItem>
                  <MenuItem value="ReadWriteMany">ReadWriteMany</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField label="Size" fullWidth size="small" value={get('pvc.size')} onChange={(e) => set('pvc.size', e.target.value)} placeholder="10Gi" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

/* ── Main Panel with tab per microservice ── */
const MicroserviceConfigPanel = ({ serviceId, serviceConfigs, onServiceConfigChange }) => {
  const theme = useTheme();
  const svcMeta = MICROSERVICE_OPTIONS.find((m) => m.value === serviceId);
  const label = svcMeta?.label || serviceId;

  const config = serviceConfigs[serviceId] || emptyServiceConfig();

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary.dark">{label} Configuration</Typography>
          <Typography variant="body2" color="text.secondary">
            Deployment, service, ingress, resources and scaling — leave fields empty to omit from YAML
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={config.microserviceEnabled !== false}
              onChange={(e) => onServiceConfigChange(serviceId, { ...config, microserviceEnabled: e.target.checked })}
              color="primary"
            />
          }
          label={<Typography variant="body2" fontWeight={600}>Enabled</Typography>}
          labelPlacement="start"
        />
      </Box>
      <ServiceEditor serviceId={serviceId} config={config} onChange={onServiceConfigChange} />
    </Box>
  );
};

export default MicroserviceConfigPanel;
