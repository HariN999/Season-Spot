import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';
import theme from './theme';
import { SeasonProvider } from './context/SeasonContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import StateDetailPage from './pages/StateDetailPage';
import PlannerPage from './pages/PlannerPage';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SeasonProvider>
        <BrowserRouter>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0b0f19' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/state/:stateName" element={<StateDetailPage />} />
                <Route path="/planner" element={<PlannerPage />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </SeasonProvider>
    </ThemeProvider>
  );
}

export default App;
