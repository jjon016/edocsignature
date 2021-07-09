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
    const { signature, signaturetype, initials, initialstype } = data;
    const userversion = data.version;
    const userid = data.id;
    let aSigner = null;
    if (userversion == 0) {
      //create new record
      aSigner = Signature.build({
        userversion,
        userid,
        signature: signature || '',
        signaturetype: signaturetype || FontTypes.AlluraRegular,
        initials: initials || '',
        initialstype: initialstype || FontTypes.AlluraRegular,
      });
    } else {
      //record should exists lets update it
      aSigner = await Signature.findOne({ userid });
      if (!aSigner || aSigner.userversion != userversion - 1) {
        throw new Error('Signature not found');
      }
      aSigner.set({
        userversion,
        signature: signature || '',
        signaturetype: signaturetype || FontTypes.AlluraRegular,
        initials: initials || '',
        initialstype: initialstype || FontTypes.AlluraRegular,
      });
    }
    await aSigner.save();
    msg.ack();
  }
}
