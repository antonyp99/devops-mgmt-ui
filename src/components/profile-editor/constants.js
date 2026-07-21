/**
 * Profile Editor — shared constants & helpers.
 *
 * Single source of truth for chart definitions, tree structure,
 * database presets, microservice options, and YAML-building utilities.
 */

/* ─── Profile chart definitions ─── */
export const PROFILE_CHARTS = {
  'x28-product-suite': {
    name: 'X28 Product Suite',
    description: 'Umbrella chart for X28 microservices platform',
    files: ['values.yaml', 'values-dev.yaml', 'values-prod.yaml'],
  },
  'springboot-microservice': {
    name: 'Spring Boot Microservice',
    description: 'Base chart for individual Spring Boot services',
    files: ['values.yaml'],
  },
};

/* ─── Microservice option list (shared by panels) ─── */
export const MICROSERVICE_OPTIONS = [
  { value: 'xconnect', label: 'X-Connect', component: 'api-gateway' },
  { value: 'xidentity', label: 'X-Identity', component: 'authentication' },
  { value: 'xnotification', label: 'X-Notification', component: 'messaging' },
  { value: 'xscheduler', label: 'X-Scheduler', component: 'scheduler' },
  { value: 'xreports', label: 'X-Reports', component: 'reporting' },
  { value: 'xbusinessservice', label: 'X-Business', component: 'business-logic' },
];

/* ─── Database presets ─── */
export const DB_PRESETS = {
  postgresql: {
    label: 'PostgreSQL',
    defaultPort: 5432,
    driver: 'org.postgresql.Driver',
    dialect: 'org.hibernate.dialect.PostgreSQL10Dialect',
    color: '#336791',
    urlTemplate: (h, p, d) => `jdbc:postgresql://${h}:${p}/${d}`,
  },
  mysql: {
    label: 'MySQL',
    defaultPort: 3306,
    driver: 'com.mysql.cj.jdbc.Driver',
    dialect: 'org.hibernate.dialect.MySQL8Dialect',
    color: '#005C84',
    urlTemplate: (h, p, d) => `jdbc:mysql://${h}:${p}/${d}`,
  },
  oracle: {
    label: 'Oracle',
    defaultPort: 1521,
    driver: 'oracle.jdbc.OracleDriver',
    dialect: 'org.hibernate.dialect.Oracle12cDialect',
    color: '#C74634',
    urlTemplate: (h, p, d) => `jdbc:oracle:thin:@${h}:${p}:${d}`,
  },
  sqlserver: {
    label: 'SQL Server',
    defaultPort: 1433,
    driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    dialect: 'org.hibernate.dialect.SQLServer2012Dialect',
    color: '#CC2927',
    urlTemplate: (h, p, d) => `jdbc:sqlserver://${h}:${p};databaseName=${d}`,
  },
};

/* ─── Kafka topic format templates ─── */
export const TOPIC_FORMAT_OPTIONS = [
  { value: '{tenantid}.{topicName}', label: '{tenantid}.{topicName}' },
  { value: 'PROJ001.{tenantid}.{topicName}', label: 'PROJ001.{tenantid}.{topicName}' },
  { value: 'x28.{tenantid}.{topicName}', label: 'x28.{tenantid}.{topicName}' },
  { value: '{topicName}.{tenantid}', label: '{topicName}.{tenantid}' },
];

/* ─── Shared accordion / section-header style tokens ─── */
export const accordionSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '12px !important',
  mb: 1.5,
  boxShadow: '0 1px 4px rgba(92,107,192,0.04)',
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: '0 0 12px 0 !important' },
};

/* ─── YAML helper — strips empty/undefined values so optional fields are omitted ─── */
export const stripEmpty = (obj) => {
  if (Array.isArray(obj)) {
    const filtered = obj.map(stripEmpty).filter((v) => v !== undefined);
    return filtered.length > 0 ? filtered : undefined;
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const [k, v] of Object.entries(obj)) {
      const val = stripEmpty(v);
      if (val !== undefined) cleaned[k] = val;
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  if (obj === '' || obj === null || obj === undefined) return undefined;
  return obj;
};
