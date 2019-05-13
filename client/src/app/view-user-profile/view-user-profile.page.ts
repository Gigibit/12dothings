import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { User, UserMapper } from '../_models/user';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';

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
  likeCount: number
  constructor(
    private location: Location,
    private modalCtrl: ModalController,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
    ) { }
    
    ngOnInit() {
      this.userId = this.activatedRoute.snapshot.paramMap.get('id');
      this.userService.getUserInfo(this.userId).subscribe(data=> {
        this.userInfo = UserMapper.fromJson(data)
        if(this.userInfo != null){
          if(this.userInfo.imgs != null){
            this.userInfo.imgs.forEach((img, index) => {
              if(index % COLUMN_COUNT == 0) {
                let row = [];
                row.push(img);
                this.images.push(row);
              } else {
                this.images[this.images.length - 1].push(img);
              }
            });
            if( this.images[this.images.length -1] && this.images[this.images.length -1].length%COLUMN_COUNT !== 0){
              for(var i = 0; i < this.images[this.images.length -1].length%COLUMN_COUNT; i++ )
              this.images[this.images.length - 1].push('');
            }
          }
          if (this.userInfo.props){
            this.likeCount = this.userInfo.props.length
          }
        }
      })
    }
    
    props(){
      console.log("props")
      this.userService.propsHim(this.userInfo).subscribe(data=>{
        if(data['status_code'] == 200)
        {
          this.userInfo.iLike = true
          this.likeCount++
        }
      })
    }
    unprops(){
      console.log("unprops")
      this.userService.unpropsHim(this.userInfo).subscribe(data=>{
        if(data['status_code'] == 200)
        {
          this.userInfo.iLike = false
          this.likeCount--
        }
      })
    }
    async fullscreen(img){
      const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ImageModalComponent,
        componentProps: {
          img: img,
        }
      });
      
      await modal.present();
    }
  }
