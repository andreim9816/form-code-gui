import {Component, OnInit} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {Observable} from 'rxjs';
import {Form} from '../../model/Form';
import {HttpService} from '../../service/HttpService';
import type {ColDef} from 'ag-grid-community';
import {FormActionsComponent} from '../ag-grid/form-actions/form-actions.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  templateUrl: './forms.component.html'
})
export class FormsComponent implements OnInit {
  forms$: Observable<Form[]>;
  forms: Form[];

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  constructor(private readonly httpService: HttpService) {
  }

  ngOnInit(): void {
    const createdByMe = false;
    const assignedToMe = true;
    this.httpService.getForms(createdByMe, assignedToMe).subscribe(forms => {
      this.forms = forms;
    })
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
        if (this.isUserTurnState(form)) {
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
      // cellRenderer: (params: any) => {
      //   const form = params.data;
      //   const url = "/forms/" + form.id;
      //
      //   if (this.isValidationState(form)) {
      //     return `<button type="button" class="btn btn-info" routerLink=${url} routerLinkActive="active">Open</button>`;
      //   } else {
      //     return `<button type="button" class="btn btn-info disabled" disabled>Open</button>`
      //   }
      // }
    }
  ];

  isValidationState(form: Form): boolean {
    return form.currentValidationSectionId === form.currentSectionId;
  }

  isFinished(form: Form) {
    return form.currentValidationSectionId == null || form.currentSectionId == null;
  }

  isUserTurnState(form: Form): boolean {
    return !this.isValidationState(form) && !this.isFinished(form);
  }
}
