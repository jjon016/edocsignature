import request from 'supertest';
import { app } from '../../app';
import { Doc } from '../../models/doc';
import mongoose from 'mongoose';
import { SigBoxType, DocStatus } from '@edoccoding/common';
import { testValidDocObject } from './testparams';

const buildDoc = async (
  docid?: string,
  ownerid?: string,
  signerid?: string,
  docstatus?: DocStatus
) => {
  const doc = Doc.build(
    testValidDocObject(docid, ownerid, signerid, docstatus)
  );
  await doc.save();
  return doc;
};

it('fetches the doc', async () => {
  //create doc data
  const userId = mongoose.Types.ObjectId().toHexString();
  const docOneId = mongoose.Types.ObjectId().toHexString();
  const userOne = global.signin(userId);
  const docOne = await buildDoc(docOneId, userId, userId);

  //fetch doc data
  const response = await request(app)
    .get('/api/docs/tosign/')
    .set('Cookie', userOne)
    .send()
    .expect(200);
  expect(response.body.docs[0].id).toEqual(docOneId);
  expect(response.body.docs[0].sigboxes[0].type == SigBoxType.Signature);
});

it('throws not found if doc does not exists', async () => {
  //fetch doc data
  const response = await request(app)
    .get('/api/docs/tosign/')
    .set('Cookie', global.signin())
    .send()
    .expect(200);
  expect(response.body.docs).toEqual([]);
});

it('only retieves document with the signing status', async () => {
  //create doc data
  const userId = mongoose.Types.ObjectId().toHexString();
  const docOneId = mongoose.Types.ObjectId().toHexString();
  const docTwoId = mongoose.Types.ObjectId().toHexString();
  const userOne = global.signin(userId);
  const docOne = await buildDoc(docOneId, userId, userId, DocStatus.Signing);
  const docTwo = await buildDoc(docTwoId, userId, userId, DocStatus.Cancelled);

  //fetch doc data
  const response = await request(app)
    .get('/api/docs/tosign/')
    .set('Cookie', userOne)
    .send()
    .expect(200);
  expect(response.body.docs.length).toEqual(1);
  expect(response.body.docs[0].sigboxes[0].type == SigBoxType.Signature);
  expect(response.body.docs[0].id == docOneId);
});

it('gives passes empty array if no docs found', async () => {
  const userOne = global.signin();
  const response = await request(app)
    .get('/api/docs/tosign/')
    .set('Cookie', userOne)
    .send()
    .expect(200);
  expect(response.body.docs).toEqual([]);
});
