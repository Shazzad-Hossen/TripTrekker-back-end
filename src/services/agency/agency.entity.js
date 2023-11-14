import Agency from './agency.schema';
import User from "../user/user.schema";
const allowedQuery = new Set(['status']);
export const registerAgency = ({ db }) => async (req, res) => {
  try {

    const agency = await db.create({ table: Agency, key: { ...req.body } });
    if (!agency) return res.status(400).send('Bad request');
    const user = await db.findOne({ table: User, key: { id: req.body.user } });
    user.agency = agency.id;
    await db.save(user);
    const result = await db.populate(user, { path: 'agency'})
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}


export const updateAgency = ({ db }) => async (req, res) => {
  try {

    const agency = await db.findOne({ table: Agency, key: { id: req.body.id } });
    console.log(agency);

    if (!agency) return res.status(400).send('Bad Request');
    Object.keys(req.body).map(key => agency[key] = req.body[key]);
    await db.save(agency);
    const user = await db.populate(req.user, { path: 'agency' });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const getALLAgencies = ({ db }) => async (req, res) => {
  try {

    if( req.query.status==='all') delete req.query.status

    const agency = await db.find({ table: Agency , key: { query: req.query,  allowedQuery: allowedQuery, populate: {path: 'user'}} });
    if (!agency) return res.status(400).send('Bad Request');
    res.status(200).send(agency)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const getSingleAgencyDetails = ({ db }) => async (req, res) => {
  try {


    if (!req.params.id) return res.status(400).send('Agency id missing in request params');
    const agency = await db.findOne({ table: Agency, key: { id: req.params.id , populate: { path: 'user', select: 'avatar fullName email city street zip phone'} } });
    if (!agency) return res.status(400).send('Bad Request');

    res.status(200).send(agency)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const removeAgency = ({ db }) => async (req, res) => {
  try {

    if (!req.params.id) return res.status(400).send('Agenct id is missing in request params');

    const agency = await db.remove({table: Agency, key: { id: req.params.id}})
    if (!agency) return res.status(400).send('Bad Request');
    res.status(200).send(agency)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

