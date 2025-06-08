import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatButton} from '@angular/material/button';
import {PersonalData} from '../../../dto/PersonalData';
import {AuthService} from '../../../service/AuthService';
import {NotificationService} from '../../../service/notification-service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register-2',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    RouterLink,
  ],
  templateUrl: './register-2.component.html'
})
export class Register2Component {
  @Input()
  personalData: PersonalData;
  @Input()
  body: any;
  @Input()
  step: 1 | 2;
  @Output()
  stepChange = new EventEmitter<1 | 2>();

  constructor(private readonly authService: AuthService,
              private readonly notificationService: NotificationService,
              private router: Router
  ) {
  }

  register(): void {
    this.authService.register(this.body).subscribe({
        next: data => {
          const message = 'Account created with success. You can login now.';
          this.notificationService.displayNotificationMessage(message);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          const message = 'Something went wrong when registering your account. Please refresh and try again!';
          this.notificationService.displayNotificationError(message);
        }
      }
    );
  }

  returnToPrevious(): void {
    this.stepChange.emit(1);
  }
}
