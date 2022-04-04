import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksModule } from './tasks.module';
import { TaskRespository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'test',
  id: 'id',
  password: 'password',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRespository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    taskRepository = module.get(TaskRespository);
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and return result', async () => {
      taskRepository.getTasks.mockResolvedValue('value');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('value');
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and return result', async () => {
      const mockTask = {
        title: 'title',
        description: 'test',
        id: 'id',
        status: TaskStatus.OPEN,
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('id', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TaskRepository.findOne and handle an error', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
