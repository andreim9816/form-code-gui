import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../service/HttpService';
import {Subject, takeUntil} from 'rxjs';
import {Template} from '../../model/Template';
import {BreaklineComponent} from '../../shared/breakline/breakline.component';
import {CheckboxComponent} from '../../shared/checkbox/checkbox.component';
import {DateComponent} from '../../shared/date/date.component';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {NumberComponent} from '../../shared/number/number.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextComponent} from '../../shared/text/text.component';
import {ContentType} from '../../model/ContentType';

@Component({
  selector: 'app-create-form',
  imports: [
    BreaklineComponent,
    CheckboxComponent,
    DateComponent,
    MatButton,
    NgForOf,
    NgIf,
    NumberComponent,
    ReactiveFormsModule,
    TextComponent
  ],
  templateUrl: './create-form.component.html'
})
export class CreateFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  template: Template;
  templateId: number;

  form: FormGroup;

  readonly ContentType = ContentType;

  constructor(private readonly route: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly httpService: HttpService) {
  }

  ngOnInit() {
    this.templateId = Number(this.route.snapshot.paramMap.get('id')!);
    this.getTemplate(this.templateId);
    this.createFormGroup()
  }

  createFormGroup(): void {
    this.form = this.fb.group({
      companyCtrl: ['ANAF', Validators.required],
      formNameCtrl: ['', Validators.required]
    });
  }

  getTemplate(id: number) {
    this.httpService.getTemplate(id).pipe(takeUntil(this.destroy$))
      .subscribe(template => {
        this.template = template;
        console.log(this.template);
      })
  }

  submit(): void {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
