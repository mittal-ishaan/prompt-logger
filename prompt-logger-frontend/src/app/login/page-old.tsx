'use client';
import React, { useState, FormEvent } from 'react';
import Cookies from 'js-cookie';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

      if (data.access_token) {
        // Save the JWT to cookies or local storage here
        Cookies.set('access_token', data.access_token);
        Cookies.set('refresh_token', data.refresh_token);
        // Redirect to home page or dashboard
        window.location.href = '/';
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }


  };

  return (
    <form onSubmit={handleSubmit} className='text-black'>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" className='text-white'>Log In</button>
    </form>
  );
};

export default LoginPage;