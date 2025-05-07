import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from '../../service/AuthService';
import {StorageService} from '../../service/StorageService';
import {UserDto} from '../../dto/UserDto';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatButton
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(private readonly fb: FormBuilder,
              private readonly authService: AuthService,
              private readonly storageService: StorageService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      usernameCtrl: [null, Validators.required],
      passwordCtrl: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const body = {
        username: this.loginForm.controls['usernameCtrl'].value,
        password: this.loginForm.controls['passwordCtrl'].value,
      };
      this.authService.loginUser(body).subscribe({
          next: (userDto: UserDto) => {
            this.storageService.saveUser(userDto);
            this.router.navigateByUrl('/forms')
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = err.error.message;
          }
        }
      );
    }
  }
}
