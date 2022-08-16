import { boot } from '../src/main';
import { App } from './../src/app';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'a@a.ua', password: '1' });
		expect(res.statusCode).toBe(422);
	});
	it('Login success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'user2@ua.com', password: 'user_pass' });
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Login error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'user2@ua.com', password: '1' });
		expect(res.statusCode).toBe(401);
	});
	it('Info success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'user2@ua.com', password: 'user_pass' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('user2@ua.com');
	});

	it('Info error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
