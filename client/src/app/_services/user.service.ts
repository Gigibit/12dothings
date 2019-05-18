import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AuthService } from './auth.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { AUTH_SERVER, SERVICE_SERVER } from '../config';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'
import { Platform } from '@ionic/angular';
import { User } from '../_models/user';
import { ThrowStmt } from '@angular/compiler';

const CONTEXT = AUTH_SERVER + '/api/get-context'
const UPLOAD_URL = SERVICE_SERVER + "/api/upload-image"
const UPDATE_PROFILE_IMG_URL = SERVICE_SERVER + "/api/update-profile-img"
const USER_INFO = SERVICE_SERVER + "/api/get-user-info/"
const PROPS_HIM = SERVICE_SERVER + "/api/props/"
const UNPROPS_HIM = SERVICE_SERVER + "/api/unprops/"
const UPDATE_USER_ADDRESS = SERVICE_SERVER + "/api/update-address"
const STORAGE_KEY = 'experience_key_img';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  contentType = 'image/png';
  fileTransfer: FileTransferObject = this.transfer.create();
  
  constructor(
    private http : HttpClient,
    private transfer: FileTransfer,
    private platform: Platform,
    private camera: Camera,
    private auth: AuthService
    ) {}
    
    getContext(){
      return this.http.get( CONTEXT )
    }
    
    takePicture(sourceType: PictureSourceType, onUri: (string)=>void = null, onError: (error)=>void = null) {
      var options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 400,
        targetHeight: 400,
        correctOrientation: true
      };
      this.camera.getPicture(options).then((imageData) => {
        if (this.platform.is('mobileweb') || this.platform.is('desktop'))
        {
          imageData = "data:image/jpeg;base64," + imageData;
          const formData = new FormData();
          const imgBlob = this.dataURItoBlob(imageData);
          formData.append('file', imgBlob, this.createFileName());
          this.uploadImageData(UPLOAD_URL, formData);
        }
        else{
          this.uploadUri(UPLOAD_URL, imageData)
        }
        if(onUri){
          // onUri(imageData)
        }
      }, err=>{
        console.log(err)
      });
    }


    
    udateProfileImg(sourceType: PictureSourceType, onUri: (string)=>void = null, onError: (error)=>void = null) {
      var options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 400,
        targetHeight: 400,
        correctOrientation: true
      };
      this.camera.getPicture(options).then((imageData) => {
        if (this.platform.is('mobileweb') || this.platform.is('desktop'))
        {
          imageData = "data:image/jpeg;base64," + imageData;
          const formData = new FormData();
          const imgBlob = this.dataURItoBlob(imageData);
          formData.append('file', imgBlob, this.createFileName());
          this.uploadImageData(UPDATE_PROFILE_IMG_URL, formData);
        }
        else{
          this.uploadUri(UPDATE_PROFILE_IMG_URL, imageData)
        }
        if(onUri){
          // onUri(imageData)
        }
      }, err=>{
        console.log(err)
      });
    }



    uploadUri(upload_url, uri, onSuccess: (data)=>void = data=>{ console.log(data) }){
      
      let options: FileUploadOptions = {
        fileKey: 'file',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {
          'auth-token' : this.auth.token()
        },
        fileName :  this.createFileName()
      }
      this.fileTransfer.upload(encodeURI(uri), upload_url, options)
      .then(data=>{ 
        console.log("yuppi")

        onSuccess(data)
        console.log("yuppi")
      })
      .catch( (err) => console.log(err));
    }
    uploadImageData(upload_url, formData: FormData) {
      return this.http.post(upload_url, formData ).subscribe(data=> {
        console.log(data)
        console.log("yuppi")

      });
    }
    
    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
      else
      byteString = unescape(dataURI.split(',')[1]);
      
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([ia], {type:mimeString});
    }
    createFileName() {
      var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
      return newFileName;
    }
    getUserInfo(userId: string){
      return this.http.get(USER_INFO + userId)
    }
    propsHim(userInfo: User){
      console.log(userInfo)
      return this.http.post(PROPS_HIM + userInfo.id, {})
    }
    unpropsHim(userInfo: User){
      return this.http.post(UNPROPS_HIM + userInfo.id, {})
    }
    
    updateAddress(address : string){
      return this.http.post(UPDATE_USER_ADDRESS, { address : address })
    }

  }
  
