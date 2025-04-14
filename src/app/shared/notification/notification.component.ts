import {Component, Input} from '@angular/core';
import {SwalPortalTargets, SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    CommonModule,
    SweetAlert2Module
  ],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  @Input()
  title: string;

  public constructor(public readonly swalTargets: SwalPortalTargets) {
  }
}
