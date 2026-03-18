import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query"
import {createTask, getTasks,updateTask,deleteTask} from "../api/tasks"


export function useTasks(){
   return useQuery({queryKey:['tasks'],queryFn:getTasks})
}


export function useCreateTask(){
   const queryClient=useQueryClient()
   return useMutation({mutationFn:createTask, onSuccess:()=>queryClient.invalidateQueries({queryKey:['tasks']})})
}

export function useToggleTaskDone(){
const queryClient=useQueryClient()
return useMutation({
    mutationFn:({id,done}:{id:number,done:boolean})=>updateTask(id,{done:!done}),
    onSuccess:()=>queryClient.invalidateQueries({queryKey:['tasks']})
})
}  



export function useDeleteTask(){
   const queryClient=useQueryClient()
   return useMutation({
mutationFn: (id: number) => deleteTask(id),
   onSuccess:()=>queryClient.invalidateQueries({queryKey:['tasks']})})
}  