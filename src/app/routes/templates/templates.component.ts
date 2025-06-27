import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {CommonModule, formatDate, NgForOf, registerLocaleData} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {Template} from '../../model/Template';
import localeRo from '@angular/common/locales/ro';
import {HttpService} from '../../service/HttpService';
import {Router} from '@angular/router';

registerLocaleData(localeRo);

@Component({
  selector: 'app-templates',
  imports: [
    CommonModule,
    MatButton,
    NgForOf,
    ReactiveFormsModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ro-RO'}
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.css'
})
export class TemplatesComponent implements OnInit {

  templates: Template[];

  constructor(private readonly httpService: HttpService,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates(): void {
    this.httpService.getTemplates()
      .subscribe((templates: Template[]) => {
        this.templates = templates;
      })
  }


  formatDate(date: Date) {
    return formatDate(date, 'dd MMMM yyyy', 'ro-RO');
  }

  openTemplate(template: Template): void {
    this.router.navigate(['templates', template.id]);
  }
}
