import { UserUpdatedListener } from '../user-updated-listener';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { UserUpdatedEvent, FontTypes } from '@edoccoding/common';
import { Message } from 'node-nats-streaming';
import { Signature } from '../../../models/signature';

const setup = async () => {
  //create a listener
  const listener = new UserUpdatedListener(natsWrapper.client);

  //create and save a signature
  const sig = Signature.build({
    userid: mongoose.Types.ObjectId().toHexString(),
    userversion: 0,
    signature: 'Test User',
    signaturetype: FontTypes.AlluraRegular,
    initials: 'TU',
    initialstype: FontTypes.AlluraRegular,
  });
  await sig.save();

  //create a fake data object
  const data: UserUpdatedEvent['data'] = {
    id: sig.userid,
    version: 1,
    name: 'Test User',
    email: 'test@test.com',
    phone: '8003212323',
    signature: 'Test T User',
    signaturetype: FontTypes.AnkeCallig,
    initials: 'TTU',
    initialstype: FontTypes.AnkeCallig,
  };

  //create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  //return all the items
  return { msg, data, sig, listener };
};

it('finds, updates, and saves a sig', async () => {
  const { msg, data, sig, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedSig = await Signature.findById(sig.id);

  expect(updatedSig!.signature).toEqual(data.signature);
  expect(updatedSig!.signaturetype).toEqual(data.signaturetype);
  expect(updatedSig!.userversion).toEqual(data.version);
  expect(updatedSig!.initials).toEqual(data.initials);
  expect(updatedSig!.initialstype).toEqual(data.initialstype);
});

it('can create a signer with minimal info', async () => {
  let userid = mongoose.Types.ObjectId().toHexString();
  const data: UserUpdatedEvent['data'] = {
    id: userid,
    version: 0,
    email: 'test@test.com',
  };
  const listener = new UserUpdatedListener(natsWrapper.client);

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const updatedSig = await Signature.findOne({ userid: userid });

  expect(updatedSig!.userid).toEqual(userid);
  expect(updatedSig!.userversion).toEqual(data.version);
});
