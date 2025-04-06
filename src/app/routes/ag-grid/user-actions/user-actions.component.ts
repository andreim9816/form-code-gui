import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {CommonModule} from '@angular/common';
import {Company} from '../../../model/Company';
import {User} from '../../../model/User';
import {MatDivider} from '@angular/material/divider';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatSelect,
    MatOption,
    MatMenuItem
  ],
  templateUrl: './user-actions.component.html',
})
export class UserActionsComponent implements ICellRendererAngularComp {
  params: any;
  allCompanies: Company[];
  userCompanies: Company[];
  user: User;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.user = this.params.data;
    this.params.allCompanies.subscribe((companies: Company[]) => {
      this.allCompanies = companies;
      console.log(this.allCompanies);
    })
    this.userCompanies = this.mapCompaniesToRoles(this.user.companies, this.user.companyRoles);
    console.log(this.userCompanies);
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

  refresh(): boolean {
    return false;
  }
}
