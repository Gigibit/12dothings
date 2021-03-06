import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProposalsPage } from './proposals/proposals.page';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], redirectTo: 'proposals', pathMatch: 'full' },
//  { path: 'home', canActivate: [AuthGuard],  loadChildren: './home/home.module#HomePageModule' },
  { path: 'proposals', canActivate: [AuthGuard],  loadChildren: './proposals/proposals.module#ProposalsPageModule' },
  { path: 'create-proposal', canActivate: [AuthGuard],  component: CreateProposalComponent },
  { path: 'proposal-detail/:id', canActivate: [AuthGuard],  component: ProposalDetailComponent },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'profile', canActivate: [AuthGuard], loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'view-user-profile/:id', canActivate: [AuthGuard],  loadChildren: './view-user-profile/view-user-profile.module#ViewUserProfilePageModule' },
  { path: 'proposals', loadChildren: './proposals/proposals.module#ProposalsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
