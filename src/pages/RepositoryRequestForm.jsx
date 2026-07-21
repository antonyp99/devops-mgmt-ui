import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Source as SourceIcon,
} from '@mui/icons-material';

import { useAlertCenter } from '../contexts/AlertCenter';

const steps = ['Repository Details', 'Technology Stack', 'User Access'];

/**
 * Sanitize repository name input.
 * Rules: must start with a letter, only lowercase letters, digits, '-' and '/' allowed.
 */
const sanitizeRepositoryName = (value) => {
  // Lowercase everything
  let sanitized = value.toLowerCase();
  // Remove any characters that aren't lowercase letters, digits, '-' or '/'
  sanitized = sanitized.replace(/[^a-z0-9\-/]/g, '');
  // Collapse consecutive '-' or '/' into a single occurrence
  sanitized = sanitized.replace(/[-/]{2,}/g, (m) => m[0]);
  // Must start with a letter � strip leading non-alpha characters
  sanitized = sanitized.replace(/^[^a-z]+/, '');
  return sanitized;
};

const RepositoryRequestForm = ({ onNavigate }) => {
  const theme = useTheme();
  const { showToast } = useAlertCenter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    projectSuite: '',
    layer: '',
    product: '',
    repositoryName: '',
    repositoryType: '',
    techStack: '',
    techStackVersion: '',
    builder: '',
    builderVersion: '',
    dockerNeeded: false,
    description: '',
    users: [],
  });
  
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // TODO: replace with real API calls when backend endpoints are ready
  const projectSuites = [];
  const techStacks = [];
  const repositoryTypes = [];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: replace with real API call when backend endpoint is ready
      setAvailableUsers([]);
    } catch (err) {
      console.warn('Could not load users:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent fields change
      if (field === 'projectSuite') {
        newData.product = '';
      }
      if (field === 'techStack') {
        newData.techStackVersion = '';
        newData.builder = '';
        newData.builderVersion = '';
      }
      if (field === 'builder') {
        newData.builderVersion = '';
      }
      
      return newData;
    });
  };

  const getSelectedProjectSuite = () => {
    return projectSuites.find(ps => ps.id === formData.projectSuite);
  };

  const getSelectedTechStack = () => {
    return techStacks.find(ts => ts.id === formData.techStack);
  };

  const getSelectedBuilder = () => {
    const techStack = getSelectedTechStack();
    return techStack?.builders.find(b => b.id === formData.builder);
  };

  const addUser = () => {
    setFormData(prev => ({
      ...prev,
      users: [...prev.users, { user: '', role: 'developer' }]
    }));
  };

  const removeUser = (index) => {
    setFormData(prev => ({
      ...prev,
      users: prev.users.filter((_, i) => i !== index)
    }));
  };

  const updateUser = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      users: prev.users.map((user, i) => 
        i === index ? { ...user, [field]: value } : user
      )
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return !!(
          formData.projectSuite && 
          formData.layer && 
          formData.product && 
          formData.repositoryName && 
          formData.repositoryType
        );
      case 1:
        return !!(
          formData.techStack && 
          formData.techStackVersion && 
          formData.builder && 
          formData.builderVersion
        );
      case 2:
        return formData.users.every(user => user.user && user.role);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    } else {
      showToast('Please fill in all required fields', 'error');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const generateRepositoryPath = () => {
    if (!formData.projectSuite || !formData.product) return '';
    
    const suite = formData.projectSuite.toUpperCase();
    const layer = formData.layer === 'backend' ? 'BE' : 'FE';
    return `${suite}/${layer}/${formData.product.toUpperCase()}`;
  };

  const generateRepositoryName = () => {
    if (!formData.repositoryName || !formData.repositoryType) return '';
    
    const cleanName = formData.repositoryName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const repoType = repositoryTypes.find(rt => rt.id === formData.repositoryType);
    return `${cleanName}-${repoType?.id || ''}`;
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const repositoryPath = generateRepositoryPath();
      const fullRepositoryName = generateRepositoryName();
      
      const requestPayload = {
        repository_name: fullRepositoryName,
        group_path: repositoryPath,
        layer: formData.layer,
        repo_type: formData.repositoryType,
        tech_stack: formData.techStack,
        tech_stack_version: formData.techStackVersion,
        builder: formData.builder,
        builder_version: formData.builderVersion,
        docker_needed: formData.dockerNeeded,
        visibility: 'private',
        description: formData.description || `${formData.repositoryType} repository for ${formData.product}`,
      };

      const result = { id: 'pending' }; // TODO: replace with real API call
      // await apiService.createRepositoryRequest(requestPayload);
      showToast(`Repository request created successfully! Request ID: ${result.id}`, 'success');
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/requests');
      }, 2000);
      
    } catch (err) {
      console.error('Submission error:', err);
      showToast(err.response?.data?.message || 'Failed to create repository request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Repository Details</Typography>
            
            <FormControl fullWidth required>
              <InputLabel>Project Suite</InputLabel>
              <Select
                value={formData.projectSuite}
                onChange={(e) => handleInputChange('projectSuite', e.target.value)}
                label="Project Suite"
              >
                {projectSuites.map(suite => (
                  <MenuItem key={suite.id} value={suite.id}>
                    {suite.name} ({suite.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Interface</InputLabel>
              <Select
                value={formData.layer}
                onChange={(e) => handleInputChange('layer', e.target.value)}
                label="Interface"
              >
                <MenuItem value="backend">Backend</MenuItem>
                <MenuItem value="frontend">Frontend</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required disabled={!formData.projectSuite}>
                <InputLabel>Product/Module</InputLabel>
                <Select
                  value={formData.product}
                  onChange={(e) => handleInputChange('product', e.target.value)}
                  label="Product/Module"
                >
                  {getSelectedProjectSuite()?.products.map(product => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                required
                label="Repository Name"
                value={formData.repositoryName}
                onChange={(e) => {
                  const sanitized = sanitizeRepositoryName(e.target.value.slice(0, 20));
                  handleInputChange('repositoryName', sanitized);
                }}
                inputProps={{ maxLength: 20 }}
                helperText={`${formData.repositoryName.length}/20 characters. Starts with a letter, lowercase, '-' and '/' allowed. Generated: ${generateRepositoryName()}`}
              />

              <FormControl fullWidth required>
                <InputLabel>Repository Type</InputLabel>
                <Select
                  value={formData.repositoryType}
                  onChange={(e) => handleInputChange('repositoryType', e.target.value)}
                  label="Repository Type"
                >
                  {repositoryTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name} ({type.id}) - {type.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              helperText="Brief description of the repository purpose"
            />

            {formData.projectSuite && formData.product && (
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Repository Path Preview:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {generateRepositoryPath()}/{generateRepositoryName()}
                </Typography>
              </Paper>
            )}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Technology Stack</Typography>
            
            <FormControl fullWidth required>
              <InputLabel>Programming Language</InputLabel>
              <Select
                value={formData.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
                label="Programming Language"
              >
                {techStacks.map(stack => (
                  <MenuItem key={stack.id} value={stack.id}>
                    {stack.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.techStack}>
              <InputLabel>Language Version</InputLabel>
              <Select
                value={formData.techStackVersion}
                onChange={(e) => handleInputChange('techStackVersion', e.target.value)}
                label="Language Version"
              >
                {getSelectedTechStack()?.versions.map(version => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.techStack}>
              <InputLabel>Builder</InputLabel>
              <Select
                value={formData.builder}
                onChange={(e) => handleInputChange('builder', e.target.value)}
                label="Builder"
              >
                {getSelectedTechStack()?.builders.map(builder => (
                  <MenuItem key={builder.id} value={builder.id}>
                    {builder.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.builder}>
              <InputLabel>Builder Version</InputLabel>
              <Select
                value={formData.builderVersion}
                onChange={(e) => handleInputChange('builderVersion', e.target.value)}
                label="Builder Version"
              >
                {getSelectedBuilder()?.versions.map(version => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.dockerNeeded}
                  onChange={(e) => handleInputChange('dockerNeeded', e.target.checked)}
                />
              }
              label="Enable Container Support (Dockerfile)"
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">User Access</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon titleAccess="Add User" />}
                onClick={addUser}
              >
                Add User
              </Button>
            </Box>

            {formData.users.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="textSecondary">
                  No users added yet. Click "Add User" to grant repository access.
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Access/Role</TableCell>
                      <TableCell width="60px">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.users.map((userAccess, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={userAccess.user}
                              onChange={(e) => updateUser(index, 'user', e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Select User</MenuItem>
                              {availableUsers.map(user => (
                                <MenuItem key={user.username} value={user.username}>
                                  {user.name} ({user.username})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={userAccess.role}
                              onChange={(e) => updateUser(index, 'role', e.target.value)}
                            >
                              <MenuItem value="viewer">Viewer</MenuItem>
                              <MenuItem value="developer">Developer</MenuItem>
                              <MenuItem value="architect">Architect</MenuItem>
                              <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeUser(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon titleAccess="Remove User" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* ── Header Banner ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          px: 3,
          py: 2.5,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,

        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SourceIcon sx={{ color: '#fff', fontSize: 28 }} titleAccess="Submit Git Repository" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
              Submit Git Repository Request
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Create and manage GitLab groups and repositories with approval workflow
            </Typography>
          </Box>
        </Box>
        <Button
          title="Back"
          startIcon={<ArrowBackIcon titleAccess="Back" />}
          onClick={() => onNavigate('dashboard')}
          variant="outlined"
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}
        >
          Back
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Back
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  startIcon={<SendIcon titleAccess="Submit Request" />}
                  disabled={loading || !validateStep(activeStep)}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={!validateStep(activeStep)}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RepositoryRequestForm;
