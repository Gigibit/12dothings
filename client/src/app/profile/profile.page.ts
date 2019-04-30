import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Proposal } from '../core/models/proposal';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { UserService } from '../services/user.service';
import { User } from '../core/models/user';
import { ToastController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { PictureSourceType } from '@ionic-native/Camera/ngx';
import { finalize } from 'rxjs/operators';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  images = []
  uri
  ownProposals : Proposal[]
  joinedProposals: Proposal[]
  //requestedProposals: Proposal[]
  userInfo: User 
  constructor(
    private actionSheetController: ActionSheetController, 
    private toastController: ToastController,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef, 
    private userService: UserService
    ) { 
  
    }
    
    ngOnInit() {
      this.userService.getContext().subscribe(data=>{
        this.ownProposals = data['own_proposals']
        //this.requestedProposals = data['requested_proposals']
        this.joinedProposals = data['joined_proposals']
        this.userInfo = data['user_info'] as User
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
              this.userService.takePicture(PictureSourceType.PHOTOLIBRARY, (uri)=> this.uri = uri);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.userService.takePicture(PictureSourceType.CAMERA, (uri)=> this.uri = uri );
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
  
  }
