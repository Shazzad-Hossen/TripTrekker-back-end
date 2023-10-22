import Package from './package.schema';
import User from "../user/user.schema";


const allowedQuery = new Set(['status','type', 'sortBy', 'status']);

export const registerPackage = ({ db }) => async (req, res) => {
  try {


    const duration = {
      day: req.body.day,
      night: req.body.night,
    };
    delete req.body.duration
    const result = await db.create({ table: Package, key: { ...req.body, duration } });
    if (!result) return res.status(400).send('Bad Request');
    res.status(201).send(result);


  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}


export const getAllPackages = ({ db }) => async (req, res) => {
  if (req.query.type !== "agency" && req.query.type !== "hotel") delete req.query.type;

  const packages = await db.find({ table: Package, key: {query: req.query, allowedQuery: allowedQuery, populate: { path: 'agency hotel', select: 'name'} } });
  if (!packages) return res.status(400).send("Bad Request");
  res.status(200).send(packages);
  try {

  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}

export const getSinglePackage = ({ db }) => async (req, res) => {
  if (!req.params.id) return res.status(400).send('Bad Request');
  const packages = await db.findOne({ table: Package, key: {id: req.params.id } });
  if (!packages) return res.status(400).send("Bad Request");
  res.status(200).send(packages);
  try {

  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}

export const updatePackage = ({ db }) => async (req, res) => {

  if (!req.body.id) return res.status(400).send("Bad Request");
  const response = await db.findOne({ table: Package, key: { id: req.body.id } });
  Object.keys(req.body).forEach((k) => (response[k] = req.body[k]));
  await db.save(response);
  res.status(200).send(response);



  try {

  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}



export const removePackage = ({ db }) => async (req, res) => {
  if (!req.params.id) return res.status(400).send("Bad Request");
  const result = await db.remove({ table: Package, key: { id: req.params.id } });
  if (!result) return res.status(400).send("Bad Request");
  res.status(200).send(result);

  try {

  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}



