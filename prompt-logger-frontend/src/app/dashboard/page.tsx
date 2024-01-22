'use client';
import { useContext,useEffect } from 'react';
import HomeContext, { HomeContextType } from '@/context/HomeContext'
import NavbarComponent from '@/components/navbar';
import { Dashboard } from '@/components/dashboard';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

export default function Home() {
    const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
    const router = useRouter();

    const isAuthenticated = async () => {
      console.log(auth);
      if (auth) {
        return true;
      }
  
      const token = Cookies.get('access_token');
      
      if (!token) {
        router.push('/login');
          return false;
      }
      
      // Optionally, validate the token server-side
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
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
        router.push('/login');
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
