// components/LogoutButton.tsx
import Cookies from 'js-cookie';
import { useContext } from 'react';
import HomeContext, {HomeContextType} from '@/context/HomeContext';

export default function LogoutButton () {
  const { auth, setauth } = useContext<HomeContextType>(HomeContext);

  const handleLogout = async () => {
    setauth(null);
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className='bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded'>
      Logout
    </button>
  );
};

