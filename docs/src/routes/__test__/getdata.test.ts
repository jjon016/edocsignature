import request from 'supertest';
import { app } from '../../app';
import { Doc } from '../../models/doc';
import mongoose from 'mongoose';
import { buildValidDocAttrsObj } from './testparams';

const buildDoc = async (docid?: string, ownerid?: string) => {
  const validDoc = buildValidDocAttrsObj(docid, ownerid);
  const doc = Doc.build(validDoc);
  await doc.save();
  return doc;
};

it('fetches the doc', async () => {
  //create doc data
  const userId = mongoose.Types.ObjectId().toHexString();
  const docOneId = mongoose.Types.ObjectId().toHexString();
  const userOne = global.signin(userId);
  const docOne = await buildDoc(docOneId, userId);

  //fetch doc data
  const response = await request(app)
    .get(`/api/docs/${docOneId}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);
  console.log(response.body);

  expect(response.body.docid).toEqual(docOneId);
});
