import http from './httpService';

const apiEndpoint = '/balances';

function epUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getBalances() {
  return http.get(apiEndpoint);
}

export function getBalance(balanceId) {
  return http.get(epUrl(balanceId));
}

export function deleteBalance(balanceId) {
  return http.delete(epUrl(balanceId));
}

export function saveBalance(balance) {
  if (balance._id) {
    const body = { ...balance };
    delete body._id;
    return http.put(epUrl(balance._id), body);
  }
  return http.post(apiEndpoint, balance);
}
