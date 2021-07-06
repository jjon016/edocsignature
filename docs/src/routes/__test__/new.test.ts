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
    .attach('FILE', testUploadFile)
    .expect(201);
});

it('returns 400 on create if invalid coordinate is passed', async () => {
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field(
      'JSON',
      JSON.stringify({
        docname: 'Test Doc',
        ownerid: '',
        docstatus: DocStatus.Signing,
        sigboxes: [
          {
            x: 'abc',
            y: randomFloat(5, 70),
            width: randomFloat(5, 70),
            height: randomFloat(5, 70),
            signerid: mongoose.Types.ObjectId().toHexString(),
            type: SigBoxType.Signature,
            value: '',
          },
        ],
      })
    )
    .attach('FILE', testUploadFile)
    .expect(400);
});

it('returns 400 if blank doc id is passed', async () => {
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field(
      'JSON',
      JSON.stringify({
        docstatus: DocStatus.Signing,
        sigboxes: [
          {
            x: randomFloat(5, 70),
            y: randomFloat(5, 70),
            width: randomFloat(5, 70),
            height: randomFloat(5, 70),
            signerid: mongoose.Types.ObjectId().toHexString(),
            type: SigBoxType.Signature,
            value: '',
          },
        ],
      })
    )
    .attach('FILE', testUploadFile)
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
    .attach('FILE', testUploadFile)
    .expect(201);
});

it('returns 400 if document not attached', async () => {
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(testValidDocObject()))
    .expect(400);
});
