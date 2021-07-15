function drawSetup() {
  get('MainCellCard').innerHTML = '';
  get('SigElBar').className = 'd-flex flex-row';
  var select = get('signersel');
  select.innerHTML = '';

  for (var i = 0; i < UploadedDoc.signers.length; i++) {
    var opt = document.createElement('option');
    opt.value = UploadedDoc.signers[i].signerid;
    opt.innerHTML = UploadedDoc.signers[i].email;
    select.appendChild(opt);
  }
  loadPDFtoDiv('MainCellCard', UploadedDoc.pdf);
}
function CheckValidPercent(VALUE) {
  if (VALUE < 0) {
    VALUE = 0;
  }
  if (VALUE > 100) {
    VALUE = 99;
  }
  return VALUE;
}
function SaveBoxPercents() {
  var theTop = 0;
  var theBottom = 0;
  for (var p = 0; p < UploadedDoc.pages; p++) {
    var canrect = getDim('canvas' + p);
    theBottom = theBottom + parseFloat(canrect.height);
    for (var s = 0; s < UploadedDoc.sigboxes.length; s++) {
      var el = get(UploadedDoc.sigboxes[s].id);
      var eltop = parseFloat(el.style.top);
      var elleft = parseFloat(el.style.left);
      if (theTop <= eltop && eltop <= theBottom) {
        var y = eltop - theTop;
        var x = elleft;
        var w = parseFloat(el.style.width);
        var h = parseFloat(el.style.height);
        var ph = parseFloat(canrect.height);
        var pw = parseFloat(canrect.width);
        UploadedDoc.sigboxes[s].xp = CheckValidPercent((x * 100) / pw);
        UploadedDoc.sigboxes[s].yp = CheckValidPercent((y * 100) / ph);
        UploadedDoc.sigboxes[s].wp = CheckValidPercent((w * 100) / pw);
        UploadedDoc.sigboxes[s].hp = CheckValidPercent((h * 100) / ph);
        UploadedDoc.sigboxes[s].page = p;
        UploadedDoc.sigboxes[s].docnum = 0;
      }
    }
    theTop = theBottom;
  }
  if (UploadedDoc.sigboxes.length > 1) {
    UploadedDoc.sigboxes.sort(function (a, b) {
      if (a.yp < b.yp) {
        return -1;
      }
      if (a.yp > b.yp) {
        return 1;
      }
      return 0;
    });
    for (var s = 1; s < UploadedDoc.sigboxes.length; s++) {
      if (UploadedDoc.sigboxes[s].type == UploadedDoc.sigboxes[s - 1].type) {
        var ts = UploadedDoc.sigboxes[s].yp + 0.3;
        var te = UploadedDoc.sigboxes[s].yp - 0.3;
        if (
          ts > UploadedDoc.sigboxes[s - 1].yp &&
          UploadedDoc.sigboxes[s - 1].yp > te
        ) {
          UploadedDoc.sigboxes[s].yp = UploadedDoc.sigboxes[s - 1].yp;
        }
      }
    }
  }
}
function transformSigBoxFields() {
  let newboxes = [];
  UploadedDoc.sigboxes.map((sigbox) => {
    newboxes.push({
      x: sigbox.xp,
      y: sigbox.yp,
      width: sigbox.wp,
      height: sigbox.hp,
      page: sigbox.page,
      fontsize: parseInt(sigbox.fontsize),
      signerid: sigbox.signerid,
      type: 'signature',
      value: sigbox.fieldvalue,
    });
  });
  UploadedDoc.sigboxes = newboxes;
}
async function SaveSendDoc() {
  SaveBoxPercents();
  transformSigBoxFields();
  res = await postData('/api/docs/update', {
    id: UploadedDoc.id,
    signers: UploadedDoc.signers,
    sigboxes: UploadedDoc.sigboxes,
  });
  if (res.errors) {
    showErrors(res.errors);
  } else {
    window.open('landing.html', '_self');
  }
}
