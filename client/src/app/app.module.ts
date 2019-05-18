import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProposalsPage } from './proposals/proposals.page';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { ChatRoomPage } from './chat/chat.component';
import { AutocompleteInputComponent } from './_components/autocomplete-input/autocomplete-input.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { LoginPage } from './login/login.page';
import { LoginPageModule } from './login/login.module';
import { RegisterPageModule } from './register/register.module';

 
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
 
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { ProfilePageModule } from './profile/profile.module';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { ProposalThreeDotsPopoverComponent } from './proposal-three-dots-popover/proposal-three-dots-popover.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { UserProfilePopoverComponent } from './user-profile-popover/user-profile-popover.component';
import { Globalization } from '@ionic-native/globalization/ngx';
import { AlertComponent } from './alert/alert.component';
import { EditProfileComponent } from './_components/edit-profile/edit-profile.component';



const config: SocketIoConfig = { url: 'http://localhost:3001/messages', options: {} };

function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    ProposalsPage,
    CreateProposalComponent,
    ChatRoomPage,
    ImageModalComponent,
    ProposalDetailComponent,
    AutocompleteInputComponent,
    ProposalThreeDotsPopoverComponent,
    AlertComponent,
    EditProfileComponent,
    UserProfilePopoverComponent
  ],
  entryComponents: [ 
    ImageModalComponent, 
    ProposalThreeDotsPopoverComponent, 
    UserProfilePopoverComponent, 
    EditProfileComponent 
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    LoginPageModule,
    ProfilePageModule,
    RegisterPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    Globalization,
    Camera,
    File,
    WebView,
    FilePath,
    FileTransfer,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


