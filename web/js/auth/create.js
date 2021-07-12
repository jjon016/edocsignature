function CreateAccount(event) {
  event.preventDefault();
  hideErrors();
  let cpass = get('ConfirmPassword').value;
  let email = get('Email').value;
  let password = get('Password').value;
  if (password == '') {
    get('Password').focus();
    return false;
  }
  if (cpass != password) {
    showErrors(['Passwords did not match']);
    return false;
  }
  console.log(
    postData('/api/users/signup', { email: email, password: password })
  );
}
