import demo from './demo/demo';
import division from './division/division';
import user from './user/user';

export const services = (app) => {
  app.configure(demo);
  app.configure(user);
  app.configure(division);
};
