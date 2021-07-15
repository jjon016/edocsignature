import request from 'supertest';
import { app } from '../../app';
import { newuser } from './testuser';

it('Able to update all data', async () => {
  const user = newuser();
  const response = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const data = await request(app)
    .get('/api/users/mydata')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.email).toEqual(data.body.email);
});
