import http from './httpService';
import jwtDecode from 'jwt-decode';
import { apiUrl } from '../config.json';
const apiEndpoint = `${apiUrl}/auth`;
const tokenKey = 'consortia-token';

//adding x-auth-token, if any, to the headers.
//Required to access protected api endpoints.
http.setJwt(getJwt());

export async function login(mail, password) {
  const { data: jwt } = await http.post(apiEndpoint, { mail, password });
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getJwt() {
  localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt
};

// const getTokenExpirationDate = token => {
//   const decoded = jwtDecode(token);
//   const { exp } = decoded;

//   if (!exp) return null;

//   return exp;
// };

// const isTokenExpired = token => {
//   const tokenExpDate = getTokenExpirationDate(token);
//   const now = Date.now() / 1000;

//   return tokenExpDate < now;
// };

// authService.isLoggedIn = () => {
//   const token = authService.getToken();
//   return token && !isTokenExpired(token);
// };

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
