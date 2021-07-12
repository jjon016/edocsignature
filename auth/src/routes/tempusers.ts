import express, { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { TempUser, ManyTempUsers } from '../models/tempuser';
import { User } from '../models/user';
import {
  BadRequestError,
  validateRequest,
  requireAuth,
} from '@edoccoding/common';

const router = express.Router();

router.post(
  '/api/users/tempusers',
  requireAuth,
  async (req: Request, res: Response) => {
    let { emails } = req.body;
    let users: Object[] = [];
    let removelist: String[] = [];

    const TempUsersMatching = await TempUser.find({ email: { $in: emails } });
    const UsersMatching = await User.find({ email: { $in: emails } });

    TempUsersMatching.map((user) => {
      users.push({ email: user.email, id: user.id });
      removelist.push(user.email);
    });

    UsersMatching.map((user) => {
      users.push({ email: user.email, id: user.id });
      removelist.push(user.email);
    });

    emails = emails.filter((email: string) => {
      return removelist.indexOf(email) < 0;
    });

    if (emails.length > 0) {
      let emaillist: Object[] = [];
      emails.map((eml: string) => {
        emaillist.push({ email: eml });
      });
      try {
        const newtempusers = await ManyTempUsers.insertMany(emaillist);
        if (newtempusers) {
          newtempusers.map((user: any) => {
            users.push({ email: user.email, id: user.id });
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    res.status(200).send(users);
  }
);

export { router as tempUsersRouter };
