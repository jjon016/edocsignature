import request from 'supertest';
import { app } from '../../app';
import { FontTypes } from '@edoccoding/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('responds with 400 if invalid request', async () => {
  const res = await request(app)
    .post('/api/docs/setsignature')
    .set('Cookie', global.signin())
    .send({
      signature: 'Joshua Jones',
      initialstype: FontTypes.AlluraRegular,
      initials: 'JMJ',
    })
    .expect(400);
});

it('responds with 200 if updated successfully', async () => {
  const res = await request(app)
    .post('/api/docs/setsignature')
    .set('Cookie', global.signin())
    .send({
      signaturetype: FontTypes.AlluraRegular,
      signature: 'Joshua Jones',
      initialstype: FontTypes.AlluraRegular,
      initials: 'JMJ',
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('its can update as well', async () => {
  const userid = mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userid);
  await request(app)
    .post('/api/docs/setsignature')
    .set('Cookie', cookie)
    .send({
      signaturetype: FontTypes.AlluraRegular,
      signature: 'Joshua Jones',
      initialstype: FontTypes.AlluraRegular,
      initials: 'JMJ',
    })
    .expect(200);
  await request(app)
    .post('/api/docs/setsignature')
    .set('Cookie', cookie)
    .send({
      signaturetype: FontTypes.AnkeCallig,
      signature: 'Joshua M Jones',
      initialstype: FontTypes.AnkeCallig,
      initials: 'JJ',
    })
    .expect(200);
});
