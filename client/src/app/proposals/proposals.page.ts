import { Component, OnInit, ViewChild} from '@angular/core';
import { ProposalService } from '../_services/proposal.service';
import { Proposal, PositionType, ProposalMapper } from '../_models/proposal';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import {  ModalController, LoadingController, PopoverController, ToastController, IonSelect } from '@ionic/angular';
import { CreateProposalComponent } from '../create-proposal/create-proposal.component';
import { OverlayEventDetail } from '@ionic/core';
import { ProposalThreeDotsPopoverComponent } from '../proposal-three-dots-popover/proposal-three-dots-popover.component';
import { joinWithCommaOrEmpty } from '../_utils/functions';
import { UserService } from '../_services/user.service';
import { Place } from '../_components/autocomplete-input/autocomplete-input.component';
import { AuthService } from '../_services/auth.service';

const USE_OWN_LOCATION = 'useMyPosition'
const USE_OWN_LANGUAGE = 'useMyLanguage'

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
})
export class ProposalsPage implements OnInit {
  filterSelectOptions = {
    header: 'filter',
    // subHeader: 'pllllll',
    // message: '$1.00 per topping',
  };

  filter = [USE_OWN_LOCATION, USE_OWN_LANGUAGE]

  lastSelectedZone : Place
  proposals: Proposal[]
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;
  useMyPosition = true
  useMyLanguage = true
  maxDistance = 5000
  watchLocationUpdates:any; 
  loading:any;
  isWatching:boolean;
  userImg:string
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private modalController: ModalController,
    private proposalService: ProposalService,
    private userService: UserService,
    private geolocation: Geolocation,
    public popoverController: PopoverController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private loadingCtrl : LoadingController,
    private nativeGeocoder: NativeGeocoder
  ) {
    console.log('this.authService.currentUserValue')
    this.userImg = this.authService.currentUserValue.profileImg
    console.log(this.authService.currentUserValue)
  }
 
  ngOnInit(){ this.getGeolocation() }
  
    //Get current coordinates of device
    async getGeolocation(){
   
      this.geolocation.getCurrentPosition().then((resp) => {
        this.useMyPosition = true;
        this.geoLatitude = resp.coords.latitude;
        this.geoLongitude = resp.coords.longitude; 
        this.geoAccuracy = resp.coords.accuracy;
        this.getGeoencoder(this.geoLatitude,this.geoLongitude);
       }).catch((error) => {
         this.useMyPosition = false;
         console.log(error)
       });
    }
  
    //geocoder method to fetch address from coordinates passed as arguments
    getGeoencoder(latitude,longitude){
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = joinWithCommaOrEmpty( /* result[0].thoroughfare,*/ result[0].locality , result[0].subLocality , /* result[0].administrativeArea ,*/ result[0].countryName );
        this.userService.updateAddress(this.geoAddress).subscribe(data=>{
          console.log(data)
        })
      })
      .catch((error: any) => {
        console.log(error)
      });
    }
    onUseMyPositionStatusChanged(){
      this.geoLatitude = null
      this.geoLongitude = null
      if(this.useMyPosition){ this.getGeolocation() }
      else if ( this.lastSelectedZone ){
          this.geoLatitude = Number.parseFloat(this.lastSelectedZone.y)
          this.geoLongitude = Number.parseFloat(this.lastSelectedZone.x) 
        }  
      
    }
    onFilterChanged(){
      let useMyPosition = this.filter.indexOf(USE_OWN_LOCATION) != -1
      this.useMyLanguage = this.filter.indexOf(USE_OWN_LANGUAGE) != -1
      if(useMyPosition != this.useMyPosition){
        this.useMyPosition = useMyPosition
        this.onUseMyPositionStatusChanged()
      }
    }

    onZoneSelected(zone: Place){
      this.lastSelectedZone = zone;
      this.geoLatitude = Number.parseFloat(zone.y)
      this.geoLongitude = Number.parseFloat(zone.x)
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
    async findProposals(){
      if( !this.geoLatitude || ! this.geoLongitude )
      {
        let toast = await this.toastCtrl.create({
          message: 'you should choose where, or accept getting location!',
          duration: 2000
        })
        return toast.present()
      }
      let loader = await this.load()
      loader.present()
      this.proposalService.getProposals({
        type: PositionType.POINT,
        coordinates : [this.geoLongitude, this.geoLatitude]
      }, this.maxDistance).subscribe(response=>{
        loader.dismiss()
        if(response['status_code'] == 200){
          this.proposals = ProposalMapper.fromJsonArray(response['data'])
        }
        else{
          console.log('3rror')
        }
      })
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
  
    async openCreateProposalModal() {
      const modal: HTMLIonModalElement =
         await this.modalController.create({
            component: CreateProposalComponent,

      });
       
      modal.onDidDismiss().then((proposal: OverlayEventDetail<Proposal>) => {
         if (proposal.data != null) {
           console.log('The result:', proposal.data.id);
         }
      });
      
      await modal.present();
  }
  onRangeChanged(){
    this.getGeolocation()
  }

  load() {
    return this.loadingCtrl.create({
      spinner: null,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
  }

  async presentPopover(ev: any, proposal: Proposal) {
    const popover = await this.popoverController.create({
      component: ProposalThreeDotsPopoverComponent,
      event: ev,
      translucent: true,
      componentProps:{
        userId : proposal.createdBy
      }
    });
    popover.onDidDismiss().then((hasDoneSomethingOverlay:OverlayEventDetail)=>{
      if(hasDoneSomethingOverlay.data){
        this.getGeolocation()
      }
    })
    return await popover.present();
  }
  


}
