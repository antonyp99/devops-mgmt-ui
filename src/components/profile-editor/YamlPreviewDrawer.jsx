import React, { useState, useCallback } from 'react';
import {
  Drawer, Box, AppBar, Toolbar, Typography, IconButton,
  Tooltip, Chip, alpha, useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  CheckCircleOutline as CopiedIcon,
} from '@mui/icons-material';

/** Basic YAML syntax colorizer */
const YamlLine = ({ line, index }) => {
  if (!line && line !== '') return <br key={index} />;

  const trimmed = line.trim();

  if (trimmed.startsWith('#')) {
    return (
      <span key={index} style={{ color: '#718096', fontStyle: 'italic' }}>
        {line}
      </span>
    );
  }

  const colonIdx = line.indexOf(':');
  if (colonIdx > 0) {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '';
    const keyPart = line.slice(indent.length, colonIdx);
    const rest = line.slice(colonIdx + 1);

    let valueColor = '#e2e8f0';
    const restTrimmed = rest.trim();
    if (restTrimmed === 'true' || restTrimmed === 'false') valueColor = '#b794f4';
    else if (restTrimmed === '~' || restTrimmed === 'null') valueColor = '#fc8181';
    else if (!isNaN(restTrimmed) && restTrimmed !== '') valueColor = '#fbd38d';
    else if (restTrimmed.startsWith("'") || restTrimmed.startsWith('"')) valueColor = '#68d391';
    else if (restTrimmed !== '') valueColor = '#e2e8f0';

    return (
      <span key={index}>
        {indent}
        <span style={{ color: '#90cdf4' }}>{keyPart}</span>
        <span style={{ color: '#fc8181' }}>:</span>
        <span style={{ color: valueColor }}>{rest}</span>
      </span>
    );
  }

  if (trimmed.startsWith('-')) {
    const dash = line.indexOf('-');
    return (
      <span key={index}>
        {line.slice(0, dash)}
        <span style={{ color: '#fc8181' }}>-</span>
        <span style={{ color: '#68d391' }}>{line.slice(dash + 1)}</span>
      </span>
    );
  }

  return <span key={index} style={{ color: '#e2e8f0' }}>{line}</span>;
};

const YamlPreviewDrawer = ({ open, onClose, yamlContent, fileName, onDownload }) => {
  const theme = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  const lineCount = yamlContent ? yamlContent.split('\n').length : 0;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard not available */ }
  }, [yamlContent]);

  const lines = yamlContent ? yamlContent.split('\n') : [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: false }}
      sx={{
        zIndex: theme.zIndex.drawer + 100,
        '& .MuiDrawer-paper': {
          width: isMaximized
            ? { xs: '100vw', sm: 'calc(100vw - 60px)' }
            : { xs: '100vw', sm: 580, md: 620 },
          transition: 'width 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#0f1117',
        },
      }}
    >
      <AppBar
        position="relative"
        elevation={0}
        sx={{ bgcolor: '#1a1f2c', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
      >
        <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
          <Typography variant="subtitle2" sx={{ flexGrow: 1, color: '#e2e8f0', fontWeight: 700 }}>
            Generated YAML
          </Typography>

          {lineCount > 0 && (
            <Chip
              label={`${lineCount} lines`}
              size="small"
              sx={{
                bgcolor: alpha('#90cdf4', 0.15),
                color: '#90cdf4',
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}

          <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton
              size="small"
              aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
              onClick={handleCopy}
              disabled={!yamlContent}
              sx={{ color: copied ? '#68d391' : '#a0aec0', '&:hover': { color: '#e2e8f0' } }}
            >
              {copied ? <CopiedIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Download YAML">
            <IconButton
              size="small"
              aria-label="Download YAML"
              onClick={onDownload}
              disabled={!yamlContent}
              sx={{ color: '#a0aec0', '&:hover': { color: '#e2e8f0' } }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={isMaximized ? 'Restore' : 'Maximize'}>
            <IconButton
              size="small"
              aria-label={isMaximized ? 'Restore' : 'Maximize'}
              onClick={() => setIsMaximized((v) => !v)}
              sx={{ color: '#a0aec0', '&:hover': { color: '#e2e8f0' } }}
            >
              {isMaximized ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton
              size="small"
              aria-label="Close YAML panel"
              onClick={onClose}
              sx={{ color: '#a0aec0', '&:hover': { color: '#fc8181' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: '#141720',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#718096', fontFamily: 'monospace' }}>
            📄 {fileName}
          </Typography>
        </Box>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {lines.length > 0 ? (
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              fontFamily: '"Fira Code", "Cascadia Code", Monaco, Menlo, Consolas, monospace',
              fontSize: '0.795rem',
              lineHeight: 1.65,
              color: '#e2e8f0',
              bgcolor: '#0f1117',
              minHeight: '100%',
              overflowX: 'auto',
              whiteSpace: 'pre',
            }}
          >
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 36,
                    textAlign: 'right',
                    marginRight: 16,
                    color: '#4a5568',
                    userSelect: 'none',
                    fontSize: '0.72rem',
                  }}
                >
                  {i + 1}
                </span>
                <YamlLine line={line} index={i} />
                {'\n'}
              </React.Fragment>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#4a5568',
            }}
          >
            <Typography variant="body2">No YAML content available</Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default YamlPreviewDrawer;
