import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@edoccoding/common';
import { Doc } from '../models/doc';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get(
  '/api/docs/image/:docid',
  requireAuth,
  async (req: Request, res: Response) => {
    const theFile = path.join(__dirname, 'signings', req.params.docid + '.pdf');
    const signedFile = path.join(
      __dirname,
      'signings',
      req.params.docid + '_signed' + '.pdf'
    );
    if (!fs.existsSync(theFile)) {
      throw new NotFoundError();
    }
    if (fs.existsSync(signedFile)) {
      res.download(signedFile);
    } else {
      res.download(theFile);
    }
  }
);

export { router as getDoc };
