import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showError: boolean = false;
  error : string
  returnUrl: string
  constructor(private authService: AuthService,
              private router: Router) { }
  ngOnInit() {
    // this.authenticationService.logout();
    this.returnUrl = '/';

  }
  login(form){
    this.authService.login(form.value['email'], form.value['password']).subscribe(data=>{
      this.router.navigate([this.returnUrl]);
    },error =>{
      console.log(error)
      this.error = error
    });
  }
}