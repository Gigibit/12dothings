import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ng-socket-io';
import { Proposal } from '../_models/proposal';
import { HttpClient } from '@angular/common/http';
import { SERVICE_SERVER } from '../config';

const MESSAGE_API_URL = SERVICE_SERVER + '/api/messages/'


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: Socket,
    private http: HttpClient
  ){}

  connect(proposal: Proposal){
    this.socket.connect();
    this.socket.emit('join', {'sender': 'me', 'proposal': '5ce1abfbb09ed4d72faf18b2' });
  }


  sendMessage(msg : string, key : string) {
    return this.http.post(MESSAGE_API_URL + key, { 
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