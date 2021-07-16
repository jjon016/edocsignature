import express, { Request, Response } from 'express';
import { Doc } from '../models/doc';
import { Signature } from '../models/signature';
import path from 'path';
import fs from 'fs';
import {
  PDFDocument,
  rgb,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
} from 'pdf-lib';
import { getFontbyName } from './helpers/fonts';
import fontkit from '@pdf-lib/fontkit';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  DocStatus,
} from '@edoccoding/common';
const signer = require('node-signpdf');
const PDFArrayCustom = require('./helpers/PDFArray');

const SIGNATURE_LENGTH = 3322;

const router = express.Router();

router.post(
  '/api/docs/sign',
  requireAuth,
  async (req: Request, res: Response) => {
    let { id, sigbox } = req.body;

    const doc = await Doc.findById(id);

    if (!doc) {
      throw new BadRequestError('Document not found');
    }

    const sig = await Signature.findOne({ userid: req.currentUser!.id });

    if (!sig) {
      throw new BadRequestError('Signature not found');
    }

    console.log(sig);

    console.log('looking up font for ' + sig.signaturetype);

    const fontFile = getFontbyName(sig.signaturetype);

    if (!fs.existsSync(fontFile)) {
      console.log('Unable to find ' + fontFile);
      throw new NotFoundError();
    }

    console.log('font file found');

    const index = doc.sigboxes.findIndex((p) => p._id == sigbox._id);

    if (index < 0) {
      console.log('Unable to find signature box');
      throw new NotFoundError();
    }

    console.log('checking signer on box');

    if (doc.sigboxes[index].signerid != req.currentUser!.id) {
      console.log('Box does not belong to owner');
      throw new NotAuthorizedError();
    }

    //lets sign the doc, check to make sure our pdf exists first
    const orgFile = path.join(__dirname, 'signings', doc.id + '.pdf');
    const signedFile = path.join(
      __dirname,
      'signings',
      doc.id + '_signed' + '.pdf'
    );
    console.log(orgFile);
    console.log(signedFile);
    if (!fs.existsSync(orgFile)) {
      console.log('Unable to find originalpdf: ' + orgFile);
      throw new NotFoundError();
    }
    //create signed file if it doesn't exists
    if (!fs.existsSync(signedFile)) {
      fs.copyFileSync(orgFile, signedFile);
    }
    console.log('setting up pdf');
    //setup pdf
    const thepdf = await PDFDocument.load(fs.readFileSync(signedFile));
    const fontBytes = fs.readFileSync(fontFile);
    thepdf.registerFontkit(fontkit);
    let customFont = await thepdf.embedFont(fontBytes);
    const pagecount = thepdf.getPageCount();
    const page = thepdf.getPage(sigbox.page);
    const pages = thepdf.getPages();

    const x = (doc.sigboxes[index].x * page.getWidth()) / 100;
    let y = ((100 - doc.sigboxes[index].y) * page.getHeight()) / 100;
    const width = (doc.sigboxes[index].width * page.getWidth()) / 100;
    const height = (doc.sigboxes[index].height * page.getHeight()) / 100;
    y = y - height / 2;
    let fontsize = doc.sigboxes[index].fontsize;
    while (true) {
      let textWidth = customFont.widthOfTextAtSize(sig.signature, fontsize);
      let textHeight = customFont.heightAtSize(fontsize);
      if ((textWidth <= width && textHeight <= height) || fontsize == 10) {
        break;
      }
      fontsize--;
    }

    try {
      page.drawText(sig.signature, {
        x: x,
        y: y,
        size: fontsize,
        font: customFont,
        color: rgb(0, 0, 0),
      });
      /*page.drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderColor: rgb(1, 0, 0),
        borderWidth: 1.5,
      });*/
    } catch (error) {
      throw new BadRequestError(error);
    }

    console.log('sig drawn');
    //check if this is the last box and close the doc if it is
    const notsignind = doc.sigboxes.findIndex((p) => {
      p.clickedon == undefined;
    });
    if (notsignind < 0) {
      console.log('last box adding sig placeholder');
      //add the placeholder for the signature

      const ByteRange = PDFArrayCustom.withContext(thepdf.context);

      ByteRange.push(PDFNumber.of(0));
      ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
      ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
      ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));

      const signatureDict = thepdf.context.obj({
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange,
        Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
        Reason: PDFString.of('Signature required on this document'),
        M: PDFString.fromDate(new Date()),
      });
      const signatureDictRef = thepdf.context.register(signatureDict);

      const widgetDict = thepdf.context.obj({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        Rect: [0, 0, 0, 0],
        V: signatureDictRef,
        T: PDFString.of('Signature1'),
        F: 4,
        P: pages[0].ref,
      });
      const widgetDictRef = thepdf.context.register(widgetDict);

      // Add our signature widget to the first page
      pages[0].node.set(
        PDFName.of('Annots'),
        thepdf.context.obj([widgetDictRef])
      );

      // Create an AcroForm object containing our signature widget
      thepdf.catalog.set(
        PDFName.of('AcroForm'),
        thepdf.context.obj({
          SigFlags: 3,
          Fields: [widgetDictRef],
        })
      );
      doc.docstatus = DocStatus.Complete;
    }
    console.log('writing saved pdf');
    try {
      fs.writeFileSync(
        signedFile,
        await thepdf.save({ useObjectStreams: false })
      );
    } catch (error) {
      throw new BadRequestError(error);
    }
    console.log('saved signed file');

    await doc.save();

    res.status(200).send({});
  }
);

export { router as signRouter };
