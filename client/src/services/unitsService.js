import http from './httpService';

const apiEndpoint = '/funits';

function unitUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUnits() {
  return http.get(apiEndpoint);
}

export function getUnit(unitId) {
  return http.get(unitUrl(unitId));
}

export function getUnitsOwnedBy(userId) {
  return http.get(unitUrl(`ownedby/${userId}`));
}

export function deleteUnit(unitId) {
  return http.delete(unitUrl(unitId));
}

// export function updateUnit(unit) {
//   return http.put(unitUrl(unit._id), unit);
// }

export function saveUnit(unit) {
  if (unit._id) {
    const body = { ...unit };
    delete body._id;
    return http.put(unitUrl(unit._id), body);
  }
  return http.post(apiEndpoint, unit);
}
