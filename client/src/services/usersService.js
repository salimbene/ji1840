import http from './httpService';

const apiEndpoint = '/users';

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndpoint);
}

export function getUser(userId) {
  return http.get(userUrl(userId));
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}

export function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(userUrl(user._id), body);
  }
  return http.post(apiEndpoint, user);
}

export function register(user) {
  return http.post(apiEndpoint, {
    mail: user.username,
    password: user.password
  });
}
