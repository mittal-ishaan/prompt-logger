'use client';
import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie';

export type HomeContextType = {
  auth: any;
  setauth: any;
  activeConversation: any;
  setActiveConversation: any;
};

const HomeContext = createContext<HomeContextType>({ auth: null, setauth: null, activeConversation: null, setActiveConversation: null });
//
export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setauth] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);

  const ContextData = {
    auth,
    setauth,
    activeConversation,
    setActiveConversation,
  }


  return (
    <HomeContext.Provider value={ContextData}>
      {children}
    </HomeContext.Provider>
  )
}
export default HomeContext