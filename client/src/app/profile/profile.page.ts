import { Component, OnInit } from '@angular/core';
import { Proposal } from '../core/models/proposal';
import { ProposalService } from '../services/proposal.service';
import { UserService } from '../services/user.service';
import { User } from '../core/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  ownProposals : Proposal[]
  joinedProposals: Proposal[]
  //requestedProposals: Proposal[]
  userInfo: User 
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getContext().subscribe(data=>{
      this.ownProposals = data['own_proposals']
      //this.requestedProposals = data['requested_proposals']
      this.joinedProposals = data['joined_proposals']
      this.userInfo = data['user_info'] as User
    })
  }
  
}
