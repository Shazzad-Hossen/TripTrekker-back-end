import Hotel from './hotel.schema';
import User from "../user/user.schema";
export const registerHotel = ({ db }) => async (req, res) => {
  try {

    const hotel = await db.create({ table: Hotel, key: { ...req.body } });
    if (!hotel) return res.status(400).send('Bad request');
    const user = await db.findOne({ table: User, key: { id: req.body.user } });
    user.hotel = hotel.id;
    await db.save(user);
    const result = await db.populate(user, { path: 'hotel'})
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}


export const updateHotel = ({ db }) => async (req, res) => {
  try {
    const { id } = req.body.id;
    delete req.body.id;
    const hotel = await db.update({ table: Hotel, key: {id, body: { ...req.body } }});
    if (!hotel) return res.status(400).sebd('Bad Request');
    const user = await db.populate(req.user, { path: 'hotel' });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}