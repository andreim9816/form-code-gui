import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL} from '../util/URL';
import {Section} from '../model/Section';
import {Template} from '../model/Template';
import {Observable} from 'rxjs';
import {Form} from '../model/Form';
import {FormSectionUpdate} from '../dto/request/FormSectionUpdate';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  saveTemplate(companyId: number, body: any) {
    return this.http.post<Section[]>(`${URL.COMPANIES_URL}/${companyId}/templates`, body);
  }

  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${URL.TEMPLATE_URL}/${id}`);
  }

  getFormById(id: number): Observable<Form> {
    return this.http.get<Form>(`${URL.FORM_URL}/${id}`);
  }

  updateForm(body: FormSectionUpdate): Observable<any> {
    return this.http.patch<Form>(`${URL.FORM_SECTIONS_URL}`, body);
  }
}
