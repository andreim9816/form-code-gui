import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../service/AuthService';
import {Register2Component} from './register-2/register-2.component';
import {PersonalData} from '../../dto/PersonalData';
import {MatOption} from '@angular/material/core';
import {MatSelect, MatSelectTrigger} from '@angular/material/select';
import {NotificationService} from '../../service/notification-service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    MatButton,
    RouterLink,
    MatSelectTrigger,
    ReactiveFormsModule,
    Register2Component,
    MatOption,
    MatSelect
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  formGroup: FormGroup;
  step: 1 | 2 = 1;

  countries = [
    {
      id: 1,
      name: 'Romania',
      code: 'ro'
    }
  ];

  personalData: PersonalData;
  body: any;

  constructor(private readonly fb: FormBuilder,
              private readonly authService: AuthService,
              private readonly notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.createFormGroup();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      usernameCtrl: ['', [Validators.required, Validators.minLength(3)]],
      passwordCtrl: ['', [Validators.required, Validators.minLength(3)]],
      confirmPasswordCtrl: ['', Validators.required],
      emailCtrl: ['', [Validators.required, Validators.email]],
      phoneCtrl: ['', [Validators.required, Validators.pattern("07\\d{8}")]],
      fileCtrl: [null, Validators.required],
      countryIdCtrl: [1, Validators.required],
    }, {validators: this.passwordsMatchValidator})
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.formGroup.get('fileCtrl')!.setValue(input.files[0]);
    } else {
      this.formGroup.get('fileCtrl')!.setValue(null);
    }
  }

  submit(): void {
    if (this.formGroup.valid) {
      const body = {
        username: this.formGroup.get('usernameCtrl')!.value,
        password: this.formGroup.get('passwordCtrl')!.value,
        passwordConfirm: this.formGroup.get('confirmPasswordCtrl')!.value,
        email: this.formGroup.get('emailCtrl')!.value,
        phoneNumber: this.formGroup.get('phoneCtrl')!.value,
      };

      this.authService.extractData(body)
        .subscribe({
          next: (personalData: PersonalData) => {
            this.personalData = personalData;
            this.body = body;
            this.step = 2;
          },
          error: (err: HttpErrorResponse) => {
            const errorMessage = err.error.message;
            this.notificationService.displayNotificationError(errorMessage);
          }
        });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('passwordCtrl')?.value;
    const confirmPassword = group.get('confirmPasswordCtrl')?.value;
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : {mismatch: true};
  }

  get selectedCountry() {
    const selectedId = this.formGroup.get('countryIdCtrl')?.value;
    return this.countries.find(c => c.id === selectedId);
  }
}
