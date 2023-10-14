
import Division from './division.schema';

export const register = ({ db }) => async (req, res) => {
  try {
    const division = await db.create({ table: Division, key: { ...req.body } });
    if (!division) return res.status(400).send('Unsuccessfull');
    res.status(201).send(division)


  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}

export const getDivision =
  ({ db }) =>
  async (req, res) => {
    try {
      const division = await db.find({ table: Division });
      if (!division) return res.status(400).send('Failed to get Division data');
      res.status(200).send(division)
    } catch (error) {
      console.log(error);
      res.status(500).send("Something wents wrong");
    }
    };



export const singleDivision = ({ db }) => async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send('Id missing in request params');
    const division = await db.findOne({ table: Division, key: { id: req.params.id } });
    if (!division) return res.status(400).send('Something wents wrong');
    res.status(200).send(division);


      } catch (error) {
         console.log(error);
         res.status(500).send("Something wents wrong");

      }
}

  export const deleteDivision =
    ({ db }) =>
    async (req, res) => {
      try {
        if (!req.params.id) return res.status(400).send("Missing id in params");
        const result = await db.remove({
          table: Division,
          key: { id: req.params.id },
        });
        if (!result) return res.status(400).send("Delete operation failed");
        res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Something wents wrong");
      }
    };

 //Update division
export const updateDivision = ({ db }) => async (req, res) => {
  try {
    const { id:_id } = req.body;
    delete req.body.id;
    const division = await db.update({
      table: Division, key: {
        _id, body: {...req.body}
      }
    });
    if (!division) return res.status(400).send('Update failed');
    res.status(200).send(division)

      } catch (error) {
        console.log(error);
        res.status(500).send("Something wents wrong");

      }
    }