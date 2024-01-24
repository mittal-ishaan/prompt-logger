'use client';
import { useContext, useEffect, useState, createContext } from "react"
import axios from "axios";
import { Chat } from '@/components/chat';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import NavbarComponent from '@/components/navbar'
import HomeContext, { HomeContextType } from '@/context/HomeContext'
import Loader from "@/components/loader";


export default function Home() {
  const router = useRouter();
  const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
  const [loading, setLoading] = useState<boolean>(true);

  const isAuthenticated = async () => {
    const token = Cookies.get('access_token');

    if (!token) {
      router.push('/login');
      return false;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(async (response) => {
      if (response.status === 401) {
        router.push('/login');
        return false;
      }
      if(response.status === 200){
        const data = await response.json();
        setauth(data);
        return true;
      }
    }).catch((err) => {
      console.log(err);
      router.push('/login');
    });
  };

  useEffect(() => {
    isAuthenticated();
    setLoading(false);
  }, []);



  return (
    <main className="h-screen">
      <div>
        <NavbarComponent/>
      </div>
      <div className="h-[85%]">
        <Chat />
      </div>
    </main>
  )
}
