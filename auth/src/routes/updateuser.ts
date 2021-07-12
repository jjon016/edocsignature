import express, { Router, Request, Response } from 'express';
import validator from 'validator';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher';
import {
  BadRequestError,
  validateRequest,
  requireAuth,
  FontTypes,
} from '@edoccoding/common';

const router = express.Router();

router.post(
  '/api/users/update',
  requireAuth,
  async (req: Request, res: Response) => {
    let {
      email,
      name,
      phone,
      password,
      signaturetype,
      signature,
      initialstype,
      initials,
    } = req.body;

    const id = req.currentUser!.id;

    const aUser = await User.findById(id);

    if (!aUser) {
      throw new BadRequestError('User not found');
    }

    if (email) {
      email = validator.trim(email);
      if (!validator.isEmail(email)) {
        throw new BadRequestError('Email invalid');
      }
      const sameEmail = await User.findOne({ email: email });
      if (sameEmail && sameEmail.id != aUser.id) {
        throw new BadRequestError('Email already being used');
      }
      aUser.email = email;
    }

    if (name) {
      name = validator.trim(name);
      if (!validator.isLength(name, { min: 6, max: 120 })) {
        throw new BadRequestError('Name invalid');
      }
      aUser.name = name;
    }

    if (phone) {
      phone = validator.trim(phone.toString());
      if (!validator.isLength(phone, { min: 10, max: 10 })) {
        throw new BadRequestError('Phone invalid');
      }
      if (!validator.isNumeric(phone)) {
        throw new BadRequestError('Phone must be numeric');
      }
      aUser.phone = phone;
    }

    if (password) {
      password = validator.trim(password);
      if (!validator.isLength(password, { min: 4, max: 20 })) {
        throw new BadRequestError('Password must be 6-20 characters');
      }
      aUser.password = password;
    }

    if (signaturetype) {
      if (!Object.values(FontTypes).includes(signaturetype)) {
        throw new BadRequestError('Invalid signature type');
      }
      aUser.signaturetype = signaturetype;
    }

    if (signature) {
      signature = validator.trim(signature);
      if (!validator.isLength(signature, { min: 6 })) {
        throw new BadRequestError('Signature must be 6 or more characters');
      }
      aUser.signature = signature;
    }

    if (initialstype) {
      if (!Object.values(FontTypes).includes(initialstype)) {
        throw new BadRequestError('Invalid initials type');
      }
      aUser.initialstype = initialstype;
    }

    if (initials) {
      initials = validator.trim(initials);
      if (!validator.isLength(initials, { min: 2 })) {
        throw new BadRequestError('Initials must be 2 or more characters');
      }
      aUser.initials = initials;
    }

    await aUser.save();

    new UserUpdatedPublisher(natsWrapper.client).publish(aUser);

    res.status(200).send(aUser);
  }
);

export { router as updateUserRouter };
