import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class MyServiceService {
  private BASE_URL = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.BASE_URL);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.BASE_URL}/${id}`);
  }

  addTask(taskData: Task): Observable<Task> {
    const newTask = {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate
        ? new Date(taskData.dueDate)
        : new Date().toISOString(),
      tags: [],
    };

    return this.http.post<Task>(this.BASE_URL, newTask);
  }

  updateTask(id: number, updated: Task): Observable<Task> {
    // const updatedTask = { ...updated };

    return this.http.put<Task>(`${this.BASE_URL}/${id}`, updated);
  }

  deleteTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.BASE_URL}/${id}`);
  }

  toggleTaskComplete(id: number): Observable<Task> {
    return this.getTaskById(id).pipe(
      map((task) => ({
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      })),
      switchMap((updatedTask) =>
        this.http.put<Task>(`${this.BASE_URL}/${id}`, updatedTask)
      )
    );
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.BASE_URL)
      .pipe(map((tasks) => tasks.filter((task) => task.completed)));
  }

  getPendingTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.BASE_URL)
      .pipe(map((tasks) => tasks.filter((task) => !task.completed)));
  }

  getTasksByPriority(priority: string): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.BASE_URL)
      .pipe(map((tasks) => tasks.filter((task) => task.priority === priority)));
  }

  searchTasks(searchTerm: string): Observable<Task[]> {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return this.http
      .get<Task[]>(this.BASE_URL)
      .pipe(
        map((tasks) =>
          tasks.filter(
            (task) =>
              task.title.toLowerCase().includes(lowerSearchTerm) ||
              task.description.toLowerCase().includes(lowerSearchTerm)
          )
        )
      );
  }

  getTasksStats(): Observable<any> {
    return this.getAllTasks().pipe(
      map((tasks) => {
        const total = tasks.length;
        const completed = tasks.filter((task) => task.completed).length;
        const pending = tasks.filter((task) => !task.completed).length;
        const high = tasks.filter((task) => task.priority === 'high').length;
        const medium = tasks.filter(
          (task) => task.priority === 'medium'
        ).length;
        const low = tasks.filter((task) => task.priority === 'low').length;

        const completionRate =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          total,
          completed,
          pending,
          high,
          medium,
          low,
          completionRate,
        };
      })
    );
  }
}
