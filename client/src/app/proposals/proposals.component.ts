import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ProposalService } from '../services/proposal.service';
import { Proposal, PositionType, ProposalMapper } from '../core/models/proposal';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { CreateProposalComponent } from '../create-proposal/create-proposal.component';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss'],
})
export class ProposalsComponent {
  proposals: Proposal[]
   
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;
  maxDistance = 5000
  watchLocationUpdates:any; 
  loading:any;
  isWatching:boolean;
 
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private ngZone: NgZone,
    private modalController: ModalController,
    private proposalService: ProposalService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {
  }
 
  
    //Get current coordinates of device
    getGeolocation(){
      this.geolocation.getCurrentPosition().then((resp) => {
        this.geoLatitude = resp.coords.latitude;
        this.geoLongitude = resp.coords.longitude; 
        this.geoAccuracy = resp.coords.accuracy; 
        this.proposalService.getProposals({
          type: PositionType.POINT,
          coordinates : [this.geoLongitude, this.geoLatitude]
        }, this.maxDistance).subscribe(data=>{
          this.proposals = ProposalMapper.fromJsonArray(data)
        })
        // this.getGeoencoder(this.geoLatitude,this.geoLongitude);
       }).catch((error) => {
         alert('Error getting location'+ JSON.stringify(error));
       });
    }
  
    //geocoder method to fetch address from coordinates passed as arguments
    getGeoencoder(latitude,longitude){
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location'+ JSON.stringify(error));
      });
    }
  
    //Return Comma saperated address
    generateAddress(addressObj){
        let obj = [];
        let address = "";
        for (let key in addressObj) {
          obj.push(addressObj[key]);
        }
        obj.reverse();
        for (let val in obj) {
          if(obj[val].length)
          address += obj[val]+', ';
        }
      return address.slice(0, -2);
    }
  
  
    //Start location update watch
    watchLocation(){
      this.isWatching = true;
      this.watchLocationUpdates = this.geolocation.watchPosition();
      this.watchLocationUpdates.subscribe((resp) => {
        this.geoLatitude = resp.coords.latitude;
        this.geoLongitude = resp.coords.longitude; 
        this.getGeoencoder(this.geoLatitude,this.geoLongitude);
      });
    }
  
    //Stop location update watch
    stopLocationWatch(){
      this.isWatching = false;
      this.watchLocationUpdates.unsubscribe();
    }
  
    async openModal() {
      const modal: HTMLIonModalElement =
         await this.modalController.create({
            component: CreateProposalComponent,
            componentProps: {
               aParameter: true,
               otherParameter: new Date()
            }
      });
       
      modal.onDidDismiss().then((proposal: OverlayEventDetail<Proposal>) => {
         if (proposal.data !== null) {
           console.log('The result:', proposal.data.id);
         }
      });
      
      await modal.present();
  }
}
