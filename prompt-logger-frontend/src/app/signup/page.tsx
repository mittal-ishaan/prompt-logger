'use client';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React, { FormEvent, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignup = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (!response.ok) {
        toast.error('Username already exists');
        return false;
      }
      toast.success('Signed up successfully');
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Signup failed. Please try again.');
      return false;
    }
  };
  
  const handleLogin = async () => {
    try {
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      const data = await loginRes.json();
  
      if (data.access_token) {
        Cookies.set('access_token', data.access_token);
        router.push('/');
        toast.success('Logged in successfully');
      } else {
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please try again.');
    }
  };
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    const isSignupSuccessful = await handleSignup();
  
    if (isSignupSuccessful) {
      await handleLogin();
    }
  };  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
    <div className="mx-auto max-w-[350px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-500 dark:text-gray-400">Create your account by filling the form below</p>
      </div>
      <div>
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
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link className="underline" href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
    </div>
  )
}
