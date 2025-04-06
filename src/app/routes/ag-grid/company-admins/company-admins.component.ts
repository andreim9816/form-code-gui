import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {CommonModule} from '@angular/common';
import {Company} from '../../../model/Company';

@Component({
  selector: 'app-company-admins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-admins.component.html'
})
export class CompanyAdminsComponent implements ICellRendererAngularComp {
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
