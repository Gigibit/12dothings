import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/_services/user.service';
import { PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, NavParams, ModalController } from '@ionic/angular';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userInfo: User
  img: string
  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private actionSheetController: ActionSheetController,
    private navParams: NavParams, 
    private modalController: ModalController
  ) { }
  
  ngOnInit() {
    this.userInfo = this.navParams.get('info');
    this.img = this.userInfo.profileImg
  }

  close(){
    this.modalController.dismiss()
  }

  async selectImage() {

    let selectImageSourceString = await this.translateService.get('select_image_source').toPromise()
    let loadFromLibrariString = await this.translateService.get('load_from_library').toPromise()
    let useCameraString = await this.translateService.get('use_camera').toPromise()
    let cancelString = await this.translateService.get('cancel').toPromise()
  
  
    const actionSheet = await this.actionSheetController.create({
      header: selectImageSourceString,
      buttons: [{
        text: loadFromLibrariString,
        handler: () => {
          this.userService.udateProfileImg(PictureSourceType.PHOTOLIBRARY);


        }
      },
      {
        text: useCameraString,
        handler: () => {
          this.userService.udateProfileImg(PictureSourceType.CAMERA );

        }
      },
      {
        text: cancelString,
        role: 'cancel'
      }
    ]
  });
  await actionSheet.present();
  }
}
