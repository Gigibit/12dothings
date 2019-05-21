import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { BehaviorSubject, Observable } from  'rxjs';
import { Storage } from  '@ionic/storage';
import { Platform } from '@ionic/angular';
import { AUTH_SERVER } from '../config';
import { User, UserMapper } from '../_models/user';
import { map } from 'rxjs/operators';

const TOKEN_KEY = 'auth-token';

const REGISTER_URL = AUTH_SERVER + '/api/register'
const LOGIN_URL = AUTH_SERVER + '/api/login'
const LOGOUT_URL = AUTH_SERVER + '/api/logout'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  access_token : string
  authenticationState = new BehaviorSubject(false);
  
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  
  login(email: string, password: string) {
    return this.http.post<User>(LOGIN_URL, { email : email, password:password })
    .pipe(map(response => {
      let user = UserMapper.fromJson(response['data'])
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      
      return user;
    }));
  }
  contextRefresh(user:User){
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return this.http.get(LOGOUT_URL)
  }
  
  register(form){
    return this.http.post(REGISTER_URL, form)
  }
  
  token(){
    return this.access_token
  }
  isAuthenticated() {
    return this.authenticationState.value;
  }
}
