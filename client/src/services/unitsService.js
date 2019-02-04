import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = `${apiUrl}/funits`;

export function getUnits() {
  return http.get(apiEndpoint);
}

export function getUnit(unitId) {
  return http.get(`${apiEndpoint}/${unitId}`);
}

export function deleteUnit(unitId) {
  return http.delete(`${apiEndpoint}/${unitId}`);
}

export function updateUnit(unit) {
  return http.put(apiEndpoint, unit);
}

export function addUnit(unit) {
  return http.post(apiEndpoint, unit);
}
