import React from 'react';
import { Snackbar, SnackbarContent, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@components/UI/iconsComponents/icons/checkIcon';

const NotificationContentRoot = styled(SnackbarContent)(() => ({
  backgroundColor: 'black',
  '&.success': {
    backgroundColor: 'black',
  },
  '&.error': {
    backgroundColor: 'black',
  },
  '&.info': {
    backgroundColor: 'black',
  },
  '&.warning': {
    backgroundColor: 'black',
  },
}));

const IconButtonRoot = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  open,
  onClose,
  autoHideDuration = 6000,
}) => {
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <NotificationContentRoot
        className={type}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className="text-white flex gap-2">
            <CheckIcon width="20" color="#6AFFAF" />
            {message}
          </span>
        }
        action={[
          <IconButtonRoot
            key="close"
            aria-label="Close"
            color="secondary"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButtonRoot>,
        ]}
      />
    </Snackbar>
  );
};

export default Notification;