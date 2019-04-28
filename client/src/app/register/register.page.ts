import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {
  }
  register(form) {
    console.log(form.value)
    this.authService.register(form.value).subscribe(data=>{
      console.log(data)
    })
  }
}