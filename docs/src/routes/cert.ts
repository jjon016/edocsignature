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

    //create signed file if it doesn't exists
    if (!fs.existsSync(signedFile)) {
      console.log('signed file not found');
      throw new NotFoundError();
    }

    //sign completed doc
    console.log(signedFile);
    console.log(certfile);
    try {
      const signObj = new signer.SignPdf();
      const signedPDF = signObj.sign(
        fs.readFileSync(signedFile),
        fs.readFileSync(certfile),
        {
          passphrase: '2020',
        }
      );
    } catch (error) {
      throw new BadRequestError(error);
    }

    console.log('done applying cert');

    res.status(200).send({});
  }
);

export { router as certificateRouter };
