import Image from 'next/image'
import { Chat } from '@/components/chat';
import { Dashboard } from '@/components/dashboard';
import { useContext } from 'react';
import HomeContext from '@/context/HomeContext'

type HomeContextType = {
  auth: any;
  setauth: any;
  activeConversation: any;
  setActiveConversation: any;
};

export default function Home() {
    const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
  return (
    <main>
      <Dashboard/>
    </main>
  )
}
