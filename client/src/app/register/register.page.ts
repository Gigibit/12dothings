import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private authService: AuthService,
    private location: Location) { }
  ngOnInit() {
  }
  register(form) {
    this.authService.register(form.value).subscribe(data=>{
      if(data['status_code'] == 200){
        this.location.back()
      }
    })
  }
}