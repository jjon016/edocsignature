var docsToSign = [];
var imageSizes = [];
function setimageSizes() {
  for (let i = 0; i < UploadedDoc.pages; i++) {
    imageSizes.push(getDim('canvas' + i.toString()));
  }
}
const getDocsToSignList = async () => {
  res = await getData('/api/docs/tosign/');
  if (res.errors) {
    console.log(res.errors);
    showWelcome();
  } else {
    docsToSign = res.docs;
    if (docsToSign.length == 0) {
      showWelcome();
    } else {
      showDocList();
    }
  }
};
function showWelcome() {
  let page = '<div class="container">';
  page += '<div class="row text-center mt-2">';
  page += '<h3>Welcome</h3>';
  page +=
    '<p>You currently have no documents to sign. You can send a document for signing by clicking on the "Send Document" menu item. The "Manage Documents" menu item, allows you to review and see the current status of documents. If you would like to change your settings click the "Settings" menu item.</p>';
  page += '<p>Thanks for using eDOCSignature!</p>';
  page += '</div>';
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
function showDocList() {
  let page = '<div class="container mt-3">';
  page += '<h4 class="text-center">You have documents to sign!</h4>';
  for (let i = 0; i < docsToSign.length; i++) {
    page +=
      '<div class="border border-success p-2 mt-2 rounded" style="cursor: pointer" onclick="LoadDocForSigning(' +
      i.toString() +
      ')">';
    page +=
      '<i class="fa fa-file text-success mx-2" aria-hidden="true"></i>' +
      docsToSign[i].docname;
    page += '</div>';
  }
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
const LoadDocForSigning = async (ind) => {
  get('MainCellCard').innerHTML = '';
  get('NavBar').className = 'd-flex flex-row';
  UploadedDoc = DeepCopy(docsToSign[ind]);
  UploadedDoc.pdf = '/api/docs/image/' + UploadedDoc.id;
  await loadPDFtoDiv('MainCellCard', UploadedDoc.pdf);
  loadpdfcbfunction = 'drawBoxestoSign';
};
function drawBoxestoSign() {
  setimageSizes();
  for (let i = 0; i < UploadedDoc.sigboxes.length; i++) {
    let box = UploadedDoc.sigboxes[i];
    var elemDiv = document.createElement('div');
    elemDiv.id = 'SigBox' + i.toString();
    elemDiv.className = 'border border-success rounded position-absolute';
    elemDiv.title = 'Required';
    elemDiv.innerHTML =
      '<span style="position:absolute;top:0px;left:0px;">Tap To Sign</span>';
    elemDiv.style.background = 'rgb(211, 253, 245)';
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
  }
}
