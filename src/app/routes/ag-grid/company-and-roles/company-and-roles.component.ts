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
  companies: any[];

  agInit(params: any): void {
    this.params = params;
    const data = this.params.data;
    this.companies = this.mapCompaniesToRoles(data.companies, data.companyRoles);
  }

  mapCompaniesToRoles(companies: any[], companyRoles: any[]): any[] {
    const groupedRoles = (companyRoles ?? []).reduce((acc, role) => {
      if (!acc[role.companyId]) {
        acc[role.companyId] = [];
      }
      acc[role.companyId].push(role);
      return acc;
    }, {} as Record<number, any[]>);

    return (companies ?? [])
      .filter(company => groupedRoles[company.id])
      .map(company => ({
        id: company.id,
        name: company.name,
        roles: groupedRoles[company.id] || []
      }));
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
