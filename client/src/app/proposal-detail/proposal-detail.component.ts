import { Component, OnInit } from '@angular/core';
import { ProposalService } from '../services/proposal.service';
import { Platform } from '@ionic/angular';
import { Proposal, RequestState } from '../core/models/proposal';
import { ActivatedRoute } from '@angular/router';
import { User } from '../core/models/user';

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent implements OnInit {
  proposalKey: string
  proposal : Proposal
  state : RequestState
  participants : User[]
  constructor(
    private proposalService: ProposalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.proposalKey = this.activatedRoute.snapshot.paramMap.get('id');
    this.proposalService.getProposalDetail(this.proposalKey).subscribe(data=>{
      this.proposal = data['detail'] as Proposal
      this.state    = data['join_status'] as RequestState
      console.log(data)
    })
  }
  join(){
    this.proposalService.join(this.proposalKey).subscribe(data=>{
      this.state = RequestState.PENDING
    })
  }
}
