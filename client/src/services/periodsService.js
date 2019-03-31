import http from './httpService';

const apiEndpoint = '/periods';

function url(id) {
  return `${apiEndpoint}/${id}`;
}

export function getPeriods() {
  return http.get(apiEndpoint);
}

export function getPeriod(periodId) {
  return http.get(url(periodId));
}

export function deletePeriod(periodId) {
  return http.delete(url(periodId));
}

export function savePeriod(period) {
  const body = { ...period };
  delete body._id;
  return http.put(url(period._id), body);
}

export function initPeriod(period) {
  return http.post(apiEndpoint, period);
}
