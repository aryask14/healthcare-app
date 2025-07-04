import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const StatCard = ({ icon, title, value, trend, color }) => {
  const theme = useTheme();
  
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color }}>
          {icon}
        </Box>
      </Box>
      <Typography 
        variant="caption" 
        sx={{ 
          color: trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
          mt: 1,
          display: 'block'
        }}
      >
        {trend >= 0 ? '+' : ''}{trend}% from last month
      </Typography>
    </Paper>
  );
};

export default StatCard;