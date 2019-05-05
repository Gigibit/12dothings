import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User, UserMapper } from '../core/models/user';
import { Location } from '@angular/common';

const COLUMN_COUNT = 4
@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.page.html',
  styleUrls: ['./view-user-profile.page.scss'],
})
export class ViewUserProfilePage implements OnInit {
  userId: string
  userInfo : User
  images  = []
  constructor(
    private location: Location,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUserInfo(this.userId).subscribe(data=> {
      this.userInfo = UserMapper.fromJson(data)
      console.log(data)
      if(this.userInfo != null && this.userInfo.imgs != null){
        this.userInfo.imgs.forEach((img, index) => {
          if(index % COLUMN_COUNT == 0) {
            let row = [];
            row.push(img);
            this.images.push(row);
          } else {
            this.images[this.images.length - 1].push(img);
          }
        });
        if(this.images[this.images.length -1].length%COLUMN_COUNT !== 0){
          for(var i = 0; i < this.images[this.images.length -1].length%COLUMN_COUNT; i++ )
          this.images[this.images.length - 1].push('');
        }
      }
    })
  }

  props(){
    this.userService.propsHim(this.userInfo).subscribe(data=>{
      console.log(data)
    })
  }
}
