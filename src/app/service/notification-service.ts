import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  displayNotificationMessage(message: string): void {
    Swal.fire({
      customClass: {
        title: 'btn btn-success'
      },
      backdrop: false,
      position: "top-end",
      title: "Success",
      text: message,
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  displayNotificationError(errorMessage: string): void {
    Swal.fire({
      customClass: {
        title: 'btn btn-danger'
      },
      backdrop: false,
      position: "top-end",
      title: "Error",
      text: errorMessage,
      showCloseButton: true,
      showConfirmButton: false
    });
  }
}
