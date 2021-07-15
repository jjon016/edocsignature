import express, { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { TempUser } from '../models/tempuser';
import { BadRequestError, validateRequest } from '@edoccoding/common';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    let id = mongoose.Types.ObjectId().toHexString();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const tempUser = await TempUser.findOne({ email });

    if (tempUser) {
      id = tempUser.id;
    }

    const user = User.build({ _id: id, email, password });
    await user.save();

    if (tempUser) {
      await TempUser.findByIdAndDelete(tempUser.id);
    }

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWTKEY!
    );

    //Store it on session object
    req.session = { jwt: userJwt };

    new UserUpdatedPublisher(natsWrapper.client).publish(user);

    res.status(201).send(user);
  }
);

export { router as signupRouter };
