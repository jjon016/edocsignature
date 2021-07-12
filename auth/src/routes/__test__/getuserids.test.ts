import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { newfulluser, newuser, updateuser } from './testuser';

it('Able to retrieve one id', async () => {
  const user = newuser();
  const response = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const getidsres = await request(app)
    .post('/api/users/getuserids')
    .set('Cookie', cookie)
    .send({ emails: [user.email] })
    .expect(200);
});
