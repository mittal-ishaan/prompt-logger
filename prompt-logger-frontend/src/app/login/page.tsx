'use client';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React, { FormEvent, useState, useContext } from "react";
import Cookies from "js-cookie";
import HomeContext, {HomeContextType} from '@/context/HomeContext'


export default function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { auth, setauth } = useContext<HomeContextType>(HomeContext);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try{
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      setauth(data);
      if (data.access_token) {
        Cookies.set('access_token', data.access_token);
        window.location.href = '/';
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }


  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="mx-auto w-[350px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your username and password to login to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" 
              required 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"/>
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?
          <Link className="underline" href="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
