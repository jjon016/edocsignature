import request from 'supertest';
import { app } from '../../app';
import faker from 'faker';
import { newuser } from './testuser';

it('returns a 200 on successful create and returns list of ids', async () => {
  const cookie = await global.signin();
  const emails: string[] = [
    faker.internet.email(),
    faker.internet.email(),
    faker.internet.email(),
  ];
  const res = await request(app)
    .post('/api/users/tempusers')
    .set('Cookie', cookie)
    .send({ emails })
    .expect(200);
  expect(res.body).toHaveLength(3);
});

it('returns a 200 if a record already exists in the tempuser db', async () => {
  const cookie = await global.signin();
  const email = faker.internet.email();
  const single: string[] = [email];
  const emails: string[] = [
    faker.internet.email(),
    faker.internet.email(),
    faker.internet.email(),
  ];
  const res = await request(app)
    .post('/api/users/tempusers')
    .set('Cookie', cookie)
    .send({ emails: single })
    .expect(200);
  expect(res.body).toHaveLength(1);

  const res2 = await request(app)
    .post('/api/users/tempusers')
    .set('Cookie', cookie)
    .send({ emails })
    .expect(200);
  expect(res2.body).toHaveLength(3);
});

it('returns a 200 if a record already exists in the user db', async () => {
  const user = newuser();
  const cookie = await global.signin(user);

  const emails: string[] = [
    user.email,
    faker.internet.email(),
    faker.internet.email(),
  ];

  const res = await request(app)
    .post('/api/users/tempusers')
    .set('Cookie', cookie)
    .send({ emails })
    .expect(200);
  expect(res.body).toHaveLength(3);
  expect(res.body[0].email == user.email);

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser).not.toEqual(null);
  expect(response.body.currentUser.id).toEqual(res.body[0].id);
});
