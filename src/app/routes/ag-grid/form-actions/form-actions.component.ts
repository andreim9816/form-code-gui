import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-actions.component.html'
})
export class FormActionsComponent implements ICellRendererAngularComp {
  formId!: number;
  disabled = false;
  params!: ICellRendererParams;

  constructor(private readonly router: Router) {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.formId = (params as any).formId;
    this.disabled = (params as any).disabled;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  openForm() {
    if (!this.disabled) {
      this.router.navigate(['/forms', this.formId]);
    }
  }
}
