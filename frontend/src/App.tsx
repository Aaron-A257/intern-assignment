// src/App.tsx
import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import StockControls from './components/StockControls';
import StockChart from './components/StockChart';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4,  }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Visualization
        </Typography>
        <StockControls />
        <StockChart />
        
      </Box>
    </Container>
  );
};

export default App;