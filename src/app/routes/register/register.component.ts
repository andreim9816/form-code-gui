import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    MatButton,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  selectedFile: File;
  formGroup: FormGroup;

  constructor(private readonly fb: FormBuilder) {
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
      console.log(this.formGroup.value);
    } else {
      console.error(this.formGroup.controls);
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
}
