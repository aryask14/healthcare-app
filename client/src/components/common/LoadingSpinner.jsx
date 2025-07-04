import React from 'react';
import { 
  CircularProgress,
  Box,
  Typography,
  Backdrop,
  Fade,
  useTheme
} from '@mui/material';
import { 
  Healing,  // Medical-themed icon
  HourglassBottom 
} from '@mui/icons-material';

// Style variants
const spinnerStyles = {
  standard: {
    size: 40,
    thickness: 4,
    color: 'primary'
  },
  small: {
    size: 24,
    thickness: 3,
    color: 'inherit'
  },
  large: {
    size: 60,
    thickness: 5,
    color: 'secondary'
  },
  page: {
    size: 80,
    thickness: 6,
    color: 'primary'
  }
};

const LoadingSpinner = ({ 
  variant = 'standard', 
  message, 
  fullPage = false,
  withIcon = false
}) => {
  const theme = useTheme();
  const style = spinnerStyles[variant] || spinnerStyles.standard;

  if (fullPage) {
    return (
      <Backdrop
        open={true}
        sx={{ 
          zIndex: theme.zIndex.modal + 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Fade in={true} timeout={500}>
          <Box textAlign="center">
            {withIcon && (
              <Healing 
                color={style.color} 
                sx={{ 
                  fontSize: style.size * 1.5,
                  mb: 2,
                  animation: 'pulse 2s infinite ease-in-out'
                }} 
              />
            )}
            <CircularProgress
              size={style.size}
              thickness={style.thickness}
              color={style.color}
              sx={{ mb: 2 }}
            />
            {message && (
              <Typography 
                variant="h6" 
                color={style.color}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Fade>
      </Backdrop>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        py: variant === 'page' ? 10 : 4
      }}
    >
      {withIcon && (
        <HourglassBottom 
          color={style.color} 
          sx={{ 
            fontSize: style.size,
            mb: 2,
            animation: 'rotate 2s infinite linear'
          }} 
        />
      )}
      <CircularProgress
        size={style.size}
        thickness={style.thickness}
        color={style.color}
      />
      {message && (
        <Typography 
          variant={variant === 'page' ? 'h6' : 'body1'}
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;

// Add to your global CSS (App.css or theme)
/*
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
*/