import { randomUUID } from 'node:crypto'
import { Database } from '../database.js';
import { buildRoutePath } from '../utils/build-route-paths.js'

const database = new Database()

export const taskRoutes = [
    //LIST
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request,response) => {
            const { search } = request.query
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            }: null)

            return response.end(JSON.stringify(tasks))
        }
    },
    //POST
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request,response) => {
            const { title, description } = request.body
            if (!title || !description) {
                return response
                  .writeHead(400)
                  .end(JSON.stringify({ message: 'Title and description are required.' }))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                completed_at: null,
                updated_at: null,

            }
    
            database.insert('tasks', task)
    
            return response.writeHead(201).end()
        }
    },
    //DELETE
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request,response) => {
            const { id } = request.params
            database.delete('tasks', id)
            return response.writeHead(204).end()
        }
    },
    //PUT
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request,response) => {
            const { id } = request.params
            const { title, description } = request.body

            if (!title || !description) {
                return response.writeHead(400).end(JSON.stringify({ message: 'Title and description are required.' }))
            }

            database.update('tasks', id, {
                title,
                description,
                updated_at: new Date(),
            })
            return response.writeHead(204).end()
        }
    },
    // PATCH
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request,response) => {
            const { id } = request.params
            const task = database.findById('tasks', id)
            if(!task) {
                return response.writeHead(400).end(JSON.stringify({ message: 'Task ID required.' }))
            }

            const isTaskComplete = task.completed_at
            if (!isTaskComplete) {
                database.update('tasks', id, {
                    completed_at: new Date(),
                })
                return response.writeHead(204).end(JSON.stringify({ message: 'Task completed.' }))
            } else {
                return response.writeHead(400).end(JSON.stringify({ message: 'Task already complete.' }))
            }
            
        }
    },
]