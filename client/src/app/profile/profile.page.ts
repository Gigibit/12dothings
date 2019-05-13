import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Proposal, ProposalMapper } from '../_models/proposal';
import { UserService } from '../_services/user.service';
import { User, UserMapper } from '../_models/user';
import { ToastController, ActionSheetController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { PictureSourceType } from '@ionic-native/Camera/ngx';
import { Location } from '@angular/common';
import { ProposalService } from '../_services/proposal.service';
import { ProposalRequestsComponent } from '../proposal-requests/proposal-requests.component';
import { OverlayEventDetail } from '@ionic/core';
import { RequestState } from '../_models/request';
import { ImageModalComponent } from '../image-modal/image-modal.component';

const COLUMN_COUNT = 4


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  section = 'proposals'
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
    private modalController: ModalController,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef, 
    private userService: UserService,
    private proposalService: ProposalService
    ) { 
    }
    
    ngOnInit() {
      this.userService.getContext().subscribe(data=>{
        console.log(data)
        this.ownProposals = ProposalMapper.fromJsonArray(data['own_proposals'])
        //this.requestedProposals = data['requested_proposals']
        this.joinedProposals = data['joined_proposals']
        const info = UserMapper.fromJson(data['user_info'])
        if(this.userInfo == null && info != null && info.imgs != null ){
          this.userInfo = info
          this.userInfo.imgs.forEach((img, index) => {
            if(index % COLUMN_COUNT == 0) {
              let row = [];
              row.push(img);
              this.images.push(row);
            } else {
              this.images[this.images.length - 1].push(img);
            }
          });
          if(this.images[this.images.length -1] && this.images[this.images.length -1].length%COLUMN_COUNT !== 0){
            for(var i = 0; i < this.images[this.images.length -1].length%COLUMN_COUNT; i++ )
            this.images[this.images.length - 1].push('');
          }
        }
        else{
          console.log('data not found or user already loaded')
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
  async onProposalRequestsClick(proposal: Proposal){
    if( proposal.joinRequests != null && 
        proposal.joinRequests.filter( value => value.state == RequestState.PENDING ).length > 0
      ){
      const modal =  await this.modalController.create({
        component: ProposalRequestsComponent,
        componentProps: {
          joinRequests: proposal.joinRequests,
        }
     });
     modal.onDidDismiss().then((hasDoneSomethingOverlay:OverlayEventDetail)=>{
        if(hasDoneSomethingOverlay.data){
          this.ownProposals = []
          this.ngOnInit()
        }
      });
     modal.present();
    }
    else{
      let toast = await this.toastController.create({
          message: 'There are no pending requests!',
          duration: 3000,
          position: 'top'
      })
      toast.present()
    }
   
  }

  openPreview(img) {
    this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        img: img
      }
    }).then(modal => {
      modal.present();
    });
  }



}
