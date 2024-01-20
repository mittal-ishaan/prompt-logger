'use client';
import { useContext,useEffect } from 'react';
import HomeContext, { HomeContextType } from '@/context/HomeContext'
import NavbarComponent from '@/components/navbar';
import { Dashboard } from '@/components/dashboard';
import Cookies from "js-cookie";

export default function Home() {
    const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
    
    const isAuthenticated = async () => {
      console.log(auth);
      if (auth) {
        return true;
      }
  
      const token = Cookies.get('access_token');
      
      if (!token) {
          return false;
      }
      
      // Optionally, validate the token server-side
      const response = await fetch('http://localhost:8000/profile', {
          method : 'GET',
          headers: {
          'Authorization': `Bearer ${token}`
          },
      });
      const data = await response.json();
      setauth(data); 
      return response.ok;
  };
  
  useEffect(() => {
    isAuthenticated().then((auth) => {
      if (!auth) {
        window.location.href = '/login';
      }
    });
  }, []);
  
    return (
    <main>
      <NavbarComponent/>
      <Dashboard/>
    </main>
  )
}
