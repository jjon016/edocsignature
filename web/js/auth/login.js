const doLogin = async (email, password) => {
  res = await postData('/api/users/signin', {
    email: email,
    password: password,
  });
  if (res.errors) {
    showErrors(res.errors);
  } else {
    window.open('main.html', '_self');
  }
};
function Login(event) {
  event.preventDefault();
  let email = get('Email').value;
  let password = get('Password').value;
  if (email == '') {
    get('Email').focus();
    return false;
  }
  if (password == '') {
    get('Password').focus();
    return false;
  }
  res = doLogin(email, password);
}
const checkUser = async () => {
  res = await getData('/api/users/currentuser', {});
  if (res.errors) {
    showErrors(res.errors);
  } else {
    if (res.currentUser) {
      window.open('main.html', '_self');
    } else {
      get('Email').focus();
    }
  }
};
