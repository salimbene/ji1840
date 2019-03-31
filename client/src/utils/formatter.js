// Create our number formatter.
export function currency(ammount) {
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  });
  return formatter.format(ammount);
}
