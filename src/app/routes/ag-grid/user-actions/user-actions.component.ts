import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {CommonModule} from '@angular/common';
import {User} from '../../../model/User';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserEditRolesComponent} from '../../users/user-edit-roles/user-edit-roles.component';

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
  rolesPerCompany: any[];

  constructor(
    private readonly dialog: MatDialog) {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.user = this.params.data;
    this.rolesPerCompany = this.params.rolesPerCompany;
    console.log(this.user, this.rolesPerCompany);
  }

  onEditRolesClick(): void {
    const dialogRef = this.dialog.open(UserEditRolesComponent, {
      data: {
        user: this.user,
        rolesPerCompany: this.rolesPerCompany,
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
