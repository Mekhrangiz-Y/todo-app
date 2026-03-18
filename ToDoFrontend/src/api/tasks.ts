import { request } from "./fetchClient"

export type Task={
    id:number,
    title:string,
    priority: 1 | 2 | null,
    done: boolean,
    user_id:number
}

export type TasksResponse={
data:Task[],
page:number,
limit:number,
total:number,
totalPages:number

}

export function getTasks(){
   return request<TasksResponse>('/tasks', 'GET')
}

export function createTask(input:{title:string, priority?:1|2|null}){
    return request<Task>('/tasks','POST',{
        body:input
    })
}


export type UpdateTask={
    title?:string;
    done?:boolean;
    priority?:1|2|null
}

export function updateTask(id:number,patch:UpdateTask):Promise<Task>{
    return request<Task>(`/tasks/${id}`,'PATCH',{
        body:patch
    })
}

export function deleteTask(id:number):Promise<void>{
    return request<void>(`/tasks/${id}`,'DELETE')
}