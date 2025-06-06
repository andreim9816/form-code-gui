import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {Form} from '../../model/Form';
import {HttpService} from '../../service/HttpService';
import {CommonModule, formatDate, NgForOf, NgTemplateOutlet, registerLocaleData} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Template} from '../../model/Template';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../service/notification-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {FormSectionStatus} from '../../enum/FormSectionStatus';
import localeRo from '@angular/common/locales/ro';

registerLocaleData(localeRo);

@Component({
  selector: 'app-forms',
  standalone: true,
  providers: [
    {provide: LOCALE_ID, useValue: 'ro-RO'}
  ],
  imports: [
    CommonModule,
    NgForOf,
    NgTemplateOutlet,
    MatExpansionPanelTitle,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatButton,
    MatProgressBar
  ],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  forms: Form[];
  myForms: Form[];
  assignedForms: Form[];
  templates: Template[];

  formGroup: FormGroup;

  selectedTab: 'my-forms' | 'assigned-forms' = 'my-forms';

  // destroy$ = new Subject<void>();

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50];

  constructor(private readonly httpService: HttpService,
              private readonly sanitizer: DomSanitizer,
              private readonly notificationService: NotificationService,
              private readonly fb: FormBuilder,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.getMyForms();
    this.getAssignedForms();
    this.getTemplatesForCompany();
  }

  createFormGroup(): void {
    this.formGroup = this.fb.group({
      templateIdCtrl: ['', Validators.required]
    })
  }

  getMyForms(): void {
    this.httpService.getForms(true, false)
      .subscribe(forms => {
        this.forms = forms;
        this.myForms = forms;
      })
  }

  getAssignedForms(): void {
    this.httpService.getForms(false, true)
      .subscribe(forms => {
        this.assignedForms = forms;
      })
  }

  getTemplatesForCompany(): void {
    this.httpService.getTemplatesForCompany()
      .subscribe(templates => {
        this.templates = templates;
      });
  }

  getStatus(form: Form): SafeHtml {
    if (FormsComponent.isValidationState(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge" style="background-color: #FFF7E9; color:#FCAC29; font-size: 13px">Pending validation</span>`);
    }
    if (FormsComponent.isUsersTurnState(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge my-badge">Waiting for user input</span>`);
    }
    if (FormsComponent.isFinished(form)) {
      return this.sanitizer.bypassSecurityTrustHtml(`<span class="p-2 badge" style="background-color: #F5FCEA; color:#72D331; font-size: 13px">Finished</span>`);
    }
    return '';
  }

  public static isValidationState(form: Form): boolean {
    return form.currentValidationSectionId === form.currentSectionId
      && form.currentValidationSectionId !== null
      && form.currentValidationSectionId !== undefined;
  }

  public static isFinished(form: Form) {
    return form.finishedDate !== null && form.finishedDate !== undefined;
  }

  public static isUsersTurnState(form: Form): boolean {
    return !FormsComponent.isValidationState(form) && !FormsComponent.isFinished(form);
  }

  openForm(form: Form) {
    this.router.navigate(['/forms', form.id]);
  }

  onSubmitStartNewForm(): void {
    const templateId = this.formGroup.controls['templateIdCtrl'].value;
    this.httpService.createForm(templateId)
      .subscribe({
        next: form => {
          this.router.navigate(['/forms', form.id]);
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error.message;
          this.notificationService.displayNotificationError(errorMessage);
        }
      });
  }

  getPercent(form: Form) {
    if (FormsComponent.isFinished(form)) {
      return 100;
    }
    const total = form.formSections
      .filter(formSection => formSection.status !== FormSectionStatus.IS_VALIDATION_SECTION).length;
    const validatedYetNr = form.formSections.filter(x => x.status === FormSectionStatus.VALIDATED).length;

    return parseFloat(String(validatedYetNr / total * 100)).toFixed(0);
  }

  formatDate(date: Date) {
    return formatDate(date, 'dd MMMM yyyy', 'ro-RO');
  }

  /*********************************************************************************************************
   *                                            My forms                                                   *
   /********************************************************************************************************/

  getWaitingForUserInputNumber(): number {
    if (!this.forms) {
      return 0;
    }
    return this.forms.filter(x => FormsComponent.isUsersTurnState(x)).length
  }

  getWaitingForValidationNumber(): number {
    if (!this.forms) {
      return 0;
    }
    return this.forms.filter(x => FormsComponent.isValidationState(x)).length
  }

  getFinishedNumber(): number {
    if (!this.forms) {
      return 0;
    }
    return this.forms.filter(x => FormsComponent.isFinished(x)).length
  }

  /*********************************************************************************************************
   *                                            Assigned forms                                             *
   /*******************************************************************************************************/

  getAssignedFormsNumber(): number {
    return this.getWaitingForValidation() + 3;
  }

  getValidatedFormsNumber(): number {
    const assignedFormsNr = this.getAssignedFormsNumber();
    if (assignedFormsNr > 3) {
      return assignedFormsNr - 2;
    } else {
      return Math.max(0, assignedFormsNr - 1);
    }
  }

  getWaitingForValidation(): number {
    return this.assignedForms.length;
  }


}
