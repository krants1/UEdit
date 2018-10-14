import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  baseURL = `http://${environment.serverHost}:${environment.serverPort}/api/`;
  usersURL = this.baseURL + 'users';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {
  }

  getAllUsers(): any {
    return this.http.get(this.usersURL);
  }

  addUser(body: any) {
    return this.http.post(this.usersURL, body, this.httpOptions);
  }

  updateUser(id: number, body: any) {
    const urlParams = new HttpParams().set('id', id.toString());
    return this.http.put(this.usersURL, body, {params: urlParams});
  }

  deleteUser(id: number) {
    const urlParams = new HttpParams().set('id', id.toString());
    return this.http.delete(this.usersURL, {params: urlParams});
  }

  getUser(id: number): any {
    const urlParams = new HttpParams().set('id', id.toString());
    return this.http.get(this.usersURL, {params: urlParams});
  }

  getUserRightTypes(): any {
    return this.http.get(this.usersURL + '/right-types');
  }
}
