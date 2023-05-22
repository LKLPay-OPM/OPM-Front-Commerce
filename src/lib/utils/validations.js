export function onlyDecimals(e){
  const valor = e.target.value;
  return e.target.value = valor.replace(/[^0-9]/g, '');
}