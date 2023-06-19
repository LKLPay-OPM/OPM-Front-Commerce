/**
 * Función para contar texto y agregar 3 puntos al final
 * @param {string} text
 * @param {number} end
 */
export function cutString(text, end) {
  if(text.length <= end){
    return text;
  }
  return `${text.slice(0, end)}...`
}