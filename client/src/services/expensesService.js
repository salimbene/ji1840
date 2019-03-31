import http from './httpService';

const apiEndpoint = '/expenses';

function expUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getTotalExpenses(period) {
  const { data } = await http.get(`${apiEndpoint}/period/${period}`);

  let totalA = 0;
  let totalB = 0;
  data.length !== 0 &&
    data !== null &&
    data.forEach(element => {
      if (element._id === 'A') totalA = element.total;
      if (element._id === 'B') totalB = element.total;
    });

  return { totalA, totalB };
}

export function getExpenses() {
  return http.get(apiEndpoint);
}
export function getExpensesByPeriod(period) {
  return http.get(`${apiEndpoint}/period/${period}`);
}

export function getExpensesTotalByPeriod(period) {
  return http.get(`${apiEndpoint}/total/${period}`);
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
