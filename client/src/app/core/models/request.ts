import { User, UserMapper } from './user';

export interface Request{
    proposalId: string,
    user: User,
    state : RequestState
    
}

export enum RequestState{
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DENIED = 'DENIED',
    NOT_REQUESTED = 'NOT_REQUESTED'
}

export class RequestMapper{
    static fromJson(data){
        return data ? {
            proposalId : data['proposal_id'],
            user: UserMapper.fromJson(data['user']),
            state: data['state']
        } : null
    }
    static fromJsonArray(data){
        
        return data ? data.map(value=> RequestMapper.fromJson(value)) : []
    }
}