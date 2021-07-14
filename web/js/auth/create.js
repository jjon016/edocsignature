const doCreate = async (email, password) => {
  res = await postData('/api/users/signup', {
    email: email,
    password: password,
  });
  if (res.errors) {
    showErrors(res.errors);
  } else {
    window.open('landing.html', '_self');
  }
};
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
  doCreate(email, password);
}
