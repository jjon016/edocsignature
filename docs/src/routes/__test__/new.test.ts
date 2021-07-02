import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Doc } from '../../models/doc';
import { SigBox } from '../../models/sigbox';
import { currentUser, DocStatus, SigBoxType } from '@edoccoding/common';

it('returns 201 on create', async () => {
  await request(app)
    .post('/api/docs')
    .set('Cookie', global.signin())
    .send({
      docid: mongoose.Types.ObjectId().toHexString(),
      docname: 'Test Doc',
      ownerid: currentUser.name,
      docstatus: DocStatus.Signing,
      sigboxes: [
        {
          x: 2.222,
          y: 2.22,
          width: 2.22,
          height: 2.22,
          signerId: mongoose.Types.ObjectId().toHexString(),
          type: SigBoxType.Signature,
          value: '',
        },
      ],
    })
    .expect(201);
});
