import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Location } from '@angular/common';
import { Globalization } from '@ionic-native/globalization/ngx';
import { languages, getLanguageByGlobalizationPrefix } from '../_datasources/languages';
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
    private location: Location,
    private globalization: Globalization) { 
      this.globalization.getPreferredLanguage()
        .then(res => {
          this.language = getLanguageByGlobalizationPrefix(res)
        })
       .catch(e => console.log(e));
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