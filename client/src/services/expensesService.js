import http from './httpService';

const apiEndpoint = '/expenses';

function expUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getExpenses() {
  return http.get(apiEndpoint);
}

export function getExpense(expId) {
  return http.get(expUrl(expId));
}

export function deleteExpense(expId) {
  return http.delete(expUrl(expId));
}

export function saveExpense(exp) {
  if (exp._id) {
    const body = { ...exp };
    delete body._id;
    return http.put(expUrl(exp._id), body);
  }
  return http.post(apiEndpoint, exp);
}
