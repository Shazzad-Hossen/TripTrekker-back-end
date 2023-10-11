import agency from './agency/agency';
import demo from './demo/demo';
import division from './division/division';
import uploader from './fileUploader/uploader';
import place from './place/place';
import user from './user/user';

export const services = (app) => {
  app.configure(demo);
  app.configure(user);
  app.configure(division);
  app.configure(place);
  app.configure(uploader);
  app.configure(agency);
};
