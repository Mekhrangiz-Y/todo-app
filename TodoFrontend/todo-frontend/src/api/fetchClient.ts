import { getToken } from "../auth/tokenStorage";
const API_URL = import.meta.env.VITE_API_URL as string;


export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function request<T>(
  url: string,
  method: HttpMethod,
  opts?: { body?: unknown; token?: string | null }
): Promise<T> {
  const { body, token } = opts ?? {};
const effectiveToken = token ?? ( getToken());

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message=res.statusText

    try{
      const response=await res.json()

    if(response.message){
      message =response.message
    }
    else{
    message =JSON.stringify(response)
    }
    }
    catch(e){  
    const text = await res.text();
    if(text){
message=text
    
    }
  }
  throw{message:message,status:res.status}

  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;

}


