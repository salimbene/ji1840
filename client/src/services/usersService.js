import http from './httpService';

const apiEndpoint = '/users';

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

export function register(user) {
  return http.post(apiEndpoint, {
    mail: user.username,
    password: user.password
  });
}
