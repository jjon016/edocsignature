import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';
import { DocStatus, SigBoxType } from '@edoccoding/common';
import mongoose from 'mongoose';
import {
  testUploadFile,
  testValidDocObject,
  cleanDirectories,
  testValidDoc2Object,
  buildSig,
  sigbox,
} from './testparams';

it('returns 400 if document is missing', async () => {
  const res = await request(app)
    .post('/api/docs/sign')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('returns 400 if user does not have signature', async () => {
  let docid = mongoose.Types.ObjectId().toHexString();
  const userid = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userid);
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject(docid, userid, userid)))
    .attach('FILE', testUploadFile)
    .expect(201);
  docid = res.body.id;
  const res2 = await request(app)
    .post('/api/docs/sign')
    .set('Cookie', cookie)
    .send({ id: docid, sigbox: sigbox(userid) })
    .expect(400);
});

it('returns 404 if signature box is missing', async () => {
  let docid = mongoose.Types.ObjectId().toHexString();
  const userid = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userid);
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject(docid, userid, userid)))
    .attach('FILE', testUploadFile)
    .expect(201);
  docid = res.body.id;
  const signature = await buildSig(userid);
  const res2 = await request(app)
    .post('/api/docs/sign')
    .set('Cookie', cookie)
    .send({ id: docid, sigbox: sigbox() })
    .expect(404);
});

it('returns 400 if signature box is not owned by signer', async () => {
  let docid = mongoose.Types.ObjectId().toHexString();
  const userid = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userid);
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject(docid, userid)))
    .attach('FILE', testUploadFile)
    .expect(201);
  docid = res.body.id;
  const signature = await buildSig(userid);
  const sigbox = res.body.sigboxes[0];

  sigbox.clickedon = new Date();
  const res2 = await request(app)
    .post('/api/docs/sign')
    .set('Cookie', cookie)
    .send({ id: docid, sigbox: sigbox })
    .expect(401);
});

it('returns 400 if document not found', async () => {
  let docid = mongoose.Types.ObjectId().toHexString();
  const userid = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userid);
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDocObject(docid, userid, userid)))
    .attach('FILE', testUploadFile)
    .expect(201);
  docid = res.body.id;
  const signature = await buildSig(userid);
  const sigbox = res.body.sigboxes[0];
  sigbox.clickedon = new Date();
  cleanDirectories();
  const res2 = await request(app)
    .post('/api/docs/sign')
    .set('Cookie', cookie)
    .send({ id: docid, sigbox: sigbox })
    .expect(404);
});

it('returns 200 if document is signed', async () => {
  let docid = mongoose.Types.ObjectId().toHexString();
  const userid = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userid);
  const res = await request(app)
    .post('/api/docs')
    .set('Cookie', cookie)
    .field('JSON', JSON.stringify(testValidDoc2Object(docid, userid, userid)))
    .attach('FILE', testUploadFile)
    .expect(201);
  docid = res.body.id;
  const signature = await buildSig(userid);
  const sigbox = res.body.sigboxes[0];
  sigbox.clickedon = new Date();
  const res2 = await request(app)
    .post('/api/docs/sign')
    .set('Cookie', cookie)
    .send({ id: docid, sigbox: sigbox });
  console.log(res2.body);
  expect(res2.statusCode).toEqual(200);
});
