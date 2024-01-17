// components/LogoutButton.tsx
import Cookies from 'js-cookie';

export default function LogoutButton () {
  const handleLogout = async () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className='text-black'>
      Logout
    </button>
  );
};

