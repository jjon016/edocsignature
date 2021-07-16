var imageSizes = [];
function setimageSizes() {
  for (let i = 0; i < UploadedDoc.pages; i++) {
    imageSizes.push(getDim('canvas' + i.toString()));
  }
}
const LoadDocForSigning = async (ind) => {
  get('MainCellCard').innerHTML = '';
  get('NavBar').className = 'd-flex flex-row';
  UploadedDoc = DeepCopy(docsToSign[ind]);
  UploadedDoc.pdf = '/api/docs/image/' + UploadedDoc.id;
  await loadPDFtoDiv('MainCellCard', UploadedDoc.pdf);
  loadpdfcbfunction = 'drawBoxestoSign';
};
function clickBox(e) {
  let hasBoxToSign = false;
  let date = new Date();
  for (let i = 0; i < UploadedDoc.sigboxes.length; i++) {
    if (e.target.id == 'SigBox' + i.toString()) {
      e.target.innerHTML = UserData.name;
      e.target.className = UserData.signaturetype + ' position-absolute';
      e.target.style.fontSize = UserData.fontSize + 'px';
      UploadedDoc.sigboxes[i].clickedon = Date.parse(date);
    }
    if (
      !UploadedDoc.sigboxes[i].clickedon ||
      UploadedDoc.sigboxes[i].clickedon == ''
    ) {
      hasBoxToSign = true;
    }
  }
  if (!hasBoxToSign) {
    get('SigNav').innerHTML = 'Finish';
    console.log(UploadedDoc);
  }
}
function drawBoxestoSign() {
  setimageSizes();
  for (let i = 0; i < UploadedDoc.sigboxes.length; i++) {
    let box = UploadedDoc.sigboxes[i];
    if (box.signerid != UserData.id) {
      continue;
    }
    var elemDiv = document.createElement('div');
    elemDiv.id = 'SigBox' + i.toString();
    elemDiv.className = 'border border-success rounded SigBox';
    elemDiv.title = 'Required';
    elemDiv.innerHTML = 'Tap To Sign';
    elemDiv.style.fontSize = box.fontsize.toString() + 'px';
    elemDiv.style.lineHeight = elemDiv.style.fontSize;
    elemDiv.style.left =
      ((parseFloat(box.x) * imageSizes[box.page].width) / 100).toString() +
      'px';
    elemDiv.style.top =
      ((parseFloat(box.y) * imageSizes[box.page].height) / 100).toString() +
      'px';
    elemDiv.style.width =
      ((parseFloat(box.width) * imageSizes[box.page].width) / 100).toString() +
      'px';
    elemDiv.style.height =
      (
        (parseFloat(box.height) * imageSizes[box.page].height) /
        100
      ).toString() + 'px';
    document.getElementById(RenderToTarget).appendChild(elemDiv);
    const el = get(elemDiv.id);
    el.addEventListener('click', clickBox, false);
  }
}
