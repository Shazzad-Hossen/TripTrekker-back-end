import Promotion from './promotion.schema';
const allowedQuery = new Set(['paginate', 'page']);
export const addPromotion = ({ db, fileUp }) => async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data);
    if (req.files.image) {
       req.body.image = await fileUp(req.files.image.path);
    }

    const promotion = await db.create({ table: Promotion, key: { ...req.body } });
    if (!promotion) return res.status(400).send('Bad request');
    return res.status(200).send(promotion);

  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}

export const getAllPromotions = ({ db }) => async (req, res) => {
  try {
    const promotions = await db.find({ table: Promotion, key: { allowedQuery: allowedQuery, query: req.query} });
    if (!promotions) return res.status(400).send("Bad request");
    return res.status(200).send(promotions);



  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const getSinglePromotions = ({ db }) => async (req, res) => {
  try {
    if(!req.params.id) return res.status(400).send("Bad request");
    const promotions = await db.findOne({ table: Promotion, key: { id: req.params.id } });
    if (!promotions) return res.status(400).send("Bad request");
    return res.status(200).send(promotions);



  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}


export const updateSinglePromotions = ({ db, fileUp }) => async (req, res) => {
  try {
    if(!req.params.id) return res.status(400).send("Bad request");
    const promotions = await db.findOne({ table: Promotion, key: { id: req.params.id } });
    if (!promotions) return res.status(400).send("Bad request");
    req.body = JSON.parse(req.body.data);
    if (req.files.image) {
      req.body.image = await fileUp(req.files.image.path);
    }
    Object.keys(req.body).forEach(key => promotions[key] = req.body[key]);
    await db.save(promotions);
    return res.status(200).send(promotions);



  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}