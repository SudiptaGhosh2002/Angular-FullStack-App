import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Todo } from '../../services/todo';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.html'
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  editingTodo: Todo | null = null;
  loading = false;
  userName = '';

  constructor(
    private todoService: TodoService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos: any) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      }
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;

    const todo: Partial<Todo> = {
      title: this.newTodoTitle,
      description: this.newTodoDescription,
      completed: false
    };

    this.todoService.createTodo(todo).subscribe({
      next: (newTodo: any) => {
        this.todos.unshift(newTodo);
        this.newTodoTitle = '';
        this.newTodoDescription = '';
      },
      error: (error: any) => {
        console.error('Error creating todo:', error);
      }
    });
  }

  toggleComplete(todo: Todo): void {
    if (!todo._id) return;

    this.todoService.updateTodo(todo._id, { completed: !todo.completed }).subscribe({
      next: (updatedTodo: any) => {
        const index = this.todos.findIndex(t => t._id === todo._id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
      },
      error: (error: any) => {
        console.error('Error updating todo:', error);
      }
    });
  }

  startEdit(todo: Todo): void {
    this.editingTodo = { ...todo };
  }

  cancelEdit(): void {
    this.editingTodo = null;
  }

  saveEdit(): void {
    if (!this.editingTodo || !this.editingTodo._id) return;

    this.todoService.updateTodo(this.editingTodo._id, {
      title: this.editingTodo.title,
      description: this.editingTodo.description
    }).subscribe({
      next: (updatedTodo: any) => {
        const index = this.todos.findIndex(t => t._id === updatedTodo._id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        this.editingTodo = null;
      },
      error: (error: any) => {
        console.error('Error updating todo:', error);
      }
    });
  }

  deleteTodo(id: string | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.todos = this.todos.filter(t => t._id !== id);
        },
        error: (error: any) => {
          console.error('Error deleting todo:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  get completedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  get activeCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }
}