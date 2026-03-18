
export const TOKEN_KEY = 'todo_app_token';

export function getToken() {
 return localStorage.getItem(TOKEN_KEY)||null;

}

export function setToken(token:string){
    return localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(){
    return localStorage.removeItem(TOKEN_KEY)
}