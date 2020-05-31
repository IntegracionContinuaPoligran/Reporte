import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetService {

  constructor() { }

  mostrarAlerta(icono: SweetAlertIcon, texto: string, mostrarLoading: boolean) {

    Swal.fire({
      allowOutsideClick: false,
      icon: icono,
      text: texto
    });

    if (mostrarLoading) {
      Swal.showLoading();
    }

  }

  cerrarAlerta() {
    Swal.close();
  }

  mostrarToast() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: 'Credenciales Incorrectas'
    })
  }


}
