import { Publisher, Subjects, SignaturesSetEvent } from '@edoccoding/common';

export class SignaturesSetPublisher extends Publisher<SignaturesSetEvent> {
  subject: Subjects.SignaturesSet = Subjects.SignaturesSet;
}
