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
    this.httpService.getTemplatesForCompanyId(1) //todo !!!!!!!!!!!!!! this should be taken from backend
      .subscribe(templates => {
        this.templates = templates;
      });
  }

  colDefs: ColDef[] = [
    {headerName: 'Id', field: 'id'},
    {headerName: 'Company', field: 'template.companyName'},
    {headerName: 'Form name', field: 'template.title'},
    {headerName: 'Form description', field: 'template.description'},
    {headerName: 'Created date', field: 'createdDate', type: 'date'},
    // {headerName: 'Last modified date', field: ''}
    {
      headerName: 'Created by',
      valueGetter: (params: any) => `${params.data.creatorUser.lastname} ${params.data.creatorUser.firstname}`
    },
    {
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const form = params.data;
        if (this.isValidationState(form)) {
          return `<span class="p-2 badge bg-primary">Pending validation</span>`
        }
        if (this.isUsersTurnState(form)) {
          return `<span class="p-2 badge bg-secondary">Waiting for user input</span>`
        }
        // technically this can never be true because these forms will not be displayed here
        if (this.isFinished(form)) {
          return `<span class="p-2 badge bg-success">Finished</span>`
        }
        return '';
      }
    },
    {
      headerName: 'Action',
      cellRenderer: FormActionsComponent,
      cellRendererParams: (params: any) => ({
        formId: params.data.id,
        disabled: !this.isValidationState(params.data)
      })
    }
  ];

  getStatus(form: Form): SafeHtml {
    if (this.isValidationState(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge bg-primary">Pending validation</span>`);
    }
    if (this.isUsersTurnState(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge bg-secondary">Waiting for user input</span>`);
    }
    // technically this can never be true because these forms will not be displayed here
    if (this.isFinished(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge bg-success">Finished</span>`);
    }
    return '';
  }

  isValidationState(form: Form): boolean {
    return form.currentValidationSectionId === form.currentSectionId;
  }

  isFinished(form: Form) {
    return form.currentValidationSectionId == null || form.currentSectionId == null;
  }

  isUsersTurnState(form: Form): boolean {
    return !this.isValidationState(form) && !this.isFinished(form);
  }

  openForm(form: Form) {
    this.router.navigate(['/forms', form.id]);
  }

  onSubmitStartNewForm(): void {
    const templateId = this.formGroup.controls['templateIdCtrl'].value;
    this.httpService.createForm(templateId)
      .subscribe(form => {
        this.router.navigate(['/forms', form.id]);
      });
  }
}
