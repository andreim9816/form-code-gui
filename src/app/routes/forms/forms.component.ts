import {Component, OnInit} from '@angular/core';
import {Form} from '../../model/Form';
import {HttpService} from '../../service/HttpService';
import type {ColDef} from 'ag-grid-community';
import {FormActionsComponent} from '../ag-grid/form-actions/form-actions.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {CommonModule, NgForOf, NgTemplateOutlet} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Template} from '../../model/Template';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../service/notification-service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    CommonModule,
    MatTabGroup,
    MatTab,
    MatCard,
    NgForOf,
    MatCardSubtitle,
    MatCardTitle,
    MatCardActions,
    NgTemplateOutlet,
    MatCardHeader,
    MatCardContent,
    MatExpansionPanelTitle,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatFormField,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatButton,
    MatLabel
  ],
  templateUrl: './forms.component.html'
})
export class FormsComponent implements OnInit {
  forms: Form[];
  myForms: Form[];
  assignedForms: Form[];
  templates: Template[];

  formGroup: FormGroup;

  // destroy$ = new Subject<void>();

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  constructor(private readonly httpService: HttpService,
              private readonly sanitizer: DomSanitizer,
              private readonly notificationService: NotificationService,
              private readonly fb: FormBuilder,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.getMyForms();
    this.getAssignedForms();
    this.getTemplatesForCompany();
  }

  createFormGroup(): void {
    this.formGroup = this.fb.group({
      templateIdCtrl: ['', Validators.required]
    })
  }

  getMyForms(): void {
    this.httpService.getForms(true, false)
      .subscribe(forms => {
        this.forms = forms;
        this.myForms = forms;
      })
  }

  getAssignedForms(): void {
    this.httpService.getForms(false, true)
      .subscribe(forms => {
        this.assignedForms = forms;
      })
  }

  getTemplatesForCompany(): void {
    this.httpService.getTemplatesForCompany()
      .subscribe(templates => {
        this.templates = templates;
      });
  }

  getStatus(form: Form): SafeHtml {
    if (FormsComponent.isValidationState(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge bg-primary">Pending validation</span>`);
    }
    if (FormsComponent.isUsersTurnState(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge bg-secondary">Waiting for user input</span>`);
    }
    if (FormsComponent.isFinished(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge bg-success">Finished</span>`);
    }
    return '';
  }

  public static isValidationState(form: Form): boolean {
    return form.currentValidationSectionId === form.currentSectionId
      && form.currentValidationSectionId !== null
      && form.currentValidationSectionId !== undefined;
  }

  public static isFinished(form: Form) {
    return form.finishedDate !== null && form.finishedDate !== undefined;
  }

  public static isUsersTurnState(form: Form): boolean {
    return !FormsComponent.isValidationState(form) && !FormsComponent.isFinished(form);
  }

  openForm(form: Form) {
    this.router.navigate(['/forms', form.id]);
  }

  onSubmitStartNewForm(): void {
    const templateId = this.formGroup.controls['templateIdCtrl'].value;
    this.httpService.createForm(templateId)
      .subscribe({
        next: form => {
          this.router.navigate(['/forms', form.id]);
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error.message;
          this.notificationService.displayNotificationError(errorMessage);
        }
      });
  }
}
