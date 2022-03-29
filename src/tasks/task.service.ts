import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTaskFilterDto) {
    const { search, status } = filterDto;
    let tasks = this.tasks;
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    return tasks;
  }

  getTaskById(id: string) {
    const task = this.tasks.find((value) => value.id === id);
    return task;
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskById(id: string, status: TaskStatus) {
    let result;
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        task.status = status;
        result = task;
      }
      return task;
    });
    return result;
  }
}
