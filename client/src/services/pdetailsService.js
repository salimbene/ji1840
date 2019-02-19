import http from './httpService';

const apiEndpoint = '/pdetails';

function url(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPDetails() {
  return http.get(apiEndpoint);
}

export function getPDetailsByuserId(userId) {
  return http.get(`${apiEndpoint}/user/${userId}`);
}

export function getPDetail(id) {
  return http.get(url(id));
}

export function deletePDetails(id) {
  return http.delete(url(id));
}

export function savePDetails(details) {
  if (details._id) {
    const body = { ...details };
    delete body._id;
    return http.put(url(details._id), body);
  }
  return http.post(apiEndpoint, details);
}
