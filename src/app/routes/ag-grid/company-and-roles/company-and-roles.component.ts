import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-company-and-roles',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './company-and-roles.component.html'
})
export class CompanyAndRolesComponent implements ICellRendererAngularComp {
  params: any;
  rolesPerCompany: any[];

  agInit(params: any): void {
    this.params = params;
    this.rolesPerCompany = this.params.rolesPerCompany;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
