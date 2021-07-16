import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';
import { DocStatus, SigBoxType } from '@edoccoding/common';
import mongoose from 'mongoose';
import { testUploadFile, testValidDocObject, randomFloat } from './testparams';

it('returns 201 on create', async () => {
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(testValidDocObject()))
    .attach('FILE', testUploadFile, {
      filename: 'test.pdf',
      contentType: 'application/pdf',
    })
    .expect(201);
});

it('returns 400 on create if invalid coordinate is passed', async () => {
  let docdata = testValidDocObject();
  // @ts-ignore
  docdata.sigboxes[0].x = 'abc';
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(docdata))
    .attach('FILE', testUploadFile, {
      filename: 'test.pdf',
      contentType: 'application/pdf',
    })
    .expect(400);
});

it('returns 400 on create if invalid signer data is passed', async () => {
  let docdata = testValidDocObject();
  // @ts-ignore
  docdata.signers[0].email = '123';
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(docdata))
    .attach('FILE', testUploadFile, {
      filename: 'test.pdf',
      contentType: 'application/pdf',
    })
    .expect(400);
});

it('returns 201 with minimal requirements', async () => {
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field(
      'JSON',
      JSON.stringify({
        docname: 'Test Doc',
      })
    )
    .attach('FILE', testUploadFile, {
      filename: 'test.pdf',
      contentType: 'application/pdf',
    })
    .expect(201);
});

it('returns 400 if document not attached', async () => {
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(testValidDocObject()))
    .expect(400);
});
