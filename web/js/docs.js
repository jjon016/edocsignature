var Doc = class {
  constructor(id, pdf, sigboxes, signers) {
    Object.assign(this, { id, pdf, sigboxes, signers });
  }
};

var CurrentDoc = 0;
var UploadedDoc = null;
