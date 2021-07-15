import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/tosign',
  requireAuth,
  async (req: Request, res: Response) => {
    let docs = null;
    try {
      console.log('Looking for docs for: ' + req.currentUser!.id);
      docs = await Doc.find({ 'signers.signerid': req.currentUser!.id });
    } catch {
      throw new NotFoundError();
    }
    console.log(docs);
    res.send({ docs: docs });
  }
);

export { router as getDocsToSign };
