import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AuthService } from './auth.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { AUTH_SERVER, SERVICE_SERVER } from '../config';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'
import { Platform } from '@ionic/angular';
import { User } from '../core/models/user';

const CONTEXT = AUTH_SERVER + '/api/get-context'
const UPLOAD_URL = SERVICE_SERVER + "/api/upload-image"
const USER_INFO = SERVICE_SERVER + "/api/get-user-info/"
const PROPS_HIM = SERVICE_SERVER + "/api/props/"
const STORAGE_KEY = 'experience_key_img';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders();
  contentType = 'image/png';
  fileTransfer: FileTransferObject = this.transfer.create();
  
  constructor(
    private http : HttpClient,
    private transfer: FileTransfer,
    private platform: Platform,
    private camera: Camera,
    private auth: AuthService
    ) {
      this.headers = this.headers.set('auth-token', this.auth.token())
    }
    
    getContext(){
      return this.http.get( CONTEXT, {
        headers : this.headers
      })
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
          this.uploadImageData(formData);
        }
        else{
          this.uploadUri(imageData)
        }
        if(onUri){
          onUri(imageData)
        }
      }, onError || console.log );
    }
    uploadUri(uri, onSuccess: (data)=>void = data=>{ console.log(data) }){
      
      let options: FileUploadOptions = {
        fileKey: 'file',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {
          'auth-token' : this.auth.token()
        },
        fileName :  this.createFileName()
      }
      this.fileTransfer.upload(encodeURI(uri), UPLOAD_URL,options)
      .then(data=>{ 
        onSuccess(data)
        console.log("yuppi")
      })
      .catch( (err) => console.log(err));
    }
    uploadImageData(formData: FormData) {
      return this.http.post(UPLOAD_URL, formData,{
        headers: this.headers
      }).subscribe(data=> console.log(data));
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
      return this.http.get(USER_INFO + userId,{
        headers : this.headers
      })
    }
    propsHim(userInfo: User){
      return this.http.post(PROPS_HIM + userInfo.id, {},{
        headers: this.headers 
      })
    }
  }
  
