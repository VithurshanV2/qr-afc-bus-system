import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { AppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

const Home = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <Navbar />
      <Header />

      {userData?.role === 'COMMUTER' && <BottomNav />}
    </div>
  );
};

export default Home;
