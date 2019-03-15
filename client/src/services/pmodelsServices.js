import http from './httpService';

const apiEndpoint = '/pmodels';

function supUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getModels() {
  return http.get(apiEndpoint);
}

export function getModel(supId) {
  return http.get(supUrl(supId));
}

export function deleteModel(supId) {
  return http.delete(supUrl(supId));
}

export function saveModel(sup) {
  if (sup._id) {
    const body = { ...sup };
    delete body._id;
    return http.put(supUrl(sup._id), body);
  }
  return http.post(apiEndpoint, sup);
}
