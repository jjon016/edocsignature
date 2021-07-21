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

it('deletes the doc', async () => {
  //create doc data
  const userId = mongoose.Types.ObjectId().toHexString();
  const docOneId = mongoose.Types.ObjectId().toHexString();
  const userOne = global.signin(userId);
  const docOne = await buildDoc(docOneId, userId, userId);

  //delete doc data
  const response = await request(app)
    .post('/api/docs/delete/')
    .set('Cookie', userOne)
    .send({ id: docOne._id })
    .expect(200);
  expect(response.body.deletedCount).toEqual(1);
});
