import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { ProposalRequestsComponent } from '../proposal-requests/proposal-requests.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  entryComponents: [ProposalRequestsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  exports:[ UserAvatarComponent ],
  declarations: [ ProfilePage, ProposalRequestsComponent, UserAvatarComponent ]
})
export class ProfilePageModule {}
