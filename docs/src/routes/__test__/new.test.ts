import request from 'supertest';
import { app } from '../../app';
import fs from 'fs';
import mongoose from 'mongoose';
import { currentUser, SigBoxType } from '@edoccoding/common';
import { response } from 'express';

const testUploadFile = __dirname + '\\test.pdf';

const testDocObject = {
  docname: 'Test Doc',
  ownerid: currentUser.name,
  sigboxes: [
    {
      x: 2.222,
      y: 2.22,
      width: 2.22,
      height: 2.22,
      signerid: mongoose.Types.ObjectId().toHexString(),
      type: SigBoxType.Signature,
      value: '',
    },
    {
      x: 3.222,
      y: 3.22,
      width: 3.22,
      height: 3.22,
      signerid: mongoose.Types.ObjectId().toHexString(),
      type: SigBoxType.Signature,
      value: '',
    },
  ],
};

it('returns 201 on create', () => {
  return request(app)
    .post('/api/docs')
    .set('Content-type', 'multipart/form-data')
    .set('Cookie', global.signin())
    .field('JSON', JSON.stringify(testDocObject))
    .attach('FILE', testUploadFile, { contentType: 'application/pdf' })
    .expect(200)
    .then((response) => {
      console.log(response);
    });
});
