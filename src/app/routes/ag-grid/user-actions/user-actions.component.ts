import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [],
  templateUrl: './user-actions.component.html',
})
export class UserActionsComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

}
