import Package from './package.schema';
import User from "../user/user.schema";


const allowedQuery = new Set(['status','type', 'sortBy', 'status', 'paginate', 'place', 'hotel', 'agency', 'hotel', 'limit', 'search', 'id']);

export const registerPackage = ({ db, lyra }) => async (req, res) => {
  try {


    const duration = {
      day: req.body.day,
      night: req.body.night,
    };
    delete req.body.duration
    const result = await db.create({ table: Package, key: { ...req.body, duration, populate: { path: 'agency hotel place division', select: 'name' } } });
    if (!result) return res.status(400).send('Bad Request');
    await lyra.insert('package', {id: result._id.toString(), name: req.body.name})
    res.status(201).send(result);


  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}


export const getAllPackages = ({ db, lyra }) => async (req, res) => {
  if (req.query.type !== "agency" && req.query.type !== "hotel") delete req.query.type;
  if (req.query.search) {
    const data = await lyra.search('package', { term: req.query.search });
    const Ids = data.hits.map(elem => elem.id);
    req.query.id = { $in: Ids };
    delete req.query.search;
  }

  const packages = await db.find({ table: Package, key: {query: req.query, paginate: req.query.paginate==='true', allowedQuery: allowedQuery, populate: { path: 'agency hotel place division', select: 'name'} } });
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
  const packages = await db.findOne({ table: Package, key: {id: req.params.id, populate: { path:'division place agency hotel'} } });
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
  await db.populate(response, { path: "division place agency hotel" });
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



