import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
              completed_at: search,
              created_at: search,
              updated_at: search,
            }
          : null
      )

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end()
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description, created_at } = req.body

      if (database.select('tasks', id ? { id } : null).length == 0) {
        return res.writeHead(400).end()
      }

      database.update('tasks', id, {
        title,
        description,
        completed_at: null,
        created_at,
        updated_at: new Date().toLocaleString(),
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description, created_at } = req.body

      database.update('tasks', id, {
        title,
        description,
        completed_at: new Date().toLocaleString(),
        created_at,
        updated_at: new Date().toLocaleString(),
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  },
]
