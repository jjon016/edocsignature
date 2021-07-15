function drawProfilePage() {
  let page = '<div class="container mt-3">';
  page += '<div class="row">';
  page += '<form onsubmit="SaveUserData(event)">';
  page += '<h4 class="text-center">Update your information</h4>';
  page += '<div class="form-group">';
  page += '<label>Email Address</label>';
  page +=
    '<input type="text" id="Email" value="' +
    UserData.email +
    '" class="form-control" />';
  page += '</div>';
  page += '<div class="form-group">';
  page += '<label>Password</label>';
  page +=
    '<input type="password" id="Password" value="" class="form-control" />';
  page += '</div>';
  page += '<div class="form-group">';
  page += '<label>Full Name</label>';
  page +=
    '<input type="text" id="Name" value="' +
    UserData.name +
    '" class="form-control" />';
  page += '</div>';
  page += '<div class="form-group">';
  page += '<label>Initials</label>';
  page +=
    '<input type="text" value="' +
    UserData.initials +
    '" id="Initials" class="form-control" />';
  page += '</div>';
  page += '<div class="form-group">';
  page += '<label>Mobile Phone</label>';
  page +=
    '<input type="text" id="Phone" value="' +
    UserData.phone +
    '" class="form-control" />';
  page += '</div>';
  page += '<div class="form-group">';
  page +=
    '<button class="btn btn-success mt-3 float-end" onclick="SaveUserData(event);">Adopt a Signature</button>';
  page += '</div>';
  page += '</form>';
  page += '</div>';
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
function drawAdpotSig() {
  let page = '<div class="FontSelector mt-3">';
  page += '<h4>Select a Signature to Adopt</h4>';
  page +=
    '<div onclick=\'AdoptSig("alluraregular")\' class="Font alluraregular">' +
    UserData.name +
    '</div>';
  page +=
    '<div onclick=\'AdoptSig("ankecallig")\' class="Font ankecallig">' +
    UserData.name +
    '</div>';
  page +=
    '<div onclick=\'AdoptSig("blackjack")\' class="Font blackjack">' +
    UserData.name +
    '</div>';
  page +=
    '<div onclick=\'AdoptSig("dancingscript")\' class="Font dancingscript">' +
    UserData.name +
    '</div>';
  page +=
    '<div onclick=\'AdoptSig("gradecursive")\' class="Font gradecursive">' +
    UserData.name +
    '</div>';
  page += '</div>';
  get('MainCellCard').innerHTML = page;
}
function SaveUserData(event) {
  event.preventDefault();
  if (get('Email').value == '') {
    get('Email').focus();
    return false;
  }
  if (get('Name').value == '') {
    get('Name').focus();
    return false;
  }
  if (get('Initials').value == '') {
    get('Initials').focus();
    return false;
  }
  UserData.email = get('Email').value;
  UserData.password = get('Password').value;
  UserData.name = get('Name').value;
  UserData.phone = get('Phone').value;
  UserData.initials = get('Initials').value;
  drawAdpotSig();
}
async function getMyData() {
  res = await getData('/api/users/mydata');
  if (res.errors) {
    console.log(res.errors);
  } else {
    UserData = res;
    drawProfilePage();
  }
}
async function AdoptSig(SelFont) {
  UserData.signaturetype = SelFont;
  UserData.initialstype = SelFont;
  res = await postData('/api/users/update', UserData);
  if (res.errors) {
    showErrors(res.errors);
  } else {
    window.open('landing.html', '_self');
  }
}
