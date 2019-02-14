import http from './httpService';

const apiEndpoint = '/suppliers';

function supUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getSuppliers() {
  return http.get(apiEndpoint);
}

export function getSupplier(supId) {
  return http.get(supUrl(supId));
}

export function deleteSupplier(supId) {
  return http.delete(supUrl(supId));
}

export function saveSupplier(sup) {
  if (sup._id) {
    const body = { ...sup };
    delete body._id;
    return http.put(supUrl(sup._id), body);
  }
  return http.post(apiEndpoint, sup);
}
