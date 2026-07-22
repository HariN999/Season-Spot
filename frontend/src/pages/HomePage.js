import React from 'react';
import { Container, Box } from '@mui/material';
import { useSeason } from '../context/SeasonContext';
import { useSeasonalData } from '../hooks/useSeasonalData';
import HeroSection from '../components/home/HeroSection';
import FeaturedGrid from '../components/home/FeaturedGrid';
import TrendingCarousel from '../components/home/TrendingCarousel';
import CuisineSpotlight from '../components/home/CuisineSpotlight';
import PlannerCTA from '../components/home/PlannerCTA';
import SectionHeading from '../components/shared/SectionHeading';

export default function HomePage() {
  const { season } = useSeason();
  const { topRated, statesWithData, cuisineHighlights } = useSeasonalData(season);

  return (
    <Box>
      {/* Cinematic Hero */}
      <HeroSection />

      {/* Featured Destinations */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading
          overline="Top Rated"
          title={`Best Destinations for ${season}`}
          subtitle="Handpicked states with the highest seasonal suitability scores."
        />
        <FeaturedGrid states={topRated} />
      </Container>

      {/* Trending Carousel */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <SectionHeading
          overline="Trending"
          title="Explore All States"
          subtitle="Swipe through all 28 Indian states and find your next escape."
        />
        <TrendingCarousel states={statesWithData} />
      </Container>

      {/* Cuisine Spotlight */}
      <Box sx={{ bgcolor: '#111827', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            overline="Culinary Heritage"
            title={`Seasonal Flavors of ${season}`}
            subtitle="Signature regional dishes at their peak during this season."
          />
          <CuisineSpotlight dishes={cuisineHighlights} />
        </Container>
      </Box>

      {/* AI Planner CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <PlannerCTA />
      </Container>
    </Box>
  );
}
