import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Tooltip, Chip, alpha, useTheme,
  Tabs, Tab, Paper, Collapse, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Code as CodeIcon,
  CodeOff as CodeOffIcon,
  SettingsApplications as ProfileIcon,
  Home as HomeIcon,
  Settings as SettingsTabIcon,
  Storage as StorageIcon,
  Topic as TopicIcon,
  Speed as SpeedIcon,
  Chat as ChatIcon,
  Visibility as VisibilityIcon,
  Security as SecurityTabIcon,
  SwapHoriz as SwapHorizIcon,
  Memory as MemoryIcon,
  ExpandMore as ExpandMoreIcon,
  BarChart as ProfileSummaryIcon,
} from '@mui/icons-material';
import { dump as yamlDump } from 'js-yaml';

import ProfileSelectorBar from '../components/profile-editor/ProfileSelectorBar';
import YamlPreviewDrawer from '../components/profile-editor/YamlPreviewDrawer';
import GettingStartedPanel from '../components/profile-editor/panels/GettingStartedPanel';
import GlobalConfigPanel from '../components/profile-editor/panels/GlobalConfigPanel';
import DatabaseConfigPanel from '../components/profile-editor/panels/DatabaseConfigPanel';
import KafkaConfigPanel from '../components/profile-editor/panels/KafkaConfigPanel';
import RedisConfigPanel from '../components/profile-editor/panels/RedisConfigPanel';
import MessageQueuePanel from '../components/profile-editor/panels/MessageQueuePanel';
import ObservabilityPanel from '../components/profile-editor/panels/ObservabilityPanel';
import SecurityPanel from '../components/profile-editor/panels/SecurityPanel';
import IntegrationPanel from '../components/profile-editor/panels/IntegrationPanel';
import MicroserviceConfigPanel from '../components/profile-editor/panels/MicroserviceConfigPanel';
import { emptyServiceConfig } from '../components/profile-editor/panels/MicroserviceConfigPanel';

import { useAlertCenter } from '../contexts/AlertCenter';
import { loadTenantsFromStorage } from '../services/tenantStorage';
import { PROFILE_CHARTS, MICROSERVICE_OPTIONS, stripEmpty } from '../components/profile-editor/constants';

/* Boolean helper — keeps true/false (never || undefined, which drops false) */
const boolVal = (v) => (typeof v === 'boolean' ? v : undefined);

/* ─── Section tab definitions ─── */
const MAIN_TABS = [
  { id: 'overview',      label: 'Overview',       Icon: HomeIcon,         title: 'Overview — All configuration sections at a glance' },
  { id: 'global',        label: 'Global Config',  Icon: SettingsTabIcon,  title: 'Global Configuration — Image registry, storage class, env vars, tenants' },
  { id: 'database',      label: 'Database',       Icon: StorageIcon,      title: 'Database — Connection pool, JPA settings, credentials' },
  { id: 'kafka',         label: 'Kafka',          Icon: TopicIcon,        title: 'Kafka — Brokers, SASL/SSL security, topics, consumer & producer' },
  { id: 'redis',         label: 'Redis',          Icon: SpeedIcon,        title: 'Redis — Cluster/standalone mode, pool, cache & SSL settings' },
  { id: 'messageQueue',  label: 'Message Queue',  Icon: ChatIcon,         title: 'Message Queue — RabbitMQ host, exchanges, queues, SSL, virtual host' },
  { id: 'observability', label: 'Observability',  Icon: VisibilityIcon,   title: 'Observability — Metrics, Jaeger tracing, logging levels & file output' },
  { id: 'security',      label: 'Security',       Icon: SecurityTabIcon,  title: 'Security — JWT tokens, OAuth2 / Azure AD, CORS policies' },
  { id: 'integration',   label: 'Integration',    Icon: SwapHorizIcon,    title: 'Integration — HTTP timeouts, retry logic, circuit breaker settings' },
  { id: 'microservices', label: 'Microservices',  Icon: MemoryIcon,       title: 'Microservices — Per-service deployment, HPA, resources, ingress & PVC' },
];

/* ─── ProfileEditor page ─── */
const ProfileEditor = () => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();

  // ── Profile (chart) selection ──
  const [selectedProfile, setSelectedProfile] = useState('x28-product-suite');
  const [selectedEnvironment, setSelectedEnvironment] = useState('values.yaml');

  // ── Navigation ──
  const [selectedSection, setSelectedSection] = useState('overview');
  const [selectedMicroservice, setSelectedMicroservice] = useState('xconnect');

  // ── Global config ──
  const [globalSettings, setGlobalSettings] = useState({
    imageRegistry: '',
    environment: 'prod',
    storageClass: '',
    namespacePrefix: true,
    imagePullSecretName: '',
  });
  const [globalEnvVars, setGlobalEnvVars] = useState([]);
  const [tenants, setTenants] = useState(() => loadTenantsFromStorage());
  const [tenantMicroserviceMapping, setTenantMicroserviceMapping] = useState([]);

  // ── Database config ──
  const [databaseConfig, setDatabaseConfig] = useState({
    type: 'postgresql', host: '', port: 5432, dbname: '',
    // connectionPool (optional)
    maximumPoolSize: '', minimumIdle: '', connectionTimeout: '', idleTimeout: '', maxLifetime: '',
    // jpa (optional)
    hibernateDialect: '', hibernateDdlAuto: '', showSql: '', formatSql: '',
    // credentials (optional)
    usernameKey: '', passwordKey: '',
  });

  // ── Kafka config ──
  const [kafkaConfig, setKafkaConfig] = useState({
    bootstrapServers: '', internalEndpoint: '', externalEndpoint: '',
    protocol: 'SASL_SSL', mechanism: 'SCRAM-SHA-256',
    // security truststore/keystore (optional)
    truststoreLocation: '', truststorePasswordKey: '', keystoreLocation: '', keystorePasswordKey: '',
    // consumer
    groupIdPrefix: '', autoOffsetReset: 'latest', enableAutoCommit: false,
    maxPollRecords: '', sessionTimeoutMs: '', heartbeatIntervalMs: '',
    // producer
    acks: 'all', retries: '', batchSize: '', lingerMs: '', bufferMemory: '',
    compressionType: 'snappy',
  });
  const [kafkaTopics, setKafkaTopics] = useState([]);
  const [topicNameFormat, setTopicNameFormat] = useState('{tenantid}.{topicName}');

  // ── Redis config ──
  const [redisConfig, setRedisConfig] = useState({
    clusterEnabled: false, clusterNodes: [], standaloneHost: '', standalonePort: 6379,
    connectionTimeout: '', maxActive: '', maxIdle: '', minIdle: '', database: 0, maxWait: '',
    passwordKey: '', sslEnabled: false, trustStore: '', trustStorePasswordKey: '',
    // cache (optional)
    timeToLive: '', keyPrefix: '', defaultExpiration: '',
  });

  // ── Message Queue (RabbitMQ) ──
  const [mqConfig, setMqConfig] = useState({
    host: '', port: '', managementHost: '', managementPort: '', virtualHost: '',
    heartbeat: '', connectionTimeout: '', handshakeTimeout: '', shutdownTimeout: '',
    usernameKey: '', passwordKey: '', sslEnabled: false, trustStore: '', trustStorePasswordKey: '',
    exchanges: [], queues: [],
  });

  // ── Observability ──
  const [observabilityConfig, setObservabilityConfig] = useState({
    metrics: { enabled: false, endpoint: '', interval: '' },
    tracing: { enabled: false, sampleRate: '', jaeger: { endpoint: '', sampler: { type: '', param: '' } } },
    logging: {
      level: { root: '', x28: '', 'org.springframework': '', 'org.hibernate': '' },
      pattern: { console: '', file: '' },
      file: { enabled: false, path: '', maxSize: '', maxHistory: '' },
    },
  });

  // ── Security ──
  const [securityConfig, setSecurityConfig] = useState({
    jwt: { secretKey: '', expiration: '', refreshTokenExpiration: '', issuer: '', audience: '' },
    oauth2: { azure: { clientId: '', clientSecret: '', tenantId: '', scope: '' } },
    cors: { allowedOrigins: [], allowedMethods: '', allowedHeaders: '', allowCredentials: false, maxAge: '' },
  });

  // ── Integration ──
  const [integrationConfig, setIntegrationConfig] = useState({
    timeouts: { connect: '', read: '', write: '' },
    retry: { maxAttempts: '', backoffMultiplier: '', initialInterval: '', maxInterval: '' },
    circuitBreaker: { failureThreshold: '', successThreshold: '', timeout: '' },
  });

  // ── Per-microservice configs ──
  const [serviceConfigs, setServiceConfigs] = useState(() => {
    const initial = {};
    MICROSERVICE_OPTIONS.forEach((m) => { initial[m.value] = emptyServiceConfig(); });
    return initial;
  });

  const handleServiceConfigChange = (serviceId, config) => {
    setServiceConfigs((prev) => ({ ...prev, [serviceId]: config }));
  };

  // Handles card clicks in GettingStartedPanel — microservice IDs map to sub-tab
  const handleSectionSelect = (id) => {
    if (MICROSERVICE_OPTIONS.some((m) => m.value === id)) {
      setSelectedSection('microservices');
      setSelectedMicroservice(id);
    } else {
      setSelectedSection(id);
    }
  };

  // ── YAML state ──
  const [generatedYaml, setGeneratedYaml] = useState('');
  const [showYamlDrawer, setShowYamlDrawer] = useState(false);

  // ── Scroll detection — shrinks the sticky header when user scrolls down ──
  const [scrolled, setScrolled] = useState(false);
  // ── Profile Configuration accordion ──
  // Open by default. Auto-collapses on scroll down & auto-expands on scroll up
  // UNLESS the user has manually toggled it — then their choice is respected.
  const [profileOpen, setProfileOpen] = useState(true);
  const profileUserControlled = useRef(false);

  const handleProfileAccordionChange = (_, expanded) => {
    profileUserControlled.current = true;   // user took control
    setProfileOpen(expanded);
  };

  useEffect(() => {
    // Use hysteresis thresholds to prevent scroll-triggered layout shifts
    // from causing a feedback loop (shaking). Collapse at >120px, expand at <40px.
    // The dead zone between 40-120px keeps state stable while the header animates.
    const SCROLL_DOWN_THRESHOLD = 120;
    const SCROLL_UP_THRESHOLD   = 40;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > SCROLL_DOWN_THRESHOLD && !scrolled) {
        setScrolled(true);
        if (!profileUserControlled.current) setProfileOpen(false);
      } else if (y < SCROLL_UP_THRESHOLD && scrolled) {
        setScrolled(false);
        if (!profileUserControlled.current) setProfileOpen(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);

  // ── Rebuild YAML whenever any state changes ──
  useEffect(() => {
    try {
      /* ── Build raw config matching reference YAML structure ── */
      const rawConfig = {
        global: {
          imageRegistry: globalSettings.imageRegistry,
          imagePullSecrets: [{ name: globalSettings.imagePullSecretName || undefined }],
          storageClass: globalSettings.storageClass,
          environment: globalSettings.environment,
          namespacePrefix: { enabled: globalSettings.namespacePrefix },
        },

        commonConfigurations: {
          database: {
            host: databaseConfig.host,
            port: databaseConfig.port || undefined,
            connectionPool: {
              maximumPoolSize: databaseConfig.maximumPoolSize || undefined,
              minimumIdle: databaseConfig.minimumIdle || undefined,
              connectionTimeout: databaseConfig.connectionTimeout || undefined,
              idleTimeout: databaseConfig.idleTimeout || undefined,
              maxLifetime: databaseConfig.maxLifetime || undefined,
            },
            jpa: {
              hibernateDialect: databaseConfig.hibernateDialect || undefined,
              hibernateDdlAuto: databaseConfig.hibernateDdlAuto || undefined,
              showSql: databaseConfig.showSql === 'true' ? true : databaseConfig.showSql === 'false' ? false : undefined,
              formatSql: databaseConfig.formatSql === 'true' ? true : databaseConfig.formatSql === 'false' ? false : undefined,
            },
            credentials: {
              usernameKey: databaseConfig.usernameKey || undefined,
              passwordKey: databaseConfig.passwordKey || undefined,
            },
          },
          kafka: {
            brokers: {
              bootstrap: kafkaConfig.bootstrapServers || undefined,
              internal: kafkaConfig.internalEndpoint || undefined,
              external: kafkaConfig.externalEndpoint || undefined,
            },
            security: {
              protocol: kafkaConfig.protocol || undefined,
              mechanism: kafkaConfig.mechanism || undefined,
              truststore: {
                location: kafkaConfig.truststoreLocation || undefined,
                passwordKey: kafkaConfig.truststorePasswordKey || undefined,
              },
              keystore: {
                location: kafkaConfig.keystoreLocation || undefined,
                passwordKey: kafkaConfig.keystorePasswordKey || undefined,
              },
            },
            consumer: {
              groupIdPrefix: kafkaConfig.groupIdPrefix || undefined,
              autoOffsetReset: kafkaConfig.autoOffsetReset || undefined,
              enableAutoCommit: boolVal(kafkaConfig.enableAutoCommit),
              maxPollRecords: kafkaConfig.maxPollRecords || undefined,
              sessionTimeoutMs: kafkaConfig.sessionTimeoutMs || undefined,
              heartbeatIntervalMs: kafkaConfig.heartbeatIntervalMs || undefined,
            },
            producer: {
              acks: kafkaConfig.acks || undefined,
              retries: kafkaConfig.retries || undefined,
              batchSize: kafkaConfig.batchSize || undefined,
              lingerMs: kafkaConfig.lingerMs || undefined,
              bufferMemory: kafkaConfig.bufferMemory || undefined,
              compressionType: kafkaConfig.compressionType || undefined,
            },
            topics: kafkaTopics.reduce((acc, t) => {
              if (t.referenceId?.trim()) acc[t.referenceId.trim()] = t.topicName || undefined;
              return acc;
            }, {}),
          },
          redis: {
            cluster: {
              enabled: boolVal(redisConfig.clusterEnabled),
              nodes: redisConfig.clusterNodes?.filter((n) => n.trim()) || undefined,
            },
            standalone: {
              host: redisConfig.standaloneHost || undefined,
              port: redisConfig.standalonePort || undefined,
            },
            connection: {
              timeout: redisConfig.connectionTimeout || undefined,
              database: typeof redisConfig.database === 'number' ? redisConfig.database : undefined,
              maxActive: redisConfig.maxActive || undefined,
              maxIdle: redisConfig.maxIdle || undefined,
              minIdle: redisConfig.minIdle || undefined,
              maxWait: redisConfig.maxWait || undefined,
            },
            security: {
              passwordKey: redisConfig.passwordKey || undefined,
              ssl: {
                enabled: boolVal(redisConfig.sslEnabled),
                trustStore: redisConfig.sslEnabled ? (redisConfig.trustStore || undefined) : undefined,
                trustStorePasswordKey: redisConfig.sslEnabled ? (redisConfig.trustStorePasswordKey || undefined) : undefined,
              },
            },
            cache: {
              timeToLive: redisConfig.timeToLive || undefined,
              keyPrefix: redisConfig.keyPrefix || undefined,
              defaultExpiration: redisConfig.defaultExpiration || undefined,
            },
          },
          messageQueue: {
            host: mqConfig.host || undefined,
            port: mqConfig.port || undefined,
            management: {
              host: mqConfig.managementHost || undefined,
              port: mqConfig.managementPort || undefined,
            },
            virtualHost: mqConfig.virtualHost || undefined,
            connection: {
              heartbeat: mqConfig.heartbeat || undefined,
              connectionTimeout: mqConfig.connectionTimeout || undefined,
              handshakeTimeout: mqConfig.handshakeTimeout || undefined,
              shutdownTimeout: mqConfig.shutdownTimeout || undefined,
            },
            credentials: {
              usernameKey: mqConfig.usernameKey || undefined,
              passwordKey: mqConfig.passwordKey || undefined,
            },
            ssl: {
              enabled: boolVal(mqConfig.sslEnabled),
              trustStore: mqConfig.sslEnabled ? (mqConfig.trustStore || undefined) : undefined,
              trustStorePasswordKey: mqConfig.sslEnabled ? (mqConfig.trustStorePasswordKey || undefined) : undefined,
            },
            exchanges: (mqConfig.exchanges || []).reduce((acc, e) => {
              if (e.key?.trim()) acc[e.key.trim()] = e.value;
              return acc;
            }, {}),
            queues: (mqConfig.queues || []).reduce((acc, q) => {
              if (q.key?.trim()) acc[q.key.trim()] = q.value;
              return acc;
            }, {}),
          },
          observability: {
            metrics: {
              enabled: boolVal(observabilityConfig.metrics?.enabled),
              endpoint: observabilityConfig.metrics?.endpoint || undefined,
              interval: observabilityConfig.metrics?.interval || undefined,
            },
            tracing: {
              enabled: boolVal(observabilityConfig.tracing?.enabled),
              sampleRate: observabilityConfig.tracing?.sampleRate || undefined,
              jaeger: {
                endpoint: observabilityConfig.tracing?.jaeger?.endpoint || undefined,
                sampler: {
                  type: observabilityConfig.tracing?.jaeger?.sampler?.type || undefined,
                  param: observabilityConfig.tracing?.jaeger?.sampler?.param || undefined,
                },
              },
            },
            logging: {
              level: {
                root: observabilityConfig.logging?.level?.root || undefined,
                x28: observabilityConfig.logging?.level?.x28 || undefined,
                'org.springframework': observabilityConfig.logging?.level?.['org.springframework'] || undefined,
                'org.hibernate': observabilityConfig.logging?.level?.['org.hibernate'] || undefined,
              },
              pattern: {
                console: observabilityConfig.logging?.pattern?.console || undefined,
                file: observabilityConfig.logging?.pattern?.file || undefined,
              },
              file: {
                enabled: boolVal(observabilityConfig.logging?.file?.enabled),
                path: observabilityConfig.logging?.file?.path || undefined,
                maxSize: observabilityConfig.logging?.file?.maxSize || undefined,
                maxHistory: observabilityConfig.logging?.file?.maxHistory || undefined,
              },
            },
          },
          security: {
            jwt: {
              secretKey: securityConfig.jwt?.secretKey || undefined,
              expiration: securityConfig.jwt?.expiration || undefined,
              refreshTokenExpiration: securityConfig.jwt?.refreshTokenExpiration || undefined,
              issuer: securityConfig.jwt?.issuer || undefined,
              audience: securityConfig.jwt?.audience || undefined,
            },
            oauth2: {
              azure: {
                clientId: securityConfig.oauth2?.azure?.clientId || undefined,
                clientSecret: securityConfig.oauth2?.azure?.clientSecret || undefined,
                tenantId: securityConfig.oauth2?.azure?.tenantId || undefined,
                scope: securityConfig.oauth2?.azure?.scope || undefined,
              },
            },
            cors: {
              allowedOrigins: securityConfig.cors?.allowedOrigins?.filter((o) => o.trim()) || undefined,
              allowedMethods: securityConfig.cors?.allowedMethods || undefined,
              allowedHeaders: securityConfig.cors?.allowedHeaders || undefined,
              allowCredentials: boolVal(securityConfig.cors?.allowCredentials),
              maxAge: securityConfig.cors?.maxAge || undefined,
            },
          },
          integration: {
            timeouts: {
              connect: integrationConfig.timeouts?.connect || undefined,
              read: integrationConfig.timeouts?.read || undefined,
              write: integrationConfig.timeouts?.write || undefined,
            },
            retry: {
              maxAttempts: integrationConfig.retry?.maxAttempts || undefined,
              backoffMultiplier: integrationConfig.retry?.backoffMultiplier || undefined,
              initialInterval: integrationConfig.retry?.initialInterval || undefined,
              maxInterval: integrationConfig.retry?.maxInterval || undefined,
            },
            circuitBreaker: {
              failureThreshold: integrationConfig.circuitBreaker?.failureThreshold || undefined,
              successThreshold: integrationConfig.circuitBreaker?.successThreshold || undefined,
              timeout: integrationConfig.circuitBreaker?.timeout || undefined,
            },
          },
        },

        // Microservices enabled flags
        microservices: MICROSERVICE_OPTIONS.reduce((acc, m) => {
          const cfg = serviceConfigs[m.value];
          acc[m.value] = { enabled: cfg?.microserviceEnabled !== false };
          return acc;
        }, {}),
      };

      // Per-microservice top-level keys
      MICROSERVICE_OPTIONS.forEach((m) => {
        const cfg = serviceConfigs[m.value];
        if (!cfg) return;

        const svc = {
          app: {
            name: cfg.app?.name || undefined,
            component: cfg.app?.component || undefined,
          },
          image: {
            repository: cfg.image?.repository || undefined,
            tag: cfg.image?.tag || undefined,
            pullPolicy: cfg.image?.pullPolicy || undefined,
          },
          deployment: {
            replicaCount: cfg.deployment?.replicaCount || undefined,
          },
          service: {
            enabled: boolVal(cfg.service?.enabled),
            type: cfg.service?.type || undefined,
            port: cfg.service?.port || undefined,
            targetPort: cfg.service?.targetPort || undefined,
          },
          ingress: buildIngress(cfg.ingress),
          resources: {
            limits: {
              cpu: cfg.resources?.limits?.cpu || undefined,
              memory: cfg.resources?.limits?.memory || undefined,
            },
            requests: {
              cpu: cfg.resources?.requests?.cpu || undefined,
              memory: cfg.resources?.requests?.memory || undefined,
            },
          },
          hpa: {
            enabled: boolVal(cfg.hpa?.enabled),
            minReplicas: cfg.hpa?.minReplicas || undefined,
            maxReplicas: cfg.hpa?.maxReplicas || undefined,
            targetCPUUtilizationPercentage: cfg.hpa?.targetCPUUtilizationPercentage || undefined,
          },
          pvc: {
            enabled: boolVal(cfg.pvc?.enabled),
            accessMode: cfg.pvc?.accessMode || undefined,
            size: cfg.pvc?.size || undefined,
          },
        };

        rawConfig[m.value] = svc;
      });

      // Also add tenants & mapping if user defined them
      if (tenants.length > 0) {
        rawConfig.tenants = tenants.reduce((acc, t) => {
          if (t.tenantId?.trim()) acc[t.tenantId.trim()] = { name: t.name };
          return acc;
        }, {});
      }
      if (tenantMicroserviceMapping.length > 0) {
        rawConfig.microserviceInstances = tenantMicroserviceMapping.reduce((acc, m) => {
          if (m.instance?.trim()) {
            acc[m.instance.trim()] = {
              microservice: m.microservice,
              tenants: Array.isArray(m.tenants) ? m.tenants : [],
              replicas: m.replicas,
            };
          }
          return acc;
        }, {});
      }
      if (globalEnvVars.length > 0) {
        rawConfig.global.env = globalEnvVars.reduce((acc, v) => {
          if (v.key?.trim()) acc[v.key.trim()] = v.value;
          return acc;
        }, {});
      }

      // Strip empty values so optional-only fields are omitted
      const cleaned = stripEmpty(rawConfig);

      setGeneratedYaml(
        yamlDump(cleaned || {}, { indent: 2, lineWidth: 120, noRefs: true, sortKeys: false }),
      );
    } catch {
      setGeneratedYaml('# Error generating YAML');
    }
  }, [
    globalSettings, globalEnvVars, tenants, tenantMicroserviceMapping,
    databaseConfig, kafkaConfig, kafkaTopics, topicNameFormat, redisConfig,
    mqConfig, observabilityConfig, securityConfig, integrationConfig, serviceConfigs,
  ]);

  const hasValidYaml = generatedYaml.trim().length > 0 && !generatedYaml.startsWith('# Error');
  const lineCount = generatedYaml ? generatedYaml.split('\n').length : 0;

  const handleDownloadYaml = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedProfile}-${selectedEnvironment}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${selectedProfile}-${selectedEnvironment}`, 'success');
  };

  /* ── Active config panel ── */
  const renderConfigPanel = () => {
    switch (selectedSection) {
      case 'overview':
        return <GettingStartedPanel onSectionSelect={handleSectionSelect} />;
      case 'global':
        return (
          <GlobalConfigPanel
            globalSettings={globalSettings} onGlobalSettingsChange={setGlobalSettings}
            globalEnvVars={globalEnvVars} onEnvVarsChange={setGlobalEnvVars}
            tenants={tenants} onTenantsChange={setTenants}
            tenantMicroserviceMapping={tenantMicroserviceMapping} onMappingChange={setTenantMicroserviceMapping}
          />
        );
      case 'database':
        return <DatabaseConfigPanel databaseConfig={databaseConfig} onChange={setDatabaseConfig} />;
      case 'kafka':
        return (
          <KafkaConfigPanel
            kafkaConfig={kafkaConfig} onKafkaConfigChange={setKafkaConfig}
            kafkaTopics={kafkaTopics} onTopicsChange={setKafkaTopics}
            topicNameFormat={topicNameFormat} onTopicFormatChange={setTopicNameFormat}
          />
        );
      case 'redis':
        return <RedisConfigPanel redisConfig={redisConfig} onChange={setRedisConfig} />;
      case 'messageQueue':
        return <MessageQueuePanel mqConfig={mqConfig} onChange={setMqConfig} />;
      case 'observability':
        return <ObservabilityPanel observabilityConfig={observabilityConfig} onChange={setObservabilityConfig} />;
      case 'security':
        return <SecurityPanel securityConfig={securityConfig} onChange={setSecurityConfig} />;
      case 'integration':
        return <IntegrationPanel integrationConfig={integrationConfig} onChange={setIntegrationConfig} />;
      case 'microservices':
        return (
          <MicroserviceConfigPanel
            serviceId={selectedMicroservice}
            serviceConfigs={serviceConfigs}
            onServiceConfigChange={handleServiceConfigChange}
          />
        );
      default:
        return <GettingStartedPanel onSectionSelect={handleSectionSelect} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100%' }}>

      {/* ════════════════════════════════════════════════════
          STICKY HEADER — shrinks automatically on scroll down,
          expands back when user scrolls up to top
          ════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'sticky',
          top: { xs: '56px', sm: '64px' },
          zIndex: theme.zIndex.appBar - 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          mx: { xs: -2, md: -3 },
          mt: { xs: -2, md: -3 },
          px: { xs: 2, md: 3 },
          pt: scrolled ? 0.5 : 1,
          pb: 0,
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.09)' : 'none',
          transition: 'box-shadow 0.3s ease, padding-top 0.3s ease',
        }}
      >
        {/* ── Title row: always visible, shrinks typography on scroll ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: scrolled ? 0.25 : 0.75,
            transition: 'margin 0.3s ease',
          }}
        >
          {/* Left: icon + title + collapsible subtitle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: scrolled ? 28 : 38,
                height: scrolled ? 28 : 38,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'width 0.3s ease, height 0.3s ease',
              }}
            >
              <ProfileIcon
                sx={{
                  fontSize: scrolled ? 15 : 20,
                  color: 'primary.main',
                  transition: 'font-size 0.3s ease',
                }}
                titleAccess="Generate Profile Editor"
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontWeight={700}
                color="primary.dark"
                lineHeight={1.2}
                sx={{
                  fontSize: scrolled ? '0.95rem' : '1.25rem',
                  transition: 'font-size 0.3s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Generate Profile Editor
              </Typography>
              {/* Subtitle collapses when scrolled */}
              <Collapse in={!scrolled} timeout={250}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Configure profile values with client-side YAML generation
                </Typography>
              </Collapse>
            </Box>
          </Box>

          {/* Right: YAML status chip + action buttons (always visible) */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap', alignItems: 'center', flexShrink: 0 }}>
            {hasValidYaml && (
              <Chip
                label={`${lineCount} lines`}
                size="small"
                sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', fontWeight: 600, fontSize: '0.72rem', display: { xs: 'none', sm: 'flex' } }}
              />
            )}
            <Tooltip title={hasValidYaml ? `Download ${selectedProfile}-${selectedEnvironment}` : 'Configure a section first'}>
              <span>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleDownloadYaml} disabled={!hasValidYaml} sx={{ fontWeight: 600 }}>
                  Download
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={!hasValidYaml ? 'Configure a section first' : showYamlDrawer ? 'Hide YAML preview' : 'Show YAML preview'}>
              <span>
                <Button
                  variant={showYamlDrawer ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={showYamlDrawer ? <CodeOffIcon /> : <CodeIcon />}
                  onClick={() => setShowYamlDrawer((v) => !v)}
                  disabled={!hasValidYaml}
                  sx={{ fontWeight: 600 }}
                >
                  {showYamlDrawer ? 'Hide YAML' : 'Show YAML'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Profile Configuration accordion (collapses on scroll, toggleable manually) ── */}
        <Collapse in={!scrolled} timeout={300}>
          <Accordion
            expanded={profileOpen}
            onChange={handleProfileAccordionChange}
            disableGutters
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px !important',
              mb: 1,
              '&:before': { display: 'none' },
              '& .MuiAccordionSummary-root': {
                minHeight: 40,
                px: 1.5,
                py: 0,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: profileOpen ? '8px 8px 0 0' : '8px',
              },
              '& .MuiAccordionSummary-content': { my: '8px', alignItems: 'center', gap: 1 },
              '& .MuiAccordionDetails-root': { px: 1.5, pt: 1.5, pb: 1.5 },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
              <ProfileSummaryIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                Profile Configuration
              </Typography>
              {!profileOpen && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {PROFILE_CHARTS[selectedProfile]?.name} — {selectedEnvironment}
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <ProfileSelectorBar
                profiles={PROFILE_CHARTS}
                selectedProfile={selectedProfile}
                onProfileChange={(p) => { setSelectedProfile(p); setSelectedEnvironment(PROFILE_CHARTS[p].files[0]); }}
                selectedEnvironment={selectedEnvironment}
                onEnvironmentChange={setSelectedEnvironment}
              />
            </AccordionDetails>
          </Accordion>
        </Collapse>

        {/* ── Main section tabs — always visible & sticky ── */}
        <Tabs
          value={selectedSection}
          onChange={(_, v) => setSelectedSection(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 46,
            '& .MuiTab-root': {
              minHeight: 46,
              fontWeight: 600,
              fontSize: '0.82rem',
              textTransform: 'none',
              py: 0,
            },
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          {MAIN_TABS.map(({ id, label, Icon, title }) => (
            <Tab
              key={id}
              value={id}
              label={label}
              icon={<Icon fontSize="small" />}
              iconPosition="start"
              title={title}
            />
          ))}
        </Tabs>

        {/* ── Microservice sub-tabs — visible only when Microservices tab is active ── */}
        {selectedSection === 'microservices' && (
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <Tabs
              value={selectedMicroservice}
              onChange={(_, v) => setSelectedMicroservice(v)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 38,
                '& .MuiTab-root': { minHeight: 38, fontSize: '0.8rem', textTransform: 'none', fontWeight: 500 },
                '& .MuiTabs-indicator': { height: 2 },
              }}
            >
              {MICROSERVICE_OPTIONS.map(({ value, label }) => (
                <Tab key={value} value={value} label={label} title={`Configure ${label} microservice — deployment, image, HPA, ingress, resources`} />
              ))}
            </Tabs>
          </Box>
        )}
      </Box>

      {/* ── Active Config Panel ── */}
      <Box sx={{ pt: 2 }}>
        {renderConfigPanel()}
      </Box>

      {/* ── YAML Drawer ── */}
      <YamlPreviewDrawer
        open={showYamlDrawer} onClose={() => setShowYamlDrawer(false)}
        yamlContent={generatedYaml} fileName={`${selectedProfile}-${selectedEnvironment}`}
        onDownload={handleDownloadYaml}
      />
    </Box>
  );
};

/* ── Helper to build ingress object from flat config ── */
function buildIngress(ing) {
  if (!ing) return undefined;
  const result = {
    enabled: boolVal(ing.enabled),
    className: ing.className || undefined,
  };
  if (ing.host) {
    result.hosts = [{
      host: ing.host,
      paths: [{ path: ing.path || '/', pathType: ing.pathType || 'Prefix' }],
    }];
  }
  if (ing.tlsSecretName) {
    result.tls = [{ secretName: ing.tlsSecretName, hosts: ing.host ? [ing.host] : undefined }];
  }
  if (ing.annotations) {
    try { result.annotations = JSON.parse(ing.annotations); } catch { /* ignore invalid JSON */ }
  }
  return result;
}

export default ProfileEditor;
