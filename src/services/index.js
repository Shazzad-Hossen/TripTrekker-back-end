import agency from './agency/agency';
import Comment from './comment/comment';
import dashboard from './dashboard/dashboard';
import demo from './demo/demo';
import division from './division/division';
import uploader from './fileUploader/uploader';
import hotel from './hotel/hotel';
import order from './order/order';
import packages from './package/package';
import payment from './payment/payment';
import place from './place/place';
import Post from './post/post';
import user from './user/user';

export const services = (app) => {
  app.configure(demo);
  app.configure(user);
  app.configure(division);
  app.configure(place);
  app.configure(uploader);
  app.configure(agency);
  app.configure(hotel);
  app.configure(packages);
  app.configure(order);
  app.configure(payment);
  app.configure(dashboard);
  app.configure(Post);
  app.configure(Comment);
};
