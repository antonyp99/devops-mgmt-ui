import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Login as LoginIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Storage as StorageIcon,
  AccountTree as AccountTreeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

import { useAuth } from '../services/AuthProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { authenticated, loginWithCredentials } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await loginWithCredentials(formData.username, formData.password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error or server unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const features = [
    { icon: <StorageIcon sx={{ fontSize: 22 }} titleAccess="GitLab Repository Provisioning" />, label: 'GitLab Repository Provisioning' },
    { icon: <AccountTreeIcon sx={{ fontSize: 22 }} titleAccess="Automated CI/CD Pipelines" />, label: 'Automated CI/CD Pipelines' },
    { icon: <SecurityIcon sx={{ fontSize: 22 }} titleAccess="Role-Based Access Control" />, label: 'Role-Based Access Control' },
  ];

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      bgcolor: '#F8F9FC',
      '& fieldset': { borderColor: '#E8EAF6' },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: 2 },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* ── Left: Branding panel ── */}
      <Box
        sx={{
          flex: { xs: 'none', md: '1 1 50%' },
          background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.secondary.main} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, md: 8 },
          py: { xs: 5, md: 0 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', top: '40%', right: '10%', width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 420, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 1.5,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            }}
          >
            DevOps Management
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 400,
              lineHeight: 1.5,
              mb: 4,
              fontSize: { xs: '0.9rem', md: '1.05rem' },
            }}
          >
            Self-service GitLab repository provisioning platform
          </Typography>

          {/* Feature pills */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {features.map((f) => (
                <Box
                  key={f.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.2,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(6px)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  {f.icon}
                  {f.label}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Right: Login form ── */}
      <Box
        sx={{
          flex: { xs: '1', md: '1 1 50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default,
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 5, md: 0 },
          minHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 540,
            minHeight: 580,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
            px: { xs: 3, sm: 6 },
            pt: 8,
            pb: 7,
            position: 'relative',
          }}
        >
          {/* Login icon at top center */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 3,
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              <LoginIcon sx={{ fontSize: 30, color: '#fff' }} titleAccess="Login" />
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#263238', textAlign: 'center', mb: 0.5, fontSize: '1.6rem' }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#607D8B', textAlign: 'center', mb: 4, fontSize: '0.95rem' }}
          >
            Sign in to continue to your workspace
          </Typography>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{ mb: 2.5, borderRadius: 2.5 }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              required
              autoFocus
              disabled={loading}
              sx={{ mb: 3, ...inputSx }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#9E9E9E', fontSize: 22 }} titleAccess="Username" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              required
              disabled={loading}
              sx={{ mb: 3.5, ...inputSx }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#9E9E9E', fontSize: 22 }} titleAccess="Password" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                        sx={{ color: '#9E9E9E' }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" titleAccess="Hide Password" /> : <Visibility fontSize="small" titleAccess="Show Password" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? null : <LoginIcon titleAccess="Sign In" />}
              disabled={loading || !formData.username || !formData.password}
              sx={{
                py: 1.6,
                fontWeight: 700,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.dark, 0.4)}`,
                },
                '&.Mui-disabled': {
                  background: alpha(theme.palette.primary.main, 0.38),
                  color: '#fff',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', mt: 3.5, color: '#90A4AE', fontSize: '0.8rem' }}
          >
            Please contact your administrator if you need access
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
