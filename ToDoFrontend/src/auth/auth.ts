import { request } from "../api/fetchClient";

export type User ={
    id:number;
    username:string;
}

export type LoginResponse = {
    token:string;
    user:User
}


export type MeResponse = {
  user: User;
};

export type AuthResponse={
    token:string,
    user:User
}


export  function login( login:string,password:string)
{
   return request<LoginResponse>('/auth/login','POST',{
    body:{password,login}
       }
    )
}

export function me (){
    return request <MeResponse>('/auth/me','GET')
}

export function register (username:string,email:string,password:string){
    return request<AuthResponse>('/auth/register', 'POST',{
        body:{username,email,password}
    })
}