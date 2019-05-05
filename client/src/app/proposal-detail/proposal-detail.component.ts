import { Component, OnInit } from '@angular/core';
import { ProposalService } from '../services/proposal.service';
import { Proposal, ProposalMapper } from '../core/models/proposal';
import { ActivatedRoute } from '@angular/router';
import { User, UserMapper } from '../core/models/user';
import { Location } from '@angular/common';
import { RequestState } from '../core/models/request';

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
    private location: Location,
    private proposalService: ProposalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.proposalKey = this.activatedRoute.snapshot.paramMap.get('id');
    this.proposalService.getProposalDetail(this.proposalKey).subscribe(data=>{
      console.log(data)
      this.proposal = ProposalMapper.fromJson(data['detail'])
      this.state    = data['join_status'] as RequestState
      this.participants = UserMapper.fromJsonArray(data['users'])
    })
  }
  join(){
    this.proposalService.join(this.proposalKey).subscribe(data=>{
      this.state = RequestState.PENDING
    })
  }
}
