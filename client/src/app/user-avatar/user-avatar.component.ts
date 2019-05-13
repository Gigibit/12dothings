import { Component, OnInit, Input } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {
  @Input() userInfo:User
  constructor() { }
}
