import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-edit-btn',
  imports: [
    MatButton
  ],
  templateUrl: './edit-btn.component.html'
})
export class EditBtnComponent implements ICellRendererAngularComp {
    agInit(params: ICellRendererParams<any, any, any>): void {
    }
    refresh(params: ICellRendererParams<any, any, any>): boolean {
      return false;
    }

}
