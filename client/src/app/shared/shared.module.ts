import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { AutocompleteInputComponent } from '../_components/autocomplete-input/autocomplete-input.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ UserAvatarComponent, AutocompleteInputComponent ],
  exports: [ UserAvatarComponent, AutocompleteInputComponent ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class SharedModule { }
