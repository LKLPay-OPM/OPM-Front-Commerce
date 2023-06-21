export function ticketTypeHandler (type){
  console.log(type)
  if(type === "transaction"){
    return "Aclaración en Transacción";
  }
  if(type === "rolls"){
    return "Solicitud de Rollos";
  }
} 