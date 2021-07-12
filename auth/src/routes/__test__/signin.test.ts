import request from 'supertest';
import { app } from '../../app';
import { newuser } from './testuser';

it('returns a 400 when email does not exists', async () => {
  await request(app).post('/api/users/signin').send(newuser()).expect(400);
});

it('returns a 400 when an incorrect password is supplied', async () => {
  const testuser = newuser();
  await request(app).post('/api/users/signup').send(testuser).expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({
      email: testuser.email,
      password: '123456',
    })
    .expect(400);
});

it('responds with a valid cookie with successful signin', async () => {
  const testuser = newuser();
  await request(app).post('/api/users/signup').send(testuser).expect(201);
  const req = await request(app)
    .post('/api/users/signin')
    .send(testuser)
    .expect(200);
  expect(req.get('Set-Cookie').toString().length).toBeGreaterThan(90);
});
