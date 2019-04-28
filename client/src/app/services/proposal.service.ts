import { Injectable } from '@angular/core';
import { Proposal } from '../core/models/proposal';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Position } from '../core/models/proposal'
import { AuthService } from './auth.service';

const PROPOSALS_CRUD_SERVICE  = 'http://localhost:3001/api/proposals'
const SINGLE_PROPOSAL_SERVICE = 'http://localhost:3001/api/proposal'
const JOIN_PROPOSAL_SERVICE   = 'http://localhost:3001/api/join-proposal/'

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
    return this.http.post(PROPOSALS_CRUD_SERVICE, proposal,{
      headers : this.headers
    })
  }
  getProposals(location: Position, maxDistance: number = null): Observable<any>{
    return this.http.get(PROPOSALS_CRUD_SERVICE +
                      '?longitude='+location.coordinates[0] +
                      '&latitude='+location.coordinates[1]  +
                      ( maxDistance ? '&md=' + maxDistance : "" )
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

}
