import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../service/AuthService';
import {StorageService} from '../../service/StorageService';
import {UserDto} from '../../dto/UserDto';
import {MatButton} from '@angular/material/button';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  selectedFile: File;

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
    console.log(this.loginForm);
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
