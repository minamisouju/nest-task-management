import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRespository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRespository)
    private taskRepository: TaskRespository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto) {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
