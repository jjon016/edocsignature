import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@edoccoding/common';
import { body } from 'express-validator';
import { Doc, isDoc } from '../models/doc';
import { SigBox, SigBoxDoc } from '../models/sigbox';
import { randomBytes } from 'crypto';

const router = express.Router();

router.post('/api/docs/', requireAuth, async (req: Request, res: Response) => {
  const id = randomBytes(4).toString('hex');
  console.log(req.files);
  console.log(req.body.JSON);
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.FILE) {
    return res.status(400).send('No files uploaded');
  }
  if ((req.files.FILE as any).mimetype != 'application/pdf') {
    return res.status(401).send('Invalid file uploaded');
  }
  const uploadPath = __dirname + '\\signings\\' + id + '.pdf';
  console.log(uploadPath);
  (req.files.FILE as any).mv(uploadPath, function (err: any) {
    if (err) return res.status(500).send(err);
  });

  const theJSON = JSON.parse(req.body.JSON);
  if (!isDoc(theJSON)) {
    throw new BadRequestError('Invalid data in request');
  }
  const sigboxes = theJSON.sigboxes;
  let SigBoxDocs: Array<SigBoxDoc> = [];
  sigboxes.map((box: SigBoxDoc) => {
    SigBoxDocs.push(new SigBox(box));
  });
  const doc = Doc.build({
    docid: id,
    docname: theJSON.docname,
    ownerid: theJSON.ownerid,
    docstatus: theJSON.docstatus,
    sigboxes: SigBoxDocs,
  });
  await doc.save();
  res.status(201).send(doc);
});

export { router as newDocRouter };
