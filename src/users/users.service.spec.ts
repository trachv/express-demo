import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from './../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from './../types';
import { UserService } from './users.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');

		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await usersService.createUser({
			email: 'a@a.ua',
			name: 'a',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});
	it('validate user - success', () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = usersService.validateUser({
			email: 'a@a.ua',
			password: '1',
		});
		expect(res).toBeTruthy();
	});
	it('validate user - wrong password', () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = usersService.validateUser({
			email: 'a@a.ua',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
	it('validate user - wrong user', () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = usersService.validateUser({
			email: 'a2@a.ua',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
