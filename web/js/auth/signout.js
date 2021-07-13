const doSignout = async () => {
  res = await getData('/api/users/signout', {});
  if (res.errors) {
    showErrors(res.errors);
  } else {
    window.open('index.html', '_self');
  }
};
