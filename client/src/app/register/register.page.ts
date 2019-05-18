import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Location } from '@angular/common';
import { languages, getLanguageByPrefix } from '../_datasources/languages';
import { IonSelect } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('languageSelect') selectRef: IonSelect;
  languages = languages
  language : string
  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private location: Location) { 
      translateService.get(getLanguageByPrefix(this.translateService.getBrowserLang()))
                        .subscribe( result=>this.language = result )
    }
  
    ngOnInit() {
      window['tra'] = this.translateService
  
    }
  register(form) {
    this.authService.register(form.value).subscribe(data=>{
      if(data['status_code'] == 200){
        this.location.back()
      }
    })
  }
}