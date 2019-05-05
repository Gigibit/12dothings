export interface User{
    name: string
    surname: string
    age?: number
    id?: string
    email: string
    password?: string
    profileImg: string
    description?: string
    imgs? : string[]

}

export class UserMapper{
    static fromJson(data:any): User{
        return data ? {
            name: data['name'],
            surname: data['surname'],
            age: data['age'],
            id: data['id'],
            profileImg: data['profile_img'],
            description: data['description'],
            imgs: data['imgs'],
            email: data['email']
        } : null
    }
    static  fromJsonArray(data:any[]): User[]{
        return data ?  data.map(user => UserMapper.fromJson(user)) : []
    }
}
