import Agency from './agency.schema';
import User from "../user/user.schema";
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
    const { id } = req.body.id;
    delete req.body.id;
    const agency = await db.update({ table: Agency, key: {id, body: { ...req.body } }});
    if (!agency) return res.status(400).sebd('Bad Request');
    const user = await db.populate(req.user, { path: 'agency' });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}