function drawSelectSigners() {
  let page = '<div class="container">';
  page += '<div class="row">';
  page += '<form onsubmit="setSigners(event);">';
  page += '<div class="d-flex mt-3">';
  page +=
    '<h4>Please provide the email address of each signer on the document</h4>';
  page +=
    '<i class="fa fa-user-plus text-success" style="font-size: 27px; margin-left: auto"></i>';
  page += '</div>';
  page += '<div class="row d-flex">';
  page += '<div class="col">Email Address</div>';
  page += '<div class="col">Signing Order Group</div>';
  page += '</div>';
  page += '<div class="row d-flex">';
  page += '<div class="col">';
  page += '<input type="text" id="Email" class="form-control" />';
  page += '</div>';
  page += '<div class="col">';
  page += '<select name="Tier" id="Tier" class="form-control">';
  page += '<option value="0">0</option>';
  page += '</select>';
  page += '</div>';
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
async function setSigners(event) {
  event.preventDefault();
  if (get('Email').value == '') {
    get('Email').focus();
    return;
  }
  var emails = [get('Email').value];
  res = await postData('/api/users/tempusers', {
    emails: emails,
  });
  if (res.errors) {
    showErrors(res.errors);
  } else {
    UploadedDoc.signers.push({
      signerid: res[0].id,
      email: res[0].email,
      tiergroup: get('Tier').value,
    });
    drawSetup();
  }
}
