import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, DocStatus } from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/tosign/',
  requireAuth,
  async (req: Request, res: Response) => {
    let docs = null;
    docs = await Doc.find({
      'signers.signerid': req.currentUser!.id,
      docstatus: DocStatus.Signing,
    });
    res.send({ docs: docs });
  }
);

export { router as getDocsToSign };
