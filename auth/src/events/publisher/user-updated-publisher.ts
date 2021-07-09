import { Publisher, Subjects, UserUpdatedEvent } from '@edoccoding/common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
