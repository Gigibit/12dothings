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
    
    loadStoredImages() {
      this.userService.loadStoredImage( data => this.images = data)
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
              this.userService.takePicture(PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.userService.takePicture(PictureSourceType.CAMERA);
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
  


  updateStoredImages(name) {
    this.userService.updateStoredImages(name, newEntry=>{
      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    })
  }
  
  startUpload(imgEntry) {
   
  }
  

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create();
    loading.textContent = 'Uploading image...'
    
    await loading.present();
    
    // this.userService.uploadImageData(formData).pipe(
    //   finalize(() => {
    //     loading.dismiss();
    //   })
    //   )
    //   .subscribe(res => {
    //     if (res['success']) {
    //       this.presentToast('File upload complete.')
    //     } else {
    //       this.presentToast('File upload failed.')
    //     }
    //   });
    // }
  }
  }
