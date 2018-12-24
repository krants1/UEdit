import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {User, UsersPage} from '@app/api/user.model';
import {Observable} from 'rxjs';

@Injectable()
export class ApiService {

  baseURL = `http://${environment.serverHost}:${environment.serverPort}/api/`;
  usersURL = this.baseURL + 'users';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersURL);
  }

  getUsers(offset: number, limit: number, sort_order: string = '', sort_direction: string = ''): Observable<UsersPage> {
    sort_order = (sort_order !== undefined) ? sort_order : '';
    sort_direction = (sort_direction !== undefined) ? sort_direction : '';
    const urlParams = new HttpParams().set('offset', offset.toString())
                                      .set('limit', limit.toString())
                                      .set('sort_order', sort_order)
                                      .set('sort_direction', sort_direction);
    // console.log('[urlParams]', 'offset:', offset, 'limit:', limit, 'sort_order:', sort_order, 'sort_direction', sort_direction);
    return this.http.get<UsersPage>(this.usersURL, {params: urlParams});
  }

  addUser(user: User) {
    return this.http.post(this.usersURL, user, this.httpOptions);
  }

  updateUser(user: User) {
    const urlParams = new HttpParams().set('id', user.id.toString());
    return this.http.put(this.usersURL, user, {params: urlParams});
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
