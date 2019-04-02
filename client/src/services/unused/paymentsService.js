import http from './httpService';

const apiEndpoint = '/payments';

function payUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getTotalPayments(period) {
  const { data } = await http.get(`${apiEndpoint}/period/${period}`);
  if (typeof data === 'object') return data;
  return {
    _id: period,
    total: 0
  };
}

export function getPayments() {
  return http.get(apiEndpoint);
}

export function getPaymentsByuserId(userId) {
  return http.get(`${apiEndpoint}/user/${userId}`);
}

export function getPayment(payId) {
  return http.get(payUrl(payId));
}

export function deletePayment(payId) {
  return http.delete(payUrl(payId));
}

export function savePayment(exp) {
  if (exp._id) {
    const body = { ...exp };
    delete body._id;
    return http.put(payUrl(exp._id), body);
  }
  return http.post(apiEndpoint, exp);
}
