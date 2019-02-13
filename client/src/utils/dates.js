import _ from 'lodash';

const today = new Date();
export const monthLabels = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;

  return _(items)
    .slice(startIndex)
    .take(pageSize)
    .value();
}

export function getCurrentPeriod() {
  // return `${monthLabels[today.getMonth()]} ${today.getFullYear()}`;
  return {
    year: today.getFullYear(),
    month: monthLabels[today.getMonth()]
  };
}

export function getPeriod(day) {
  return `${monthLabels[day.getMonth()]} ${day.getFullYear()}`;
}

export function getLastXMonths(n = 12) {
  let d;
  let xMonths = [];

  for (let i = 0; i < n; i += 1) {
    d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    let period = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`;
    xMonths.push(period);
  }
  return xMonths;
}

export function getLastXYears(n = 12) {
  let d;
  let xMonths = [];

  for (let i = 0; i < n; i += 1) {
    d = new Date(today.getFullYear() - i, today.getMonth(), 1);
    let period = `${d.getFullYear()}`;
    xMonths.push(period);
  }
  return xMonths;
}

export function formatDate(date) {
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const response = new Date(date);
  return response.toLocaleDateString('en-GB'); // 9/17/2016
}

export default {
  paginate,
  getCurrentPeriod,
  getLastXMonths,
  getLastXYears,
  getPeriod,
  formatDate,
  monthLabels
};