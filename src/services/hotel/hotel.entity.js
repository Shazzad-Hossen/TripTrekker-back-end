import Hotel from './hotel.schema';
import User from "../user/user.schema";
const allowedQuery = new Set(['status','place', 'paginate', 'limit']);
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
    const hotel = await db.findOne({ table: Hotel, key: { id: req.body.id } });
    if (!hotel) return res.status(400).send('Bad Request');
    Object.keys(req.body).forEach(key => hotel[key] = req.body[key]);
    await db.save(hotel);
    const user = await db.populate(req.user, { path: "hotel" });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const getALLHotels = ({ db }) => async (req, res) => {
  try {

    if( req.query.status==='all') delete req.query.status

    const hotel = await db.find({ table: Hotel , key: { query: req.query,  allowedQuery: allowedQuery, paginate: req.query.paginate==='true', populate: {path: 'user division place'}} });
    if (!hotel) return res.status(400).send('Bad Request');
    res.status(200).send(hotel)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const getSingleHotelDetails = ({ db }) => async (req, res) => {
  try {

    if (!req.params.id) return res.status(400).send('hotel id missing in request params');
    const hotel = await db.findOne({ table: Hotel, key: { id: req.params.id , populate: { path: 'user place division', select: 'avatar fullName email city street zip phone name'} } });
    if (!hotel) return res.status(400).send('Bad Request');

    res.status(200).send(hotel)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const removeHotel = ({ db }) => async (req, res) => {
  try {

    if (!req.params.id) return res.status(400).send('Agenct id is missing in request params');

    const hotel = await db.remove({table: Hotel, key: { id: req.params.id}})
    if (!hotel) return res.status(400).send('Bad Request');
    res.status(200).send(hotel)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

