import request from 'supertest';
import { app } from '../../app';
import { DocStatus, SigBoxType } from '@edoccoding/common';
import mongoose from 'mongoose';
import { testUploadFile, testValidDocObject, randomFloat } from './testparams';

it('returns 200 when updating doc', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile)
    .expect(201);
  let docdata = res.body;
  docdata.docname = 'New Doc Name';
  const res2 = await request(app)
    .post('/api/docs/update')
    .set('Cookie', cookie)
    .send(docdata)
    .expect(200);
});

it('returns 400 with bad doc name update', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile)
    .expect(201);
  let docdata = res.body;
  docdata.docname = 'bad';
  const res2 = await request(app)
    .post('/api/docs/update')
    .set('Cookie', cookie)
    .send(docdata)
    .expect(400);
});

it('returns 400 with bad signer data', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile)
    .expect(201);
  let docdata = res.body;
  docdata.signers[0].email = 'bad';
  const res2 = await request(app)
    .post('/api/docs/update')
    .set('Cookie', cookie)
    .send(docdata)
    .expect(400);
});

it('returns 400 with bad sigbox data', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile)
    .expect(201);
  let docdata = res.body;
  docdata.sigboxes[0].x = 'bad';
  const res2 = await request(app)
    .post('/api/docs/update')
    .set('Cookie', cookie)
    .send(docdata)
    .expect(400);
});
