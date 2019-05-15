import { Component, OnInit } from '@angular/core';
import { ProposalService } from '../_services/proposal.service';
import { Request, RequestState } from '../_models/request';
import { NavParams, ModalController, ActionSheetController, LoadingController, IonItemSliding } from '@ionic/angular';
import { removeObjectFromArray } from '../_utils/utils';

@Component({
  selector: 'app-proposal-requests',
  templateUrl: './proposal-requests.component.html',
  styleUrls: ['./proposal-requests.component.scss'],
})
export class ProposalRequestsComponent implements OnInit {
  requests: Request[] = []
  somethingChanged = false
  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private proposalService: ProposalService,
    public actionSheetController: ActionSheetController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.requests= this.navParams.get('joinRequests');
    console.log(this.requests ? this.requests : 'nend')
  }
  onSwipe(item: IonItemSliding, request:Request) {
    item.getSlidingRatio().then(percent=>{
      removeObjectFromArray(this.requests, request)
      item.close()
      console.log(percent)
      if (percent > 0) {
        // positive deny
        console.log('right side');
      } else {
        // negative allow
        console.log('left side');
      }
      if (Math.abs(percent) > 1) {
        console.log('overscroll');
      }
    });
 
  }
  async allow(slidingItem, request:Request){
    if(slidingItem) slidingItem.close()
    const loading = await this.load()
    loading.present()
    this.proposalService.approveRequest(request.proposalId, request.user.id)
    .subscribe(data=> {
      loading.dismiss()
      this.requests = removeObjectFromArray(this.requests,request)
      if(this.requests.length == 0) this.modalCtrl.dismiss(true)    
      this.somethingChanged = data['status'] == 'OK'
    }, error=>{
      console.log(error);
      loading.dismiss()
    })
  }
  async deny(slidingItem, request:Request){
    if(slidingItem) slidingItem.close()
    const loading = await this.load()
    loading.present()
    this.proposalService
    .denyRequest(request.proposalId, request.user.id)
    .subscribe(data=> {
      console.log(data)
      loading.dismiss()
      this.requests = removeObjectFromArray(this.requests, request)
      if(this.requests.length == 0) this.modalCtrl.dismiss(true)
      this.somethingChanged = data['status'] == 'OK'
    
    }, error=>{
      console.log(error);
      loading.dismiss()
    })
  }
 
  notApprovedRequests(){
    return this.requests ? this.requests.filter(value => value.state != RequestState.APPROVED && value.state != RequestState.DENIED) : []
  }

  async showPopupAllowDeny(request: Request){
    const actionSheet = await this.actionSheetController.create({
      header: 'What you wanna do with his request?',
      buttons: [{
        text: 'Approve',
        icon: 'checkmark',
        handler: () => {
          console.log(request)
          this.allow(null, request)
        }
      }, {
        text: 'Deny',
        role: 'distructive',
        icon: 'trash',
        handler: () => {
          this.deny(null, request);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  load() {
    return this.loadingCtrl.create({
      spinner: null,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
  }
}
