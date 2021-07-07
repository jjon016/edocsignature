import { SignaturesSetListener } from '../signature-set-listener';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { SignaturesSetEvent } from '@edoccoding/common';
import { Message } from 'node-nats-streaming';
import { User } from '../../../models/user';

const setup = async (idofuser: string) => {
  //create an instance of the listener
  const listener = new SignaturesSetListener(natsWrapper.client);
  //create a fake data event
  const data: SignaturesSetEvent['data'] = {
    userid: idofuser,
  };
  //create a fake message argument
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Creates a user and then send message', async () => {
  const user = User.build({
    email: 'test@test.com',
    name: 'test user',
    password: '1234',
  });

  await user.save();

  const { listener, data, msg } = await setup(user._id);
  //call the onMessagefunction with the data and message object
  await listener.onMessage(data, msg);
  //write assertions to make sure user was updated
  const updatedUser = await User.findById(user._id);
  expect(updatedUser).toBeDefined();
  expect(updatedUser!.signatureset).toEqual(true);
  expect(msg.ack).toHaveBeenCalled();
});
