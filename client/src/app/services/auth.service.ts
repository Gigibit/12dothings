import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { BehaviorSubject } from  'rxjs';
import { Storage } from  '@ionic/storage';
import { Platform } from '@ionic/angular';
import { AUTH_SERVER } from '../config';

const TOKEN_KEY = 'auth-token';

const REGISTER_URL = AUTH_SERVER + '/api/register'
const LOGIN_URL = AUTH_SERVER + '/api/login'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  access_token : string
  authenticationState = new BehaviorSubject(false);
 
  constructor(
    private http: HttpClient,
    private storage: Storage, 
    private plt: Platform) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
 
  checkToken() {
    this.storage.get(TOKEN_KEY).then(access_token => {
      this.access_token = access_token
      if (access_token) {
        this.authenticationState.next(true);
      }
    })
  }
  register(form){
    return this.http.post(REGISTER_URL, form)
  }
  login(form) {
    // return this.storage.set(TOKEN_KEY, 'Bearer 33321').then(() => {
    //   this.authenticationState.next(true);
    // });
    return this.http.post(LOGIN_URL, form).subscribe(data=>{
        if( data['status'] == 'OK') 
          this.storage.set(TOKEN_KEY, data['access_token']).then(() => {
              this.authenticationState.next(true);
          });
        else
          alert(data['code'])
    })
  }
 
  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  token(){
    return this.access_token
  }
  isAuthenticated() {
    return this.authenticationState.value;
  }
}
