import Toastify from 'toastify-js';
import { danger } from '$lib/constants/colors'

export const toast = (text, color) => {
  return Toastify({
    text,
    duration: 3000,
    close: false,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: color,
      color: 'white'
    },
  })
}

export const tryAgainErrorToast = () => {
  toast("Ocurrió un error, intenta de nuevo", danger).showToast();
}

