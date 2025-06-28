import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {URL} from '../util/URL';
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

  ///////////////////// Form Section /////////////////////
  downloadFile(fileId: number) {
    return this.http.get(`${URL.FORM_SECTIONS_URL}/files/${fileId}`,
      {
        responseType: 'blob',
        observe: 'response'
      });
  }

  uploadFiles(formData: FormData) {
    return this.http.post<any>(`${URL.FORM_SECTIONS_URL}/files`, formData);
  }


  ///////////////////// Company /////////////////////

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${URL.COMPANIES_URL}/${id}`);
  }

  getCompanies(createTemplate: boolean = false): Observable<Company[]> {
    const params = new HttpParams()
      .set('createTemplate', createTemplate);
    return this.http.get<Company[]>(`${URL.COMPANIES_URL}`, {params});
  }

  createCompany(body: any): Observable<Company> {
    return this.http.post<Company>(`${URL.COMPANIES_URL}`, body);
  }

  updateCompany(companyId: number, body: any): Observable<Company> {
    return this.http.patch<Company>(`${URL.COMPANIES_URL}/${companyId}`, body);
  }

  ///////////////////// Template /////////////////////
  createTemplate(body: any) {
    return this.http.post<Template>(`${URL.COMPANIES_URL}/templates`, body);
  }

  updateTemplate(templateId: number, body: any) {
    return this.http.put<Template>(`${URL.COMPANIES_URL}/templates/${templateId}`, body);
  }

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${URL.TEMPLATE_URL}`);
  }

  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${URL.TEMPLATE_URL}/${id}`);
  }

  getTemplatesForCompany(): Observable<Template[]> {
    return this.http.get<Template[]>(`${URL.COMPANIES_URL}/templates`);
  }

  ///////////////////// Form /////////////////////
  createForm(templateId: number): Observable<Form> {
    return this.http.post<Form>(`${URL.TEMPLATE_URL}/${templateId}/forms`, null);
  }

  getForms(createdByMe: boolean, assignedToMe: boolean): Observable<Form[]> {
    const params = new HttpParams()
      .set('createdByMe', createdByMe)
      .set('assignedToMe', assignedToMe);
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
  getCompanyRoles(): Observable<CompanyRole[]> {
    return this.http.get<CompanyRole[]>(`${URL.COMPANIES_URL}/roles`);
  }

  saveCompanyRolesForUser(userId: number, companyRoleIds: number[]): Observable<User> {
    return this.http.patch<User>(`${URL.USER_URL}/${userId}/roles`, companyRoleIds);
  }

  ///////////////////// Users /////////////////////
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${URL.USER_URL}`);
  }
}
