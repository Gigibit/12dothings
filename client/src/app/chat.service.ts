import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ng-socket-io';
import { Proposal } from './core/models/proposal';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: Socket
  ){}

  connect(proposal: Proposal){
    this.socket.connect();
    this.socket.emit('join', {'sender': 'me', 'proposal': proposal.id || Math.random().toString() });
  }


  sendMessage(msg : string) {
    this.socket.emit('add-message', { 
      sender: 'me',
      proposal: 'padmfodpamda', 
      text: msg 
    });
  }
 
  disconnect(){
    this.socket.disconnect();
  }
  
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
        console.log(data)
      });
    })
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

}