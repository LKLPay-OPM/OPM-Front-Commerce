export function ticketStatusClass (status){
  if(status === "Abierto"){
    return "normal";
  }
  if(status === "Cerrado"){
    return "success";
  }
  if(status === "Error"){
    return "error";
  }
  if(status === "Advertencia"){
    return "warning";
  }
  if(status === "Info"){
    return "info";
  }
  return "normal";
} 