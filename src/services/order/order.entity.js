import Order from './order.schema'
import Package from '../package/package.schema'

export const registerOrder = ({ db }) => async (req, res) => {
  try {
    const pack = await db.findOne({ table: Package, key: { id: req.body.package } });
    if (!pack) return res.status(400).send('Bad Request');
    if (req.body.type === 'hotel') {
    const [year1, month1, day1] = req.body.date.split("-").map(Number);
    const [year2, month2, day2] = req.body.endDate.split("-").map(Number);
    const dateObj1 = new Date(year1, month1 - 1, day1);
    const dateObj2 = new Date(year2, month2 - 1, day2);
      const timeDiff = Math.abs(dateObj2 - dateObj1);
      const dayDifference = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const duration = dayDifference + 1;
      req.body.duration = duration;
      const cost = pack?.cost * duration * req.body.room;
      const order = await db.create({ table: Order, key: { ...req.body, cost } });
      if (!order) return res.status(400).send("Bad request");
      return res.status(201).send(order);
    }
    else if (req.body.type === 'tour') {
      req.body.cost = pack.cost * req.body.person;
      const order = await db.create({ table: Order, key: { ...req.body } });
      if (!order) return res.status(400).send("Bad request");
      return res.status(201).send(order);
    }


  } catch (error) {

  }
}


