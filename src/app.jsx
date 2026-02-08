import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';
import Footer from './Footer'; // Import the Footer component

import FamiliezBewerken from './FamiliezBewerken';
import FamiliezInfo from './FamiliezInfo';
import FamiliezSysteem from './FamiliezSysteem';

const App = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  const toggleRightDrawer = () => {
    setRightDrawerOpen(!rightDrawerOpen);
  };

  const handleLeftDrawerClose = () => {
    setLeftDrawerOpen(false);
  };

  const handleRightDrawerClose = () => {
    setRightDrawerOpen(false);
  };

  return (

    <Router>

      <TopBar toggleLeftDrawer={toggleLeftDrawer} toggleRightDrawer={toggleRightDrawer} />
      <LeftDrawer open={leftDrawerOpen} onClose={handleLeftDrawerClose} />
      <RightDrawer open={rightDrawerOpen} onClose={handleRightDrawerClose} />


      <Routes>
        <Route path="/familiez-bewerken" element={<FamiliezBewerken />} />
        <Route path="/familiez-info" element={<FamiliezInfo />} />
        <Route path="/familiez-systeem" element={<FamiliezSysteem />} />
        <Route path="/" element={<Navigate to="/familiez-bewerken" />} />
      </Routes>



      <Footer />
    </Router>

  );
}

export default App;
