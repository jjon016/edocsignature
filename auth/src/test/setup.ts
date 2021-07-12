import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { newuser, newusertype } from '../routes/__test__/testuser';

declare global {
  namespace NodeJS {
    interface Global {
      signin(testuser?: newusertype): Promise<string[]>;
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWTKEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async (testuser?: newusertype) => {
  if (!testuser) {
    testuser = newuser();
  }

  const response = await request(app)
    .post('/api/users/signup')
    .send(testuser)
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
