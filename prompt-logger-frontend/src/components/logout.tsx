// components/LogoutButton.tsx
import Cookies from 'js-cookie';
import { useContext } from 'react';
import HomeContext from '@/context/HomeContext';

type HomeContextType = {
  auth: any;
  setauth: any;
};

export default function LogoutButton () {
  const { auth, setauth } = useContext<HomeContextType>(HomeContext);

  const handleLogout = async () => {
    setauth(null);
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className='text-black'>
      Logout
    </button>
  );
};

