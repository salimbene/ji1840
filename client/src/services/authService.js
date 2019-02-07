import http from './httpService';
import jwtDecode from 'jwt-decode';
import { apiUrl } from '../config.json';

const apiEndpoint = `${apiUrl}/auth`;

export function login(mail, password) {
  return http.post(apiEndpoint, { mail, password });
}

const authService = {};

const setToken = token => localStorage.setItem('screxpress-token', token);

authService.getToken = () => localStorage.getItem('screxpress-token');

const getTokenExpirationDate = token => {
  const decoded = jwtDecode(token);
  const { exp } = decoded;

  if (!exp) return null;

  return exp;
};

const isTokenExpired = token => {
  const tokenExpDate = getTokenExpirationDate(token);
  const now = Date.now() / 1000;

  return tokenExpDate < now;
};

authService.isLoggedIn = () => {
  const token = authService.getToken();
  return token && !isTokenExpired(token);
};

// authService.login = async password => {
//   const response = await axios.post(
//     '/api/login',
//     { password },
//     { validateStatus: s => s === 200 || s === 401 }
//   );
//   const { data } = response;

//   if (response.status === 200) setToken(data.token);

//   return data.auth === 'ok';
// };

export default authService;
