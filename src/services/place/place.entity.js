
import Place from './place.schema';

const allowedQuery = new Set([
  "division","paginate"
]);
export const register = ({ db }) => async (req, res) => {
  try {
    const place = db.create({ table: Place, key: { ...req.body } });
    if (!place) return res.status(400).send('Can not handle this request');
    res.status(201).send(place);

  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}


export const getPlaces =
  ({ db }) =>
    async (req, res) => {
      const places = await db.find({
        table: Place,
        key: { query: req.query, allowedQuery: allowedQuery, populate: { path:'division'}, paginate: req.query.paginate === 'true'  },
      });
      if (!places) return res.status(400).send('Bad request');
      res.status(200).send(places);
    try {
    } catch (error) {
      console.log(error);
      res.status(500).send("Something wents wrong");
    }
    };

export const singlePlace = ({ db }) => async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send('Id missing in request params');
    const place =await db.findOne({ table: Place, key: { id: req.params.id, populate: { path:'division'} } });
    if (!place) return res.status(400).send('Something wents wrong');
    res.status(200).send(place)


      } catch (error) {
        console.log(error);
        res.status(500).send("Something wents wrong");

      }
}


export const deletePlace = ({ db }) => async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send('Id missing in request params');
    const place = await db.remove({ table: Place, key: { id: req.params.id } });
    if (!place) return res.status(400).send('Bad request');
    res.status(200).send(place)


  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}


export const UpdatePlce = ({ db }) => async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send('Id missing in request params');
    const updatedData = await db.update({ table: Place, key: { id: req.params.id, body: { ...req.body } } });
    if (!updatedData) return res.status(400).send('Bad request');
    res.status(200).send(updatedData)

  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}


