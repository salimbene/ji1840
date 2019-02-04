import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = `${apiUrl}/users`;

export function getUsers() {
  return http.get(apiEndpoint);
}

export function getUser(userId) {
  return http.get(`${apiEndpoint}/${userId}`);
}

export function deleteUser(userId) {
  return http.delete(`${apiEndpoint}/${userId}`);
}

export function updateUser(user) {
  return http.put(apiEndpoint, user);
}

export function addUser(user) {
  return http.post(apiEndpoint, user);
}
