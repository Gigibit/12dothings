import { Component, OnInit, Input } from '@angular/core';
import { ProposalService } from '../_services/proposal.service';
import { Proposal } from '../_models/proposal';
import { ActionSheetController, PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-proposal-three-dots-popover',
  templateUrl: './proposal-three-dots-popover.component.html',
  styleUrls: ['./proposal-three-dots-popover.component.scss'],
})
export class ProposalThreeDotsPopoverComponent implements OnInit {
  userId: string  
  constructor(
    private actionSheet: ActionSheetController,
    private popoverCtrl: PopoverController,
    public navParams:NavParams,
    private proposalService: ProposalService
    ) { }
    
    ngOnInit() {
      this.userId = this.navParams.get('userId')
    }
    
    async confirmPopup() {
      const actionSheet = await this.actionSheet.create({
        header: "You will nerver show this user proposals anymore.",
        buttons: [{
          text: 'Confirm',
          handler: () => {
            this.proposalService.blockUser(this.userId).subscribe(data=>{
              this.onDismiss(true)
            })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ()=>{
            this.onDismiss(false)
          }
        }
      ]
    });
    
    await actionSheet.present();
  }
  async onDismiss(confirmed: boolean) {
    try {
      await this.popoverCtrl.dismiss(confirmed);
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
    
  }
  
}
