import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BreaklineComponent} from '../../shared/breakline/breakline.component';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {ContentType} from '../../model/ContentType';
import {Form} from '../../model/Form';
import {EditFormTextComponent} from '../edit-form-content/edit-form-text/edit-form-text.component';
import {EditFormNumberComponent} from '../edit-form-content/edit-form-number/edit-form-number.component';
import {EditFormDateComponent} from '../edit-form-content/edit-form-date/edit-form-date.component';

@Component({
  selector: 'app-edit-form',
  imports: [
    BreaklineComponent,
    FormsModule,
    MatButton,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    EditFormTextComponent,
    EditFormNumberComponent,
    EditFormDateComponent
  ],
  templateUrl: './edit-form.component.html'
})
export class EditFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  formGroup: FormGroup;
  form: Form;
  formId: number;

  constructor(private readonly route: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly httpService: HttpService) {
  }

  ngOnInit() {
    this.formId = Number(this.route.snapshot.paramMap.get('id')!);
    this.getFormById(this.formId);
    this.createFormGroup();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({})
  }

  getFormById(id: number) {
    this.httpService.getFormById(id).pipe(takeUntil(this.destroy$))
      .subscribe(form => {
        this.form = form;
        console.log(this.form);
      })
  }

  submit(): void {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  readonly ContentType = ContentType;
}
