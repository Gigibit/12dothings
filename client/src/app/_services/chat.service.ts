import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ng-socket-io';
import { Proposal } from '../_models/proposal';
import { HttpClient } from '@angular/common/http';
import { SERVICE_SERVER } from '../config';
import { keyframes } from '@angular/animations';

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
    this.socket.emit('join', {'sender': 'me', 'proposal': proposal.id });
    console.log({'sender': 'me', 'proposal': proposal.id })
  }


  sendMessage(msg : string, key : string) {
    return this.http.post(MESSAGE_API_URL + key, { 
      text: msg 
    });
  }

  disconnect(){
    this.socket.disconnect();
  }
  
  getMessages(forKey : string, onFirstDataRetrieved: (()=>void)=null) {
    let observable = new Observable(observer => {
      this.http.get(MESSAGE_API_URL + forKey).subscribe(response=> {
        JSON.parse(response['data']).forEach(message => {
          observer.next(message);       
        });
        this.socket.on('message', (data) => {
          observer.next(data);
          console.log(data)
        });
      });
    });
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