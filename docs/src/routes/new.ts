import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@edoccoding/common';
import { Doc, isDoc } from '../models/doc';
import { SigBox, SigBoxAttrs } from '../models/sigbox';
import { randomBytes } from 'crypto';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.post('/api/docs/', requireAuth, async (req: Request, res: Response) => {
  const id = randomBytes(4).toString('hex');
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.FILE) {
    return res.status(400).send('No files uploaded');
  }
  if ((req.files.FILE as any).mimetype != 'application/pdf') {
    return res.status(401).send('Invalid file uploaded');
  }
  const uploadPath = path.join(__dirname, 'signings');
  const fileName = id + '.pdf';
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
  (req.files.FILE as any).mv(
    path.join(uploadPath, fileName),
    function (err: any) {
      if (err) return res.status(500).send(err);
    }
  );

  const theJSON = JSON.parse(req.body.JSON);
  if (!isDoc(theJSON)) {
    throw new BadRequestError('Invalid data in request');
  }
  const sigboxes = theJSON.sigboxes;
  let SigBoxDocs: Array<SigBoxAttrs> = [];
  sigboxes.map((box: SigBoxAttrs) => {
    SigBoxDocs.push(new SigBox(box));
  });
  const doc = Doc.build({
    docid: id,
    docname: theJSON.docname,
    ownerid: theJSON.ownerid || req.currentUser!.id,
    docstatus: theJSON.docstatus,
    sigboxes: SigBoxDocs,
  });
  await doc.save();
  res.status(201).send(doc);
});

export { router as newDocRouter };
