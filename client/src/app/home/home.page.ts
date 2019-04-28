import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userId: string = '';
  userList: any = [];
  constructor(private chatService: ChatService, private route: ActivatedRoute) { }
  ngOnInit() {

  }
  isOnline(user) {

  }
}