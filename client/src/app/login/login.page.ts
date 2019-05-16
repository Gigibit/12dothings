import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showError: boolean = false;
  error : string
  returnUrl: string
  constructor(private alertService: AlertService,
              private authService: AuthService,
              private router: Router) { }
  ngOnInit() {
    // this.authenticationService.logout();
    this.returnUrl = '/';

  }
  login(form){
    this.authService.login(form.value['email'], form.value['password']).subscribe(data=>{
      this.router.navigate([this.returnUrl]);
    },error =>{
      this.alertService.error(error)
      this.error = error
    });
  }
}