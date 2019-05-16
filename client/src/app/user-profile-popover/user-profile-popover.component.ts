import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-popover',
  templateUrl: './user-profile-popover.component.html',
  styleUrls: ['./user-profile-popover.component.scss'],
})
export class UserProfilePopoverComponent implements OnInit {
  
  userId: string  
  constructor(
    private popoverCtrl: PopoverController,
    private router: Router,
    private authService: AuthService,
    ) { }
    
    ngOnInit() {

    }
    logout(){
      this.authService.logout().subscribe(data=>{
        console.log(data)
      },error=>{
        console.log(error)
      })
      this.popoverCtrl.dismiss()
      this.router.navigate(['/login']);

    }

    async onDismiss(confirmed: boolean) {
      try {
        await this.popoverCtrl.dismiss(confirmed);
      } catch (e) {
        //click more than one time popover throws error, so ignore...
      }
      
    }
    
  }
