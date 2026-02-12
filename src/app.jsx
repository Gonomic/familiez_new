import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';
import Footer from './Footer';

import FamiliezBewerken from './FamiliezBewerken';
import FamiliezInfo from './FamiliezInfo';
import FamiliezSysteem from './FamiliezSysteem';

const App = () => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personToEdit, setPersonToEdit] = useState(null);
  const [nbrOfParentGenerations, setNbrOfParentGenerations] = useState(1);
  const [nbrOfChildGenerations, setNbrOfChildGenerations] = useState(1);

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
    // Clear edit mode when drawer closes
    setPersonToEdit(null);
  };

  const handlePersonSelected = (person, parentGens, childGens) => {
    setSelectedPerson(person);
    setNbrOfParentGenerations(parentGens);
    setNbrOfChildGenerations(childGens);
  };

  const handleEditPerson = (person) => {
    setPersonToEdit(person);
    setRightDrawerOpen(true);
  };

  const handlePersonUpdated = (updatedPerson) => {
    if (updatedPerson) {
      // Update the selected person if it was edited
      if (selectedPerson && selectedPerson.PersonID === updatedPerson.PersonID) {
        setSelectedPerson(updatedPerson);
      }
    }
    // Clear edit mode
    setPersonToEdit(null);
  };

  return (
    <Router>
      <TopBar toggleLeftDrawer={toggleLeftDrawer} toggleRightDrawer={toggleRightDrawer} />
      <LeftDrawer open={leftDrawerOpen} onClose={handleLeftDrawerClose} />
      <RightDrawer 
        open={rightDrawerOpen} 
        onClose={handleRightDrawerClose} 
        onPersonSelected={handlePersonSelected}
        personToEdit={personToEdit}
        onPersonUpdated={handlePersonUpdated}
      />

      <Routes>
        <Route 
          path="/familiez-bewerken" 
          element={
            <FamiliezBewerken 
              selectedPerson={selectedPerson}
              nbrOfParentGenerations={nbrOfParentGenerations}
              nbrOfChildGenerations={nbrOfChildGenerations}
              onEditPerson={handleEditPerson}
            />
          } 
        />
        <Route path="/familiez-info" element={<FamiliezInfo />} />
        <Route path="/familiez-systeem" element={<FamiliezSysteem />} />
        <Route path="/" element={<Navigate to="/familiez-bewerken" />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
