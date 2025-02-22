import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from '../../service/AuthService';
import {StorageService} from '../../service/StorageService';
import {UserDto} from '../../dto/UserDto';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {UserType} from '../../model/UserType';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userType: UserType;
  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
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
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const body = {
        username: 'user2',
        password: 'password2'
      };

      this.authService.loginUser(body).subscribe({
          next: (userDto: UserDto) => {
            this.storageService.saveUser(userDto);
            this.userType = userDto.userType;
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.router.navigateByUrl('/template')
          },
          error: (err: any) => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
          }
        }
      );
    }
  }
}
