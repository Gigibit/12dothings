import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AuthService } from './auth.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { AUTH_SERVER, SERVICE_SERVER } from '../config';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'


const CONTEXT = AUTH_SERVER + '/api/get-context'
const UPLOAD_URL = SERVICE_SERVER + "/api/upload-image"
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
    private camera: Camera,
    private auth: AuthService
    ) {
    

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
        correctOrientation: true
      };
      
      this.camera.getPicture(options).then((imageData) => {
        if(onUri){
          onUri(imageData)
        }
        console.log(imageData)
        this.uploadUri(imageData)
      }, onError || console.log );
    }
    uploadUri(uri, onSuccess: (data)=>void = data=>{ console.log(data) }){
      console.log(this.headers)
      console.log(this.auth.token())
      let options: FileUploadOptions = {
        fileKey: 'file',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {
          'auth-token' : this.auth.token()
        },
        fileName :  this.createFileName()
      }
      
      console.log(options.headers)

      this.fileTransfer.upload(uri, UPLOAD_URL,options)
      .then(data=>{ 
        onSuccess(data)
        console.log("yuppi")
      })
      .catch( (err) => console.log(err));
    }
    createFileName() {
      var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
      return newFileName;
    }
  }
  
