import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL} from '../util/URL';
import {Section} from '../model/Section';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  saveTemplate(body: any) {
    return this.http.post<Section[]>(`${URL.TEMPLATE_URL}`, body);
  }

  // getTemplate(id: number) {
  //   return this.http.post<UserDto>(URL.AUTH_URL + '/login', body);
  // }
}
