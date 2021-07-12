function get(someelement) {
  if (document.getElementById(someelement)) {
    return document.getElementById(someelement);
  }
  return false;
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
      showErrors(['Connection Error: ' + response.statusText]);
      return false;
    }
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
      page += '<li>' + err + '</li>';
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
