import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';
import { newuser } from './testuser';

it('responds with details about the current user', async () => {
  const user = newuser();
  const cookie = await global.signin(user);
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(res.body.currentUser.email).toEqual(user.email);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
