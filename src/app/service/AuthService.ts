import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {URL} from "../util/URL";
import {UserDto} from "../model/UserDto";

const httpOptions = {
  headers: new HttpHeaders({
      // 'Accept': 'application/json',
      // 'Content-Type': 'application/json'
    }
  )
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  loginUser(body: any): Observable<UserDto> {
    return this.http.post<UserDto>(URL.AUTH_URL + '/login', body, httpOptions);
  }

  register(body: any): Observable<any> {
    return this.http.post(URL.AUTH_URL + '/register', body, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(URL.AUTH_URL + '/logout', {}, httpOptions);
  }
}
