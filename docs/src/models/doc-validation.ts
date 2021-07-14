import { SigBoxAttrs, DocAttrs, SignerAttrs } from './doc';
import { SigBoxType } from '@edoccoding/common';
import validator from 'validator';

export const isSigner = (Signer: SignerAttrs) => {
  return (
    validator.isEmail(Signer.email) &&
    validator.isMongoId(Signer.signerid) &&
    validator.isNumeric(Signer.tiergroup.toString())
  );
};

export const isSigBox = (SigBox: SigBoxAttrs) => {
  return (
    parseFloat(SigBox.x.toString()) > 0 &&
    parseFloat(SigBox.y.toString()) > 0 &&
    parseFloat(SigBox.width.toString()) > 0 &&
    parseFloat(SigBox.height.toString()) > 0 &&
    parseInt(SigBox.fontsize.toString()) > 0 &&
    parseInt(SigBox.page.toString()) >= 0 &&
    SigBox.signerid != '' &&
    Object.values(SigBoxType).includes(SigBox.type as SigBoxType)
  );
};

export const isDoc = (theDoc: DocAttrs) => {
  var isValid = theDoc.docname != '';
  if (theDoc.sigboxes) {
    theDoc.sigboxes.map((box: SigBoxAttrs) => {
      isValid = isValid && isSigBox(box);
    });
  }
  if (theDoc.signers) {
    theDoc.signers.map((signer: SignerAttrs) => {
      isValid = isValid && isSigner(signer);
    });
  }
  return isValid;
};
