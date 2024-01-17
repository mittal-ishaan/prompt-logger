// // hooks/useAuth.js
// import { useMutation, useQuery, useQueryClient } from 'react-query';
// import Cookies from 'js-cookie';

// interface Credentials {
//     // Define your credential fields
//     username: string;
//     password: string;
// }

// const login = async (credentials: Credentials) => {
//     const response = await fetch('http://localhost:3000/auth/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       credentials
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   else{
//     const data = await response.json();
//     Cookies.set('access_token', data.token);
//     return data;
//   }
// };

// const logout = async () => {
//     // Remove the token from storage
    
//     // Optionally, invalidate the token server-side
//     const response = await fetch('http://localhost:3000/auth/logout', {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${Cookies.get('access_token')}`
//         },
//     });
//     Cookies.remove('access_token');
    
//     if (!response.ok) {
//         throw new Error('Failed to logout');
//     }
    
//     return response.json();
//     };

// export function checkAuth = async () => {
//     const token = Cookies.get('access_token');
    
//     if (!token) {
//         return null;
//     }
    
//     // Optionally, validate the token server-side
//     const response = await fetch('http://localhost:3000/auth/validate', {
//         headers: {
//         'Authorization': `Bearer ${token}`
//         },
//     });
    
//     if (!response.ok) {
//         throw new Error('Token validation failed');
//     }
    
//     return response.json();
// };

