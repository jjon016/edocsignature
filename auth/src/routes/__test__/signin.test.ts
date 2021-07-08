import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

it('returns a 400 when email does not exists', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'me@testcom',
      password: 'paasdfasdf',
    })
    .expect(400);
});

it('returns a 400 when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'testpassword',
      name: 'Test User',
      initials: 'T U',
      phone: '8017917231',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test',
      initials: 'T U',
      phone: '8017917231',
    })
    .expect(400);
});

it('responds with a valid cookie with successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'testpassword',
      name: 'Test User',
      initials: 'T U',
      phone: '8017917231',
    })
    .expect(201);
  const req = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'testpassword',
      initials: 'T U',
      phone: '8017917231',
    })
    .expect(200);
  expect(req.get('Set-Cookie').toString().length).toBeGreaterThan(90);
});
