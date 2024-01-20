'use client';
import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie';

export type HomeContextType = {
  auth: any;
  setauth: any;
  activeConversation: string | null;
  setActiveConversation: any;
  model: string | null;
  setModel: any;
};

const HomeContext = createContext<HomeContextType>({ auth: null, setauth: null, activeConversation: null, setActiveConversation: null, model: null, setModel: null });
//
export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setauth] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [model, setModel] = useState(null);
  const ContextData = {
    auth,
    setauth,
    activeConversation,
    setActiveConversation,
    model,
    setModel
  }


  return (
    <HomeContext.Provider value={ContextData}>
      {children}
    </HomeContext.Provider>
  )
}
export default HomeContext