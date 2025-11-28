import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import BusOperatorRequest from '../components/BusOperatorRequest';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <Navbar />
      <Header />
      <BusOperatorRequest />
    </div>
  );
};

export default Home;
