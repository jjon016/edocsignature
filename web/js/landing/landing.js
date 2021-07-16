var docsToSign = [];
async function checkSigCreated() {
  res = await getData('/api/users/mydata');
  if (res.errors) {
    console.log(res.errors);
    showNeedData();
    return;
  }
  UserData = res;
  if (!UserData.name || UserData.name == '') {
    showNeedData();
  } else {
    await getDocsToSignList();
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
    '<p>You currently have no documents to sign. ' +
    'You can send a document for signing by clicking on the "Send Document" menu item. ' +
    'The "Manage Documents" menu item, allows you to review and see the current status of documents. ' +
    'If you would like to change your settings click the "Settings" menu item.</p>';
  page += '<p>Thanks for using eDOCSignature!</p>';
  page += '</div>';
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
function showNeedData() {
  let page = '<div class="container mt-3">';
  page += '<div class="row" style="max-width: 50%; margin: auto">';
  page += '<h4>Thanks for signing up for eDOCSignature!</h4>';
  page +=
    '<p style="margin-bottom: 0px">The first step for you to sign any document is to provide some information about yourself and adopt a signature. ' +
    'You can do that now by click the button below.</p>';
  page += '<div class="mb-3" style="text-align: center">';
  page +=
    '<button class="btn btn-success" onclick=\'window.open("profile.html","_self")\'>Get Started</button>';
  page += '</div>';
  page +=
    '<p>If you would like to send a document out for signing instead, you can do that by clicking on the "Send Document" menu item.</p>';
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
