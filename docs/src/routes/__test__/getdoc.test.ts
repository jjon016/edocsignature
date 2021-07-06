import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';
import { DocStatus, SigBoxType } from '@edoccoding/common';
import mongoose from 'mongoose';
import {
  testUploadFile,
  cleanDirectories,
  testValidDocObject,
} from './testparams';

it('returns not found if pdf does not exists', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const res2 = await request(app)
    .get(`/api/docs/123`)
    .set('Cookie', global.signin(userId))
    .expect(404);
});

it('can return pdf file after its saved', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin(userId))
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile)
    .expect(201);
  expect(res.body.docid).not.toBeNull();

  const res2 = await request(app)
    .get(`/api/docs/${res.body.docid}`)
    .set('Cookie', global.signin(userId))
    .expect(200);
  expect(res2.headers['content-type']).toEqual('application/pdf');

  cleanDirectories();
});
