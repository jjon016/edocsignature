var signerDocs = [];
const getSignerDocList = async () => {
  res = await getData('/api/docs/signerdocs/');
  if (res.errors) {
    showErrors(res.errors);
  } else {
    signerDocs = res.docs;
    if (signerDocs.length == 0) {
      get('MainCellCard').innerHTML =
        'You do not have any documents sent out for signing';
    } else {
      showSignerDocList();
    }
  }
};
function OpenDoc(ind) {
  window.open('/api/docs/image/' + signerDocs[ind].id);
}
async function DeleteDoc(ind) {
  res = await postData('/api/docs/delete/', { id: signerDocs[ind].id });
  if (res.errors) {
    showErrors(res.errors);
  } else {
    signerDocs.splice(ind, 1);
    if (signerDocs.length == 0) {
      get('MainCellCard').innerHTML =
        'You do not have any documents sent out for signing';
    } else {
      showSignerDocList();
    }
  }
}
function showSignerDocList() {
  let page = '<div class="container mt-3">';
  page += '<h4 class="text-center">Your document list</h4>';
  for (let i = 0; i < signerDocs.length; i++) {
    page +=
      '<div class="border border-success p-2 mt-2 rounded" style="cursor: pointer">';
    page +=
      '<i class="fa fa-file text-success mx-2" aria-hidden="true" onclick="OpenDoc(' +
      i +
      ')"></i>';
    page += signerDocs[i].docname;
    page +=
      '<i class="fa fa-trash text-danger mx-2" style="font-size: 20px; float: right" aria-hidden="true" onclick="DeleteDoc(' +
      i +
      ')"></i>';
    page += '</div>';
  }
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
