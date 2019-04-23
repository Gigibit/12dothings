import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';
 
@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
})
export class ChatRoomPage {
  messages = [];
  nickname = '';
  message = '';
 
  constructor(
    private chatService: ChatService,
    private toastCtrl: ToastController) {

    this.nickname = 'this.navParams.get';
    chatService.connect({
      description : "Bell'evento ",
      users : [],
    })
    this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    });
    
    this.chatService.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  }
 
  sendMessage(){
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
 
  ionViewWillLeave() {
    this.chatService.disconnect();
  }
 
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
  }
}
