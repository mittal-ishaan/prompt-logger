// components/LogoutButton.tsx
import Cookies from 'js-cookie';
import { useContext } from 'react';
import HomeContext, {HomeContextType} from '@/context/HomeContext';
import { useRouter } from 'next/navigation';
export default function LogoutButton () {
  const { auth, setauth } = useContext<HomeContextType>(HomeContext);
  const router = useRouter();
  const handleLogout = async () => {
    setauth(null);
    Cookies.remove('access_token');
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className='bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded'>
      Logout
    </button>
  );
};

