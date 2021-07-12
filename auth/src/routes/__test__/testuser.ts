import { FontTypes } from '@edoccoding/common';
import faker from 'faker';

export interface newusertype {
  email: string;
  password: string;
}

export const bademailuser = () => {
  return {
    email: 'testtestcom',
    password: faker.internet.password(),
  };
};

export const badpassworduser = () => {
  return {
    email: faker.internet.email(),
    password: '1',
  };
};

export const newuser = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const newfulluser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  let randomFontTypes = faker.random.arrayElement(Object.values(FontTypes));
  if (randomFontTypes == FontTypes.Drawn) {
    randomFontTypes = FontTypes.AlluraRegular;
  }
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: firstName + ' ' + lastName,
    initials: firstName.substr(0, 1) + ' ' + lastName.substr(0, 1),
    phone: faker.datatype
      .number({ min: 1000000000, max: 9999999999 })
      .toString(),
    signaturetype: randomFontTypes,
    initialstype: randomFontTypes,
  };
};

export const updateuser = (userinfo: newusertype) => {
  let user = newfulluser();
  user.email = userinfo.email;
  return user;
};

export const newtempuser = () => {
  return { email: faker.internet.email() };
};
