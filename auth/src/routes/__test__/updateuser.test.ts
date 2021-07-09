import request from 'supertest';
import { app } from '../../app';
import { FontTypes } from '@edoccoding/common';
import { natsWrapper } from '../../nats-wrapper';

const email = 'test@test.com';
const password = 'password';
const name = 'Test User';
const initials = 'TU';
const phone = '1231231234';
const signature = 'Test User';
const signaturetype = FontTypes.AlluraRegular;
const initialstype = FontTypes.AlluraRegular;

it('Able to update all data', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send({
      email,
      password,
      name,
      initials,
      phone,
      signature,
      signaturetype,
      initialstype,
    })
    .expect(200);
});

it('Able to update just name', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send({ name })
    .expect(200);
});

it('It publishes an event after updating', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send({ signature, signaturetype, initialstype, initials })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Unable to update email to one that is already in use', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  const cookie = response.get('Set-Cookie');

  const response2 = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test2@test.com', password })
    .expect(201);
  const cookie2 = response.get('Set-Cookie');

  const updateres = await request(app)
    .post('/api/users/update')
    .set('Cookie', cookie)
    .send({ email: 'test2@test.com' })
    .expect(400);
});
