import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {Company} from '../../../model/Company';

@Component({
  selector: 'app-company-roles',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './company-roles.component.html'
})
export class CompanyRolesComponent implements ICellRendererAngularComp {
  params: any;
  company: Company;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.company = this.params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
