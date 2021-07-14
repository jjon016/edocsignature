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
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    showErrors([error]);
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
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    showErrors([error]);
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
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    showErrors([error]);
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
  } catch (error) {
    if (!res || !res.currentUser) {
      window.open('index.html', '_self');
    }
  }
};
