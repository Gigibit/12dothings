import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProposalsComponent } from './proposals/proposals.component';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { ChatRoomPage } from './chat/chat.component';
import { AutocompleteInputComponent } from './autocomplete-input/autocomplete-input.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { LoginPage } from './login/login.page';
import { LoginPageModule } from './login/login.module';
import { RegisterPageModule } from './register/register.module';

const config: SocketIoConfig = { url: 'http://localhost:3001/messages', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ProposalsComponent,
    CreateProposalComponent,
    ChatRoomPage,
    ProposalDetailComponent,
    AutocompleteInputComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LoginPageModule,
    RegisterPageModule,
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
