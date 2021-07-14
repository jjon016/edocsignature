import request from 'supertest';
import { app } from '../../app';
import { Doc } from '../../models/doc';
import mongoose from 'mongoose';
import { SigBoxType } from '@edoccoding/common';
import { testValidDocObject } from './testparams';

const buildDoc = async (
  docid?: string,
  ownerid?: string,
  signerid?: string
) => {
  const doc = Doc.build(testValidDocObject(docid, ownerid, signerid));
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
    .get('/api/docs/tosign')
    .set('Cookie', userOne)
    .send()
    .expect(200);
  expect(response.body[0].id).toEqual(docOneId);
  expect(response.body[0].sigboxes[0].type == SigBoxType.Signature);
});

it('throws not found if doc does not exists', async () => {
  //fetch doc data
  const response = await request(app)
    .get('/api/docs/tosign')
    .set('Cookie', global.signin())
    .send()
    .expect(200);
  expect(response.body).toEqual([]);
});
