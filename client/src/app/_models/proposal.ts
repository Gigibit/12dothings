import { User, UserMapper } from './user';
import { Request, RequestMapper } from './request';
import { titleCaseWord, timeSince } from '../_utils/functions';

export interface Proposal{
    id?: string
    title?: String
    position?: Position
    description: String
    img? : string
    users? : User[]
    createdBy?: string
    createdAt?: string
    district? : string
    city? : string
    joinRequests? : Request[]
    ownerInfo?: User
    autoAcceptRequest?:Boolean
    useOwnerPhoto? : Boolean
}

export enum PositionType{
    POINT = 'Point'
}


export interface Position{
    type : PositionType
    coordinates : [number, number]
}

export class ProposalMapper{
    static fromJson(data: any){
        console.log(data)
        return data ?  {
            id : data['id'],
            title: titleCaseWord(data['title']),
            createdBy : data['created_by'],
            ownerInfo : UserMapper.fromJson(data['owner_info']),
            description: titleCaseWord(data['description']),
            joinRequests : RequestMapper.fromJsonArray(data['join_requests']),
            users : UserMapper.fromJsonArray(data['users']),
            position: data['position'],
            img: data['img'],
            createdAt : timeSince(data['created_at'])
    
        } : null
    }
    static fromJsonArray(data:any){
        return data ? data.map(value=> ProposalMapper.fromJson(value)) : []
    }
}
