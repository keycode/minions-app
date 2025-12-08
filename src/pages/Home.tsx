import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

 
import portadaDesktop from '../assets/portada.png';
import portadaMobile from '../assets/portadamobile.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();

 
  const goToDashboard = () => {
    navigate('/minions');
  };

  useEffect(() => {
 
    const timer = setTimeout(() => {
      goToDashboard();
    }, 5000);

 
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black cursor-pointer"
      onClick={goToDashboard}
      role="button"
      tabIndex={0}
    
    >
 
      <img 
        src={portadaMobile} 
        alt="Portada Móvil" 
        className="block object-cover w-full h-full md:hidden animate-fade-in"
      />

 
      <img 
        src={portadaDesktop} 
        alt="Portada Desktop" 
        className="hidden object-cover h-full mx-auto md:block animate-fade-in"
      />
      
     
    </div>
  );
};