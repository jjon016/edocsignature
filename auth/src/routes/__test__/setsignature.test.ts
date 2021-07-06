import request from 'supertest';
import { app } from '../../app';
import { FontTypes } from '@edoccoding/common';

it('responds with 200 if updated successfully', async () => {
  const cookie = await global.signin();
  const res2 = await request(app)
    .post('/api/users/setsignature')
    .set('Cookie', cookie)
    .send({
      signaturetype: FontTypes.AlluraRegular,
      signature: 'Joshua Jones',
      initialstype: FontTypes.AlluraRegular,
      initials: 'JMJ',
    })
    .expect(200);
});
