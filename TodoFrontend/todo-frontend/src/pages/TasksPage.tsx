import { useState } from "react";
import { getErrorMessage } from "../api/apiError";
import { useAuth } from "../auth/AuthContext";
import { useCreateTask, useTasks } from "../hooks/useTasks";
import { useToggleTaskDone } from "../hooks/useTasks";
import { useDeleteTask } from "../hooks/useTasks";
import './TasksPage.css';

export function TasksPage() {
const {user,logout}=useAuth()
const [title, setTitle] = useState('')
const {data,isLoading,error}=useTasks()
const createTask=useCreateTask()
const toggleDone= useToggleTaskDone()
const deleteTaskMutation= useDeleteTask()

if(isLoading){
return (
    <div className="tasks-page">
      <div className="loading-state">Loading your tasks...</div>
    </div>
)
}
else if (error){
       const message= getErrorMessage(error)
       return (
         <div className="tasks-page">
           <div className="error-state">{message}</div>
         </div>
       )
}
if (!data){
    return (
      <div className="tasks-page">
        <div className="empty-state">No tasks found.</div>
      </div>
    )
}

return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <div className="tasks-header-left">
            <h1>My Tasks</h1>
            <div className="user-info">Logged in as <strong>{user?.username}</strong></div>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>

        <div className="task-input-section">
          <form 
            className="task-form"
            onSubmit={(e)=>{
              e.preventDefault()
              const trimmed = title.trim()
              if(trimmed===''){return}
              createTask.mutate({title:trimmed,priority:null},{ onSuccess:()=>{setTitle('')}})
            }}
          >
            <input 
              className="task-input"
              placeholder="What do you need to do?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <button 
              disabled={createTask.isPending} 
              type='submit' 
              className="btn-add-task"
            >
              {createTask.isPending ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        <div className="tasks-list">
          <div className="tasks-list-header">
            {data.data.length} {data.data.length === 1 ? 'Task' : 'Tasks'}
          </div>
          
          {data.data.map((task) => (
            <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <input
                className="task-checkbox"
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  toggleDone.mutate({ id: task.id, done: task.done })
                }
                disabled={toggleDone.isPending}
              />
              
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  {task.priority && <span className="task-priority">Priority: {task.priority}</span>}
                  <span className={`task-status ${task.done ? 'done' : 'unfinished'}`}>
                    {task.done ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => deleteTaskMutation.mutate(task.id)} 
                className="btn-delete"
                disabled={deleteTaskMutation.isPending}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
)
}