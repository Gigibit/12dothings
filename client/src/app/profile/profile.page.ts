import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Proposal } from '../core/models/proposal';
import { UserService } from '../services/user.service';
import { User, fromJson } from '../core/models/user';
import { ToastController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { PictureSourceType } from '@ionic-native/Camera/ngx';
import { Location } from '@angular/common';
import { ProposalService } from '../services/proposal.service';

const COLUMN_COUNT = 4


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  galleryType ='regular'
  
  images = []
  uri
  ownProposals : Proposal[]
  joinedProposals: Proposal[]
  //requestedProposals: Proposal[]
  userInfo: User 
  constructor(
    private location: Location,
    private actionSheetController: ActionSheetController, 
    private toastController: ToastController,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef, 
    private userService: UserService,
    private proposalService: ProposalService
    ) { 
    }
    
    ngOnInit() {
      this.userService.getContext().subscribe(data=>{
        this.ownProposals = data['own_proposals']
        //this.requestedProposals = data['requested_proposals']
        this.joinedProposals = data['joined_proposals']
        this.userInfo = fromJson(data['user_info'])
        window['uu'] = this.userInfo
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
        else{
          console.log('data not found')
        }
      })
    }
    
    async presentToast(text) {
      const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }
    
    async selectImage() {
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.userService.takePicture(PictureSourceType.PHOTOLIBRARY, (uri)=> this.images.push(uri));
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.userService.takePicture(PictureSourceType.CAMERA, (uri)=> this.images.push(uri) );
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
  approve(userToApprove : string, proposalId: string){
    this.proposalService.approveRequest(userToApprove, proposalId).subscribe(data=>console.log(data))
  }
}
