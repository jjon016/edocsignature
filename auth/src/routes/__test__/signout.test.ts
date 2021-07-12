import { newuser } from './testuser';
import request from 'supertest';
import { app } from '../../app';

it('clears cookie after signing out', async () => {
  await request(app).post('/api/users/signup').send(newuser()).expect(201);
  const req = await request(app).get('/api/users/signout').expect(200);
  expect(req.get('Set-Cookie').toString().length).toBeLessThan(90);
});
