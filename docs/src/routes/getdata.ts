import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  currentUser,
} from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/:docid',
  requireAuth,
  async (req: Request, res: Response) => {
    const doc = await Doc.find({
      docid: req.params.docid,
      ownerid: req.currentUser!.id,
    }).populate({
      path: 'sigboxes',
      populate: { path: 'sigboxes' },
    });

    if (!doc) {
      throw new NotFoundError();
    }

    res.send(doc);
  }
);

export { router as getDocData };
