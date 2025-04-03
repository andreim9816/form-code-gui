import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {URL} from '../util/URL';
import {Section} from '../model/Section';
import {Template} from '../model/Template';
import {Observable} from 'rxjs';
import {Form} from '../model/Form';
import {FormSectionUpdate} from '../dto/request/FormSectionUpdate';
import {CompanyRole} from '../model/CompanyRole';
import {User} from '../model/User';
import {Company} from '../model/Company';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  ///////////////////// Company /////////////////////

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${URL.COMPANIES_URL}`);
  }

  ///////////////////// Template /////////////////////
  saveTemplate(companyId: number, body: any) {
    return this.http.post<Section[]>(`${URL.COMPANIES_URL}/${companyId}/templates`, body);
  }

  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${URL.TEMPLATE_URL}/${id}`);
  }

  ///////////////////// Form /////////////////////
  getForms(createdByMe: boolean, assignedToMe: boolean): Observable<Form[]> {
    const params = new HttpParams()
      .set('assignedToMe', assignedToMe)
      .set('createdByMe', createdByMe);
    return this.http.get<Form[]>(`${URL.FORM_URL}`, {params});
  }

  getFormById(id: number): Observable<Form> {
    return this.http.get<Form>(`${URL.FORM_URL}/${id}`);
  }

  updateForm(body: FormSectionUpdate): Observable<any> {
    return this.http.patch<Form>(`${URL.FORM_SECTIONS_URL}`, body);
  }

  rejectForm(body: FormSectionUpdate): Observable<any> {
    return this.http.patch<Form>(`${URL.FORM_SECTIONS_URL}/reject`, body);
  }

  ///////////////////// Company Role /////////////////////
  getCompanyRoleByCompanyId(companyId: number): Observable<CompanyRole[]> {
    return this.http.get<CompanyRole[]>(`${URL.COMPANIES_URL}/${companyId}/roles`);
  }

  ///////////////////// Users /////////////////////
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${URL.USER_URL}`);
  }
}
