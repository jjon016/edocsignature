import { Message } from 'node-nats-streaming';
import {
  Listener,
  UserUpdatedEvent,
  Subjects,
  FontTypes,
} from '@edoccoding/common';
import { Signature } from '../../models/signature';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    let aSigner = null;
    if (data.version == 0) {
      aSigner = Signature.build({
        userid: data.id,
        userversion: data.version,
        signature: data.signature,
        signaturetype: data.signaturetype,
        initials: data.initials,
        initialstype: data.initialstype,
      });
    } else {
      //record should exists lets update it
      aSigner = await Signature.findOne({ userid: data.id });
      if (!aSigner || aSigner.userversion != data.version - 1) {
        throw new Error('Signature not found');
      }
      aSigner.set({
        userversion: data.version,
        signature: data.signature,
        signaturetype: data.signaturetype || FontTypes.AlluraRegular,
        initials: data.initials,
        initialstype: data.initialstype || FontTypes.AlluraRegular,
      });
    }
    await aSigner.save();
    msg.ack();
  }
}
