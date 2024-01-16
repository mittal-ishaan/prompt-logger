import Image from 'next/image'
import { Chat } from '@/components/chat';
import { Dashboard } from '@/components/dashboard';
import { ResponsiveAppBar } from '@/components/navbar';

export default function Home() {
  return (
    <main>
      <ResponsiveAppBar act="dasboard"/>
      <Dashboard/>
    </main>
  )
}
