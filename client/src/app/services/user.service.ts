import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AuthService } from './auth.service';

const AUTH_SERVER  =  'http://localhost:3001';
const CONTEXT = AUTH_SERVER + '/api/get-context'


@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders();

  constructor(
    private http : HttpClient,
    auth: AuthService
  ) {
    this.headers = this.headers.set('auth-token', auth.token());
   }

  getContext(){
    return this.http.get( CONTEXT, {
      headers : this.headers
    })
  }

}
