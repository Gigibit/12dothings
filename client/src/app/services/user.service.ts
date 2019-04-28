import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { AuthService } from './auth.service';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';

const AUTH_SERVER  =  'http://localhost:3001';
const CONTEXT = AUTH_SERVER + '/api/get-context'

const STORAGE_KEY = 'experience_key_img';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders();
  contentType = 'image/png';
  
  constructor(
    private http : HttpClient,
    private file: File, 
    private camera: Camera, 
    private plt: Platform, 
    private webview: WebView,
    private storage: Storage, 
    private filePath: FilePath,
    auth: AuthService
    ) {
      this.headers = this.headers.set('auth-token', auth.token());
    }
    
    getContext(){
      return this.http.get( CONTEXT, {
        headers : this.headers
      })
    }
    copyFileToLocalDir(namePath, currentName, newFileName) {
      console.log('copyFileToLocalDir')

      return this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
    }
    uploadImageData(formData: FormData) {
      return this.http.post("http://localhost:3001/api/upload-image", formData, {
        headers : this.headers
      }).subscribe(data=>{
        console.log(data)
      })
    }
    takePicture(sourceType: PictureSourceType) {
      var options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      
      
      this.camera.getPicture(options).then(imagePath => {
        if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.readFile(imagePath)
            // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
        }
        else if(this.plt.is('desktop') || this.plt.is('mobileweb')){
          // if(withBlob){
          //   withBlob(imagePath)
          // }
          const formData = new FormData();
          formData.append('file', this.b64toBlob(imagePath,this.contentType), this.createFileName());
          this.uploadImageData(formData)
        }
        else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          // this.readFile(imagePath)

        }
      });
    }
    
    loadStoredImage(callback:(images)=>void){
      return this.storage.get(STORAGE_KEY).then(imagesData => {
        if (imagesData) {
          let arr = JSON.parse(imagesData);
          let images = [];
          for (let img of arr) {
            let filePath = this.file.dataDirectory + img;
            let resPath = this.pathForImage(filePath);
            images.push({ name: img, path: resPath, filePath: filePath });
          }
          callback(images)
        }
      });
    }
    createFileName() {
      var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
      return newFileName;
    }
    pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        let converted = this.webview.convertFileSrc(img);
        return converted;
      }
    }
    updateStoredImages(name, callback: (newEntry)=>void) {
      console.log('updateStoredImages')

      this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        if (!arr) {
          let newImages = [name];
          this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
        } else {
          arr.push(name);
          this.storage.set(STORAGE_KEY, JSON.stringify(arr));
        }
        
        let filePath = this.file.dataDirectory + name;
        let resPath = this.pathForImage(filePath);
        
        let newEntry = {
          name: name,
          path: resPath,
          filePath: filePath
        };
      console.log('callback')
        callback(newEntry)
      });
    }
    startUpload(imgEntry){
      console.log('startUpload')
      return this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
    }
    readFile(file: any) {
      console.log('readFile')

      const reader = new FileReader();
      reader.onloadend = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        formData.append('file', imgBlob, file.name);
        this.uploadImageData(formData);
      };

      reader.readAsArrayBuffer(file);
    }
   b64toBlob(b64Data, contentType, sliceSize = 512) {
      contentType = contentType || '';
    
      var byteCharacters = atob(b64Data);
      var byteArrays = [];
    
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
    
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        var byteArray = new Uint8Array(byteNumbers);
    
        byteArrays.push(byteArray);
      }
        
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }
    
  }
