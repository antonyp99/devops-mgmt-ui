import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AlertCenterContext = createContext(undefined);

export const AlertCenterProvider = ({ children }) => {
  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info', // success | error | warning | info
    duration: 4000,
  });

  // Confirmation dialog state
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    severity: 'info',
  });

  const confirmResolveRef = useRef(null);

  // --- Toast ---
  const showToast = useCallback((message, severity = 'info', duration = 4000) => {
    setToast({ open: true, message, severity, duration });
  }, []);

  const handleToastClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // --- Confirmation Dialog ---
  const confirm = useCallback((options) => {
    const {
      title = 'Confirm',
      message = 'Are you sure?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      severity = 'info',
    } = options || {};

    setConfirmation({ open: true, title, message, confirmText, cancelText, severity });

    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, open: false }));
    confirmResolveRef.current?.(true);
    confirmResolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, open: false }));
    confirmResolveRef.current?.(false);
    confirmResolveRef.current = null;
  }, []);

  return (
    <AlertCenterContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Snackbar Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 2147483647 }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: 'fit-content',
            maxWidth: '50vw',
            whiteSpace: 'pre-line',
            '& .MuiAlert-message': {
              maxHeight: '15em',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent', borderRadius: 3 },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(255,255,255,0.35)',
                borderRadius: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.55)' },
              },
            },
            ...(toast.severity === 'success'
              ? { color: '#fff', '& .MuiAlert-icon': { color: '#fff' } }
              : {}),
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmation.open}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
          handleCancel();
        }}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            position: 'fixed',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2147483647,
            minWidth: 400,
            maxWidth: 520,
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          },
        }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(2px)' },
          },
        }}
      >
        <DialogContent sx={{ px: 4, pt: 4, pb: 2 }}>
          <Stack spacing={1.5} alignItems="center" textAlign="center">
            {{
              warning: <WarningAmberRoundedIcon sx={{ fontSize: 32, color: 'warning.main' }} titleAccess="Warning" />,
              error: <ErrorOutlineRoundedIcon sx={{ fontSize: 32, color: 'error.main' }} titleAccess="Error" />,
              success: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32, color: 'success.main' }} titleAccess="Success" />,
              info: <InfoOutlinedIcon sx={{ fontSize: 32, color: 'info.main' }} titleAccess="Info" />,
            }[confirmation.severity] || <WarningAmberRoundedIcon sx={{ fontSize: 32, color: 'warning.main' }} titleAccess="Warning" />}
            {confirmation.title && (
              <Typography variant="h6" fontWeight={800}>
                {confirmation.title}
              </Typography>
            )}
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
            >
              {confirmation.message}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1.5, px: 4, pb: 3.5, pt: 1 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: 'text.secondary', bgcolor: 'rgba(92, 107, 192, 0.08)' },
            }}
          >
            {confirmation.cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            autoFocus
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {confirmation.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertCenterContext.Provider>
  );
};

export const useAlertCenter = () => {
  const ctx = useContext(AlertCenterContext);
  if (!ctx) {
    throw new Error('useAlertCenter must be used within an AlertCenterProvider');
  }
  return ctx;
};
