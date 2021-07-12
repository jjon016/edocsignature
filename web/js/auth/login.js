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
  console.log(
    postData('/api/users/signin', { email: email, password: password })
  );
}
