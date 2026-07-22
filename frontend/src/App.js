import React, { useState } from 'react';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StateCardGrid from './components/StateCardGrid';
import StateDetailModal from './components/StateDetailModal';
import ItineraryModal from './components/ItineraryModal';
import Footer from './components/Footer';
import './App.css';

const DEFAULT_STATES = [
  "Goa", "Himachal Pradesh", "Kerala", "Rajasthan", "Telangana",
  "Tamil Nadu", "West Bengal", "Uttarakhand", "Sikkim", "Karnataka",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh",
  "Gujarat", "Haryana", "Jharkhand", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Tripura", "Uttar Pradesh"
];

function App() {
  const [states] = useState(DEFAULT_STATES);
  const [selectedSeason, setSelectedSeason] = useState('Monsoon');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedStateForDetail, setSelectedStateForDetail] = useState(null);
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);

  // Filter states by search input
  const filteredStates = states.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="official-app-wrapper">
      {/* Top Navbar */}
      <Navbar
        selectedSeason={selectedSeason}
        onSelectSeason={setSelectedSeason}
        onOpenItineraryModal={() => setItineraryModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedVibe={selectedVibe}
        onSelectVibe={setSelectedVibe}
        selectedSeason={selectedSeason}
        onSelectSeason={setSelectedSeason}
      />

      {/* State Cards Grid */}
      <StateCardGrid
        states={filteredStates}
        selectedSeason={selectedSeason}
        selectedVibe={selectedVibe}
        onSelectState={stateName => setSelectedStateForDetail(stateName)}
      />

      {/* Dedicated State Detail Modal */}
      <StateDetailModal
        open={Boolean(selectedStateForDetail)}
        onClose={() => setSelectedStateForDetail(null)}
        state={selectedStateForDetail}
        season={selectedSeason}
        onOpenItineraryModal={() => setItineraryModalOpen(true)}
      />

      {/* AI Itinerary Modal */}
      <ItineraryModal
        open={itineraryModalOpen}
        onClose={() => setItineraryModalOpen(false)}
        state={selectedStateForDetail || 'Goa'}
        season={selectedSeason}
      />

      {/* Official Footer */}
      <Footer />
    </Box>
  );
}

export default App;
