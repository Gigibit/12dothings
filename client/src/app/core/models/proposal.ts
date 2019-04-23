import { User } from './user';

export interface Proposal{
    id?: number
    position?: Position
    description: String
    users? : User[]
}