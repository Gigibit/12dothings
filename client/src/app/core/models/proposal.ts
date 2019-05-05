import { User, UserMapper } from './user';
import { Request, RequestMapper } from './request';

export interface Proposal{
    id?: number
    title?: String
    position?: Position
    description: String
    img? : string
    users? : User[]
    createdBy?: string
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
        return data ?  {
            id : data['id'],
            title: data['title'],
            createdBy : data['created_by'],
            ownerInfo : UserMapper.fromJson(data['owner_info']),
            description: data['description'],
            joinRequests : RequestMapper.fromJsonArray(data['join_requests']),
            users : UserMapper.fromJsonArray(data['users']),
            position: data['position'],
            img: data['img'] 
    
        } : null
    }
    static fromJsonArray(data:any){
        return data ? data.map(value=> ProposalMapper.fromJson(value)) : []
    }
}
