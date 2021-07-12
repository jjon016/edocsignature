import { bademailuser, badpassworduser, newuser } from './testuser';
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send(newuser())
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send(bademailuser())
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send(badpassworduser())
    .expect(400);
});

it('returns a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: 'testpassword',
    })
    .expect(400);
});

it('does not allow same email', async () => {
  const user = newuser();
  await request(app).post('/api/users/signup').send(user).expect(201);
  return request(app)
    .post('/api/users/signup')
    .send({
      email: user.email,
      password: 'testpassword',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const req = await request(app)
    .post('/api/users/signup')
    .send(newuser())
    .expect(201);
  expect(req.get('Set-Cookie').toString().length).toBeGreaterThan(90);
});
