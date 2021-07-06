import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/:docid',
  requireAuth,
  async (req: Request, res: Response) => {
    const doc = await Doc.find({
      docid: req.params.docid,
      ownerid: req.currentUser!.id,
    });

    if (!doc || doc.length == 0) {
      throw new NotFoundError();
    }

    res.send(doc);
  }
);

export { router as getDocData };
