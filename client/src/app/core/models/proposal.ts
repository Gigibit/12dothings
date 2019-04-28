import { User } from './user';

export interface Proposal{
    id?: number
    title?: String
    position?: Position
    description: String
    users? : User[]
    admins?: User[]
}

export enum RequestState{
    PENDING = 'PENDING',
    NOT_REQUESTED = 'NOT_REQUESTED'
}

export enum PositionType{
    POINT = 'Point'
}


export interface Position{
    type : PositionType
    coordinates : [number, number]
}