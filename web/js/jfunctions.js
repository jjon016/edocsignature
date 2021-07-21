var UserData = [];
function get(someelement) {
  if (document.getElementById(someelement)) {
    return document.getElementById(someelement);
  }
  return false;
}
function DeepCopy(TheArray) {
  return JSON.parse(JSON.stringify(TheArray));
}
async function getData(url) {
  hideErrors();
  try {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    if (!response.ok) {
      throw 'Error making request: ' + response.statusText;
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    return { errors: [{ message: error }] };
  }
}
async function postData(url = '', data = {}) {
  hideErrors();
  try {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (!response.ok) {
      throw 'Error making request: ' + response.statusText;
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    return { errors: [{ message: error }] };
  }
}
async function postFileData(url, file, json) {
  hideErrors();
  try {
    var data = new FormData();
    data.append('FILE', file.files[0]);
    data.append('JSON', JSON.stringify(json));
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: data, // body data type must match "Content-Type" header
    });
    if (!response.ok) {
      throw 'Error making request: ' + response.statusText;
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    return { errors: [{ message: error }] };
  }
}
function showErrors(errors) {
  if (get('errors')) {
    let page =
      '<div class="alert alert-danger"><h5>Ooops ....</h5><ul class="my-0">';
    errors.map((err) => {
      if (err.message) {
        page += '<li>' + err.message + '</li>';
      } else {
        page += '<li>' + err + '</li>';
      }
    });
    page += '</ul></div>';
    get('errors').innerHTML = page;
    get('errors').className = 'row';
  }
}
function hideErrors() {
  if (get('errors')) {
    get('errors').innerHTML = '';
    get('errors').className = 'd-none';
  }
}
function extractfilename(fullPath) {
  let name = fullPath.split('\\').pop().split('/').pop();
  if (name.indexOf('.') >= 0) {
    return name.split('.')[0];
  }
  return name;
}
function getDim(elname) {
  var rect = get(elname).getBoundingClientRect();
  return rect;
}
function getFSFast(bw, bh, nc) {
  var dif = parseInt(bw) / parseInt(nc);
  if (dif > 10) {
    return Math.min(bh - 3, parseInt(dif)).toString() + 'px';
  } else {
    return parseInt(dif * 1.5).toString() + 'px';
  }
}
function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}
const verifyUser = async () => {
  let res = null;
  try {
    res = await getData('/api/users/currentuser', {});
    if (!res.currentUser) {
      window.open('index.html', '_self');
    }
  } catch (error) {
    if (!res || !res.currentUser) {
      window.open('index.html', '_self');
    }
  }
};
function drawHeader(apage) {
  let page = '<nav class="navbar navbar-expand-md navbar-dark">';
  page +=
    '<a href="#" class="navbar-brand"><img src="images/eDOCLogo2.png" style="width: 50px" /></a>';
  page +=
    '<button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">';
  page += '<span class="navbar-toggler-icon"></span>';
  page += '</button>';
  page +=
    '<div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">';
  page += '<div class="navbar-nav text-white">';
  page +=
    '<a href="setup.html" target="_self" class="nav-item nav-link' +
    (apage == 'setup' ? ' active' : '') +
    '">Send Document</a>';
  page +=
    '<a href="manage.html" target="_self" class="nav-item nav-link' +
    (apage == 'manage' ? ' active' : '') +
    '">Manage Document</a>';
  page +=
    '<a href="profile.html" target="_self" class="nav-item nav-link' +
    (apage == 'profile' ? ' active' : '') +
    '">Settings</a>';
  page += '</div>';
  page += '<div class="navbar-nav">';
  page +=
    '<i class="btn fa fa-sign-out text-white" style="font-size: 40px" aria-hidden="true" onclick="doSignout()"></i>';
  page += '</div>';
  page += '</div>';
  page += '</nav>';
  get('header').innerHTML = page;
}
