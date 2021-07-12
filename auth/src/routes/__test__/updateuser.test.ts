import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { newfulluser, newuser, updateuser } from './testuser';

it('Able to update all data', async () => {
  const user = newuser();
  const updateduser = updateuser(user);
  const response = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send(updateduser)
    .expect(200);
});

it('Able to update just name', async () => {
  const user = newuser();
  const response = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send(newfulluser().name)
    .expect(200);
});

it('It publishes an event after updating', async () => {
  const user1 = newuser();
  const updateduser1 = updateuser(user1);

  const response = await request(app)
    .post('/api/users/signup')
    .send(user1)
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send(updateduser1)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Unable to update email to one that is already in use', async () => {
  const user = newuser();
  const user2 = newuser();
  const response = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const response2 = await request(app)
    .post('/api/users/signup')
    .send(user2)
    .expect(201);
  const cookie2 = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send({ email: user2.email })
    .expect(400);
});
