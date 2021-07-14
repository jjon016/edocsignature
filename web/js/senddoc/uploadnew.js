function drawUploadNew() {
  let page = '<div class="container">';
  page += '<div class="row">';
  page += '<form onsubmit="uploadNewDoc(event);" class="mt-3">';
  page += '<div class="form-group">';
  page += '<label for="upDoc">Browse for document to send for signing</label>';
  page +=
    '<input type="file" class="form-control" id="upDoc" accept="application/pdf" onchange="setDocName(event);" />';
  page += '</div>';
  page += '<div class="form-group mt-1">';
  page += '<label for="docName">Choose document name</label>';
  page += '<input type="text" class="form-control" id="docName" />';
  page += '</div>';
  page += '<div class="form-group mt-1 d-flex flex-row-reverse">';
  page +=
    '<input type="submit" class="btn btn-block btn-primary" value="Continue" />';
  page += '</div>';
  page += '</form>';
  page += '</div>';
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
function setDocName(event) {
  get('docName').value = extractfilename(event.target.files[0].name);
}
const uploadNewDoc = async (event) => {
  event.preventDefault();
  var theFile = get('upDoc');
  var theName = get('docName').value;
  res = await postFileData('/api/docs/', theFile, { docname: theName });
  UploadedDoc = new Doc(res.id, '/api/docs/' + res.id, [], []);
  drawSelectSigners();
};
