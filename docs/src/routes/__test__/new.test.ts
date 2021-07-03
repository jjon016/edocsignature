import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';
import {
  testUploadFile,
  cleanDirectories,
  testValidDocObject,
} from './testparams';

it('returns 201 on create', () => {
  cleanDirectories();

  return request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile)
    .expect(201);
});
