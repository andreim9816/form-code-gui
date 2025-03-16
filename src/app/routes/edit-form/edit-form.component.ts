import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BreaklineComponent} from '../../shared/breakline/breakline.component';
import {CheckboxComponent} from '../../shared/checkbox/checkbox.component';
import {DateComponent} from '../../shared/date/date.component';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {NumberComponent} from '../../shared/number/number.component';
import {TextComponent} from '../../shared/text/text.component';
import {CreateStep} from '../../enum/CreateStep';
import {ContentType} from '../../model/ContentType';
import {Form} from '../../model/Form';

@Component({
  selector: 'app-edit-form',
  imports: [
    BreaklineComponent,
    CheckboxComponent,
    DateComponent,
    FormsModule,
    MatButton,
    NgForOf,
    NgIf,
    NumberComponent,
    TextComponent,
    ReactiveFormsModule
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

  readonly CreateFormStep = CreateStep;
  readonly ContentType = ContentType;
}
