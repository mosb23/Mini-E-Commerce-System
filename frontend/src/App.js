import React, { useState } from 'react';
import PlantShop from './components/PlantShop';
import Admin from './components/Admin';
import './App.css';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return <Admin onBack={() => setShowAdmin(false)} />;
  }

  return <PlantShop onShowAdmin={() => setShowAdmin(true)} />;
}

export default App;
