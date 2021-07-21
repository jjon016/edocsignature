import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, DocStatus } from '@edoccoding/common';
import { Doc } from '../models/doc';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.post(
  '/api/docs/delete/',
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.body.id;

    const orgFile = path.join(__dirname, 'signings', id + '.pdf');
    const signedFile = path.join(
      __dirname,
      'signings',
      id + '_signed' + '.pdf'
    );

    if (fs.existsSync(orgFile)) {
      fs.unlinkSync(orgFile);
      console.log(orgFile + ' deleted');
    }
    if (fs.existsSync(signedFile)) {
      fs.unlinkSync(signedFile);
      console.log(signedFile + ' deleted');
    }

    const reslt = await Doc.deleteOne({
      _id: id,
      ownerid: req.currentUser!.id,
    });
    if (reslt.ok != 1 || reslt.deletedCount != 1) {
      console.log('unable to find record for delete: ' + id);
    }
    res.status(200).send(reslt);
  }
);

export { router as deleteDocRouter };
