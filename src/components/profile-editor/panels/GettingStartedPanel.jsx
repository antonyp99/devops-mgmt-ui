import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, alpha, useTheme,
} from '@mui/material';
import {
  TouchApp as ClickIcon,
  Settings as SettingsIcon,
  Storage as DbIcon,
  Topic as KafkaIcon,
  Speed as RedisIcon,
  Code as YamlIcon,
  Chat as MqIcon,
  Visibility as ObsIcon,
  Security as SecIcon,
  Memory as SvcIcon,
  SwapHoriz as IntegrationIcon,
} from '@mui/icons-material';

const Feature = ({ icon, title, desc, color, sectionId, onClick }) => {
  const theme = useTheme();
  const clickable = Boolean(sectionId && onClick);
  return (
    <Box
      onClick={clickable ? () => onClick(sectionId) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(sectionId); } : undefined}
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: alpha(color || theme.palette.primary.main, 0.03),
        transition: 'box-shadow 0.2s, border-color 0.2s, background-color 0.2s',
        cursor: clickable ? 'pointer' : 'default',
        ...(clickable && {
          '&:hover': {
            boxShadow: `0 4px 16px ${alpha(color || theme.palette.primary.main, 0.18)}`,
            borderColor: color || theme.palette.primary.main,
            bgcolor: alpha(color || theme.palette.primary.main, 0.07),
          },
          '&:active': {
            bgcolor: alpha(color || theme.palette.primary.main, 0.12),
          },
        }),
        ...(!clickable && {
          '&:hover': { boxShadow: `0 2px 12px ${alpha(color || theme.palette.primary.main, 0.12)}` },
        }),
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(color || theme.palette.primary.main, 0.1),
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 20, color: color || 'primary.main' }, titleAccess: title })}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={600}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{desc}</Typography>
      </Box>
      {clickable && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Typography variant="caption" color={color || 'primary.main'} fontWeight={600} sx={{ opacity: 0.7 }}>Open →</Typography>
        </Box>
      )}
    </Box>
  );
};

const GettingStartedPanel = ({ sectionName = null, message = null, onSectionSelect = null }) => {
  const theme = useTheme();

  if (sectionName && message) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Box
            sx={{
              width: 60, height: 60, borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2,
            }}
          >
            <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} titleAccess="Configuration coming soon" />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto' }}>
            {message}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            textAlign: 'center', py: 3, px: 2, mb: 3, borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`,
            border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.15),
          }}
        >
          <Box
            sx={{
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 1.5,
            }}
          >
            <ClickIcon sx={{ fontSize: 34, color: 'primary.main' }} titleAccess="Select a configuration section" />
          </Box>
          <Typography variant="h6" fontWeight={700} color="primary.dark">
            Select a Configuration Section
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Choose a section from the tree on the left to begin configuring your profile values.
            YAML is generated automatically as you make changes.
          </Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1.5 }}>
          Available Sections
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<SettingsIcon />} title="Global Configuration" desc="Image registry, env vars, tenants, microservice mapping" color={theme.palette.primary.main} sectionId="global" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<DbIcon />} title="Database" desc="PostgreSQL, MySQL, Oracle, SQL Server with connection pool & JPA" color={theme.palette.success.main} sectionId="database" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<KafkaIcon />} title="Kafka" desc="Brokers, security, topics, consumer & producer" color={theme.palette.warning.main} sectionId="kafka" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<RedisIcon />} title="Redis" desc="Cluster & standalone mode, connection pooling, cache" color={theme.palette.error.main} sectionId="redis" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<MqIcon />} title="Message Queue" desc="RabbitMQ — exchanges, queues, SSL, virtual host" color={theme.palette.info.main} sectionId="messageQueue" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<ObsIcon />} title="Observability" desc="Logging levels, tracing, metrics collection" color={theme.palette.secondary.main} sectionId="observability" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<SecIcon />} title="Security" desc="JWT, OAuth2, CORS origins and policies" color={theme.palette.error.main} sectionId="security" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<SvcIcon />} title="Microservices" desc="Per-service deployment, HPA, resources, ingress" color={theme.palette.primary.main} sectionId="microservices" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Feature icon={<IntegrationIcon />} title="Integration" desc="Timeouts, retry logic, circuit breaker" color={theme.palette.warning.main} sectionId="integration" onClick={onSectionSelect} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Feature icon={<YamlIcon />} title="Client-side YAML Generation" desc="All YAML is computed instantly in the browser — no server round-trips needed" color={theme.palette.success.main} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GettingStartedPanel;
