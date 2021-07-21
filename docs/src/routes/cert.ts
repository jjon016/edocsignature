import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
} from '@edoccoding/common';
const signer = require('node-signpdf');

const certfile = path.join(__dirname, 'helpers', 'cer.p12');

const router = express.Router();

router.post(
  '/api/docs/cert',
  requireAuth,
  async (req: Request, res: Response) => {
    let { id } = req.body;

    if (!fs.existsSync(certfile)) {
      console.log('certificate not found');
      throw new NotFoundError();
    }

    const signedFile = path.join(
      __dirname,
      'signings',
      id + '_signed' + '.pdf'
    );

    if (!fs.existsSync(signedFile)) {
      console.log('signed file not found');
      throw new NotFoundError();
    }

    //sign completed doc
    console.log(signedFile);
    console.log(certfile);
    const p12Buffer = fs.readFileSync(certfile);
    const pdfBuffer = fs.readFileSync(signedFile);

    const signObj = new signer.SignPdf();
    const signedPDFBuffer = signObj.sign(pdfBuffer, p12Buffer, {
      passphrase: '2020',
    });

    fs.writeFileSync(signedFile, signedPDFBuffer);

    console.log('done applying cert');

    res.status(200).send({});
  }
);

export { router as certificateRouter };
