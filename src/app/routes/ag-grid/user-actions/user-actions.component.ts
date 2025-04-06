import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {CommonModule} from '@angular/common';
import {User} from '../../../model/User';
import {MatDialog} from '@angular/material/dialog';
import {UserEditRolesComponent} from '../../users/user-edit-roles/user-edit-roles.component';
import {HttpService} from '../../../service/HttpService';
import {Company} from '../../../model/Company';
import {RolesPerCompany} from '../../users/users.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-actions.component.html',
})
export class UserActionsComponent implements ICellRendererAngularComp {
  params: any;
  user: User;
  rolesPerCompany: RolesPerCompany[];
  allCompanies: Company[];

  constructor(
    private readonly dialog: MatDialog,
    private readonly httpService: HttpService) {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.user = this.params.data;
    this.rolesPerCompany = this.params.rolesPerCompany;
    (this.params.allCompanies$ as Observable<Company[]>).subscribe(data =>
      this.allCompanies = data
    )
  }

  onEditRolesClick(): void {
    const dialogRef = this.dialog.open(UserEditRolesComponent, {
      data: {
        user: this.user,
        rolesPerCompany: this.rolesPerCompany,
        allCompanies: this.allCompanies
      },
      width: '500px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  refresh(): boolean {
    return false;
  }
}
