import { Component, OnInit } from '@angular/core';
import { MyServiceService } from './service/my-service.service';

import { Task } from './models/task.model';

// export interface Task {
//   id: number;
//   title: string;
//   description: string;
//   priority: 'low' | 'medium' | 'high';
//   completed: boolean;
//   createdAt: string;
//   dueDate: string;
//   tags: string[] | string;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'taskmanager-hybrid';

  tasks: Task[] = [];
  newTask: Task | null = null;
  searchText: string | null = '';
  showCompleted: boolean = true;
  priorityFilter: string | null = '';
  sortBy: string = '-createdAt';

  stats: any = {};

  constructor(private myService: MyServiceService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.resetForm();
  }

  loadTasks() {
    this.myService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  resetForm() {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      tags: [],
    };
  }

  addTask() {
    if (this.newTask?.title && this.newTask.title.trim()) {
      this.myService.addTask(this.newTask).subscribe(() => {
        this.loadTasks();
        this.resetForm();
      });
    }
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.myService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  toggleTask(id: number) {
    this.myService.toggleTaskComplete(id).subscribe(() => this.loadTasks());
  }

  getFilteredTasks(): Task[] {
    return this.tasks
      .filter((task) =>
        this.searchText
          ? task.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
            task.description
              .toLowerCase()
              .includes(this.searchText.toLowerCase())
          : true
      )
      .filter((task) =>
        this.priorityFilter ? task.priority === this.priorityFilter : true
      )
      .filter((task) => (this.showCompleted ? true : !task.completed));
  }

  getCompletedCount(): number {
    return this.getFilteredTasks().filter((task) => task.completed).length;
  }

  getTaskStats() {
    this.myService.getTasksStats().subscribe((stats) => (this.stats = stats));
  }

  groupTasksByPriority(): { [priority: string]: Task[] } {
    return this.tasks.reduce((acc, task) => {
      (acc[task.priority] = acc[task.priority] || []).push(task);
      return acc;
    }, {} as { [key: string]: Task[] });
  }

  getHighPriorityTasks() {
    return this.tasks.filter((task) => task.priority === 'high');
  }

  sortTasksByDate() {
    return [...this.tasks].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  getTasksWithinDays(days: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return this.tasks.filter(
      (task) => new Date(task.dueDate) <= targetDate && !task.completed
    );
  }
}
