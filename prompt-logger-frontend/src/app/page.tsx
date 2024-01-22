'use client';
import { useContext, useEffect, useState, createContext } from "react"
import axios from "axios";
import { Chat } from '@/components/chat';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import NavbarComponent from '@/components/navbar'
import HomeContext, { HomeContextType } from '@/context/HomeContext'


export default function Home() {
  const router = useRouter();
  const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);

  const isAuthenticated = async () => {
    if (auth) {
      return true;
    }

    const token = Cookies.get('access_token');

    if (!token) {
      return false;
    }

    // Optionally, validate the token server-side
    const response = await fetch('http://localhost:8000/profile', {
      method: 'GET',
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
    <main className="h-screen">
      <div className="h-[15%]">
        <NavbarComponent />
      </div>
      <div className="h-[85%]">
        <Chat />
      </div>
    </main>
  )
}
