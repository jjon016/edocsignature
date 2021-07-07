import { Message } from 'node-nats-streaming';
import { Listener, SignaturesSetEvent, Subjects } from '@edoccoding/common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class SignaturesSetListener extends Listener<SignaturesSetEvent> {
  subject: Subjects.SignaturesSet = Subjects.SignaturesSet;
  queueGroupName = queueGroupName;
  async onMessage(data: SignaturesSetEvent['data'], msg: Message) {
    const { userid } = data;
    let theuser = await User.findById(userid);
    if (!theuser) {
      console.log('User and version not found: ' + userid);
      return;
    }
    theuser.signatureset = true;
    await theuser.save();
    msg.ack();
  }
}
