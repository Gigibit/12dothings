import { Injectable } from '@angular/core';
import { Proposal } from '../core/models/proposal';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Position } from '../core/models/proposal'
import { AuthService } from './auth.service';
import { SERVICE_SERVER } from '../config';

const PROPOSALS_CRUD_SERVICE  = SERVICE_SERVER + '/api/proposals'
const SINGLE_PROPOSAL_SERVICE = SERVICE_SERVER + '/api/proposal'
const JOIN_PROPOSAL_SERVICE   = SERVICE_SERVER + '/api/join-proposal/'
const APPROVE_REQUEST_SERVICE   = SERVICE_SERVER + '/api/approve-request'
const DENY_REQUEST_SERVICE   = SERVICE_SERVER + '/api/deny-request'
const BLOCK_USER_PROPOSAL_SERVICE   = SERVICE_SERVER + '/api/block-user-proposal/'

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    auth: AuthService
  ) { 
    this.headers = this.headers.set('auth-token', auth.token());
  }

           
  createProposal(proposal: Proposal): Observable<any>{

    let proposalMap = proposal
    proposalMap['accept_all_request'] = proposal.useOwnerPhoto
    proposalMap['use_owner_photo'] = proposal.autoAcceptRequest

    return this.http.post(PROPOSALS_CRUD_SERVICE, proposal,{
      headers : this.headers
    })
  }
  getProposals(location: Position, maxDistance: number = null): Observable<any>{
    return this.http.get(PROPOSALS_CRUD_SERVICE +
                      '?longitude='+location.coordinates[0] +
                      '&latitude='+location.coordinates[1]  +
                      ( maxDistance ? '&md=' + maxDistance : "" ),
                      {
                        headers : this.headers
                      }
                    )
  }

  getProposalDetail(id: string){
    // return of({
    //   title: "odnafoina",
    //   description: "oidnaoidncoianc",
    //   users: []
    // })
    return this.http.get( SINGLE_PROPOSAL_SERVICE + '/' + id, {
      headers : this.headers
    })
  }

  join(id : string){
    return this.http.post( JOIN_PROPOSAL_SERVICE + id , {}, {
      headers : this.headers
    })
  }

  approveRequest(proposalId: string, userToApproveId: string){
    return this.http.post( APPROVE_REQUEST_SERVICE , {
      'user_to_approve' : userToApproveId,
      'proposal_id' : proposalId
    }, {
      headers : this.headers
    })
  }
  denyRequest(proposalId: string, userToApproveId: string){
    return this.http.post( DENY_REQUEST_SERVICE , {
      'user_to_approve' : userToApproveId,
      'proposal_id' : proposalId
    }, {
      headers : this.headers
    })
  }
  blockUser(userId: string ){
    return this.http.post( BLOCK_USER_PROPOSAL_SERVICE + userId , { }, {
      headers : this.headers
    })
  }
}
