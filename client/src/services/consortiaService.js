import http from './httpService';

const apiEndpoint = '/consortia';

function url(id) {
  return `${apiEndpoint}/${id}`;
}

export function getConsortia() {
  return http.get(apiEndpoint);
}

export function saveConsortia(consortia) {
  if (consortia._id) {
    const body = { ...consortia };
    delete body._id;
    return http.put(url(consortia._id), body);
  }
  return http.post(apiEndpoint, consortia);
}
