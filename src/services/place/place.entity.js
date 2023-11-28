
import Place from "./place.schema";

const allowedQuery = new Set([
  "division","paginate", 'page', 'search', 'name'
]);
export const register = ({ db, lyra }) => async (req, res) => {
  try {
    const place =await db.create({ table: Place, key: { ...req.body } });
    if (!place) return res.status(400).send('Can not handle this request');
     await lyra.insert("places", {
       id: place._id.toString(),
       name: place.name,
     });
    res.status(201).send(place);

  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}


export const getPlaces =
  ({ db, lyra }) =>
    async (req, res) => {
      let searchquery = {};
      if (req.query.search) {
        const regx = new RegExp(req.query.search, 'i');
        searchquery = { 'name': regx };
        delete req.query.search;

      }
      const places = await db.find({
        table: Place,
        key: { query: req.query,...searchquery, allowedQuery: allowedQuery, populate: { path:'division'}, paginate: req.query.paginate === 'true'  },
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


