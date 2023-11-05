import Order from './order.schema'
import Package from '../package/package.schema'
import mongoose from 'mongoose';
const allowedQuery = new Set(["userId", "status", "sortBy", "hotel", "agency"]);


export const registerOrder = ({ db }) => async (req, res) => {
  try {
    const pack = await db.findOne({ table: Package, key: { id: req.body.package } });
    if (!pack) return res.status(400).send('Bad Request');
    console.log(pack);
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
      const order = await db.create({ table: Order, key: { ...req.body, cost, user: req.user._id.toString(), userId: req.user._id.toString(), hotel:pack.hotel.toString(), populate: { path:'package user'} } });
      if (!order) return res.status(400).send("Bad request");
      return res.status(201).send(order);
    }
    else if (req.body.type === 'tour') {
      req.body.cost = pack.cost * req.body.person;
      const order = await db.create({ table: Order, key: { ...req.body,user: req.user._id.toString(), userId: req.user._id.toString(), agency:pack.agency.toString(), populate: { path:'package user'} } });
      if (!order) return res.status(400).send("Bad request");
      return res.status(201).send(order);
    }


  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}



export const getALLOrders = ({db}) => async (req, res) => {
  try {
    if (req.query.status === 'all') delete req.query.status;

    const orders = await db.find({ table: Order, key: { allowedQuery: allowedQuery, query: req.query, populate: { path: 'package user'} } });
    if (!orders) return res.status(401).send('Bad Request');
    res.status(200).send(orders);

  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const singleOrder = ({db}) => async (req, res) => {
  try {
    const order = await db.findOne({ table: Order, key: { id: req.params.id, populate: { path: 'package user', select: 'name fullName type date endDate room cost duration.day duration.night person email phone '} } });
    if (!order) return res.status(400).send('Bad request');
    res.status(200).send(order);


  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}



export const updateOne = ({ db }) => async (req, res) => {
  try {
    if (!req.body.id || !req.body.status) return res.status(401).send('Bad Request');
    const order = await db.findOne({ table: Order, key: { id: req.body.id } });
    if (!order) return res.status(400).send('Order not found');
    const isValid = ['pending', 'processing', 'paid', 'cancelled', 'confirmed'].includes(req.body.status);
    if (!isValid) return res.status(400).send('Invalid Status');
    order.status = req.body.status;
    await db.save(order);
    await db.populate(order, {
      path: "package user",
      select:
        "name fullName type date endDate room cost duration.day duration.night person email phone ",
    });
    res.status(200).send(order)

  } catch (error) {
       console.log(error);
       res.status(500).send("Something wents wrong");

  }
}


