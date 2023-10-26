import Order from './order.schema'

export const registerOrder = ({ db }) => async (req, res) => {
  try {
    const order = await db.create({ table: Order, key: { ...req.body } });
    if (!order) return res.status(400).send('Bad request');
    res.status(201).send(order);

  } catch (error) {

  }
}


