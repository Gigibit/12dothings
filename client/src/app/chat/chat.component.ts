import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ChatService } from '../_services/chat.service';
 
@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss']
})
export class ChatRoomPage {
  messages = [];
  nickname = '';
  message = '';
 
  constructor(
    private chatService: ChatService,
    private toastCtrl: ToastController) {

    this.chatService.connect({
      id: '5ce1abfbb09ed4d72faf18b2',
      description : "Bell'evento ",
      users : [],
    })
    this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    });
    
    // this.chatService.getUsers().subscribe(data => {
    //   let user = data['user'];
    //   if (data['event'] === 'left') {
    //     this.showToast('User left: ' + user);
    //   } else {
    //     this.showToast('User joined: ' + user);
    //   }
    // });
  }
  mockKey = '5ce1abfbb09ed4d72faf18b2'
  sendMessage(){
    this.chatService.sendMessage(this.message, this.mockKey).subscribe(data => {
        console.log(data)
    });
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
