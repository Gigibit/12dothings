import { Component, Input, ViewChild, NgZone } from '@angular/core';
import { ToastController, IonContent } from '@ionic/angular';
import { ChatService } from '../_services/chat.service';
import { Proposal } from '../_models/proposal';
import { AuthService } from '../_services/auth.service';
import { timeSince } from '../_utils/functions';
 
@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss']
})
export class ChatRoomPage{
  @ViewChild(IonContent)  messagesContent: IonContent;
  email: string
  _proposal: Proposal
  @Input() public set proposal (proposal: Proposal){
    this.chatService.connect(proposal)

    this.chatService.getMessages(proposal.id)    
    .subscribe(message => {
      this.messages.push(message);
      setTimeout(()=>{ try{ this.ngZone.run(()=> this.messagesContent.scrollToBottom(400) )}catch(ex){}});
    });
    this._proposal = proposal
  }
  public get proposal(){
    return this._proposal
  }
  
  messages = [];
  nickname = '';
  message = '';
 
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private ngZone: NgZone,
    private toastCtrl: ToastController) {
      this.authService.currentUser.subscribe(user=> this.email = user.email)

    
    // this.chatService.getUsers().subscribe(data => {
    //   let user = data['user'];
    //   if (data['event'] === 'left') {
    //     this.showToast('User left: ' + user);
    //   } else {
    //     this.showToast('User joined: ' + user);
    //   }
    // });
  }
  sendMessage(){
    this.chatService.sendMessage(this.message, this.proposal.id).subscribe(data => {
        console.log(data)
    });
    this.message = '';
  }
 
  ionViewWillLeave() {
    this.chatService.disconnect();
  }

  getTime(date: string){
    return timeSince(date)
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
  }
}
