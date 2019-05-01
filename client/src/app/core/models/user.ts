export interface User{
    name: string
    surname: string
    age?: number
    id?: number
    email: string
    password?: string
    profileImg: string
    description?: string
    imgs? : string[]

}

export function fromJson(data:any){
    return {
        name: data['name'],
        surname: data['surname'],
        age: data['age'],
        id: data['id'],
        profileImg: data['profile_img'],
        description: data['description'],
        imgs: data['imgs'],
        email: data['email']
    }
}