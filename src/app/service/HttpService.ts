import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL} from '../util/URL';
import {Section} from '../model/Section';
import {Template} from '../model/Template';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  saveTemplate(body: any) {
    return this.http.post<Section[]>(`${URL.TEMPLATE_URL}`, body);
  }

  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${URL.TEMPLATE_URL}/${id}`);
  }
}
