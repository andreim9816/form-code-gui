import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserDto} from '../dto/UserDto';
import {URL} from '../util/URL';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  // getTemplate(id: number) {
  //   return this.http.post<UserDto>(URL.AUTH_URL + '/login', body);
  // }
}
