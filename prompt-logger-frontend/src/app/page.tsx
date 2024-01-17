'use client';
import { useContext, useEffect, useState } from "react"
import axios from "axios";
import { Chat } from '@/components/chat';
import { Dashboard } from '@/components/dashboard';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  const isAuthenticated = async () => {
    const token = Cookies.get('access_token');
    
    if (!token) {
        return false;
    }
    
    // Optionally, validate the token server-side
    const response = await fetch('http://localhost:8000/profile', {
        headers: {
        'Authorization': `Bearer ${token}`
        },
    });
    // if (!response.ok) {
    //     throw new Error('Token validation failed');
    // }
    
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
      <Chat />
    </main>
  )
}
