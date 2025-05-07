import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../service/AuthService';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../service/notification-service';
import {UserDto} from '../../dto/UserDto';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    MatLabel,
    MatError,
    MatButton,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  registerForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private readonly fb: FormBuilder,
              private readonly authService: AuthService,
              private readonly notificationService: NotificationService) {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.matchPasswords('password', 'confirmPassword'),
    });
  }

  matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: AbstractControl) => {
      const password = formGroup.get(passwordKey);
      const confirmPassword = formGroup.get(confirmPasswordKey);

      if (!password || !confirmPassword) return null;

      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({passwordMismatch: true});
      } else {
        confirmPassword.setErrors(null);
      }
      return null;
    };
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {...this.registerForm.value, file: this.selectedFile};
      console.log('Form Data:', formData);
      this.authService.register(formData).subscribe({
        next: (user: UserDto) => console.log(user),
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error.message;
          this.notificationService.displayNotificationError(errorMessage);
        }
      })
    }
  }
}
