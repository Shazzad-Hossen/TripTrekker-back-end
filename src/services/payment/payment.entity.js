
const SSLCommerzPayment = require("sslcommerz-lts");
import Payment from './payment.schema'
import Order from "../order/order.schema";
const allowedQuery = new Set(['user']);


export const paymentInit = ({ db, settings }) => async (req, res) => {
  try {
     const data = {
       total_amount: req.body?.cost,
       currency: "BDT",
       tran_id: req.body?.id,
       success_url: `${settings.SERVER_URL}/api/payment/success`,
       fail_url: `${settings.SERVER_URL}/api/payment/failed`,
       cancel_url: `${settings.SERVER_URL}/api/payment/cancelled`,
       ipn_url: `${settings.SERVER_URL}/api/paymeent/pin`,
       shipping_method: "Physical",
       product_name: req.body?.package?.name,
       product_category: req.body?.type + "Booking",
       product_profile: "general",
       cus_name: req.user.fullName,
       cus_email: req.user.email,
       cus_add1: `${req.user.street}, ${req.user.city}, ${req.user.zip}`,
       cus_add2: "N/A",
       cus_city: "N/A",
       cus_state: "N/A",
       cus_postcode: "1000",
       cus_country: "Bangladesh",
       cus_phone: "01711111111",
       cus_fax: "01711111111",
       ship_name: req.user.fullName,
       ship_add1: "N/A",
       ship_add2: "N/A",
       ship_city: "N/A",
       ship_state: "N/A",
       ship_postcode: 1000,
       ship_country: "Bangladesh",
     };
   const sslcz = new SSLCommerzPayment(settings.SSL_STORE_ID, settings.SSL_STORE_PASSWORD, settings.SSL_IS_LIVE);
    sslcz.init(data).then((apiResponse) => {
     // Redirect the user to payment gateway
     let GatewayPageURL = apiResponse.GatewayPageURL;
     if (apiResponse.status === 'SUCCESS') res.status(201).send(GatewayPageURL);

   });

  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }

}

export const success = ({db, settings}) => async (req, res) => {
  try {

    const sslcz = new SSLCommerzPayment(settings.SSL_STORE_ID, settings.SSL_STORE_PASSWORD, settings.SSL_IS_LIVE);
    sslcz.validate({ val_id: req.body.val_id }).then(async (data) => {

       if (data.status === 'VALID') {
         const {
           tran_date,
           tran_id,
           val_id,
           amount,
           store_amount,
           currency,
           bank_tran_id,
           card_issuer,
           card_brand,
         } = data;
         const order = await db.findOne({ table: Order, key: { id: tran_id } });
         order.status = 'paid';
         await db.save(order);
         await db.create({ table: Payment, key: { tran_date, tran_id, val_id, amount, store_amount, currency, bank_tran_id, card_issuer, card_brand, user: order.user.toString(), order: order._id.toString(), package: order.package.toString() } });
         res.redirect(`${settings.FRONTEND_URL}/dashboard/orders?status=success`);
       }
     });

  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");


  }
}

export const failed =
  ({ db, settings }) =>
  async (req, res) => {
    try {
      res.redirect(`${settings.FRONTEND_URL}/dashboard/orders?status=failed`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something wents wrong");
    }
    };


export const cancelled =
  ({ db, settings }) =>
  async (req, res) => {
    try {
      res.redirect(`${settings.FRONTEND_URL}/dashboard/orders?status=cancelled`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something wents wrong");
    }
  };

export const getAllTransaction = ({ db }) => async (req, res) => {
  try {
    if (req.user.role === 'user') req.query.user = req.user._id.toString();
    const transaction = await db.find({ table: Payment, key: { allowedQuery: allowedQuery, query: req.query, populate: { path: 'order user package'}} });
    if (!transaction) return res.status(400).send('Bad request');
    res.status(200).send(transaction);

    } catch (error) {
       console.log(error);
       res.status(500).send("Something wents wrong");

    }
}


export const refundReq = ({ db }) => async (req, res) => {
  try {
    if (!req.body.id) return res.status(400).send('Bad Request');
    const payment = await db.findOne({ table: Payment, key: { id: req.body.id } });
    if (!payment) return res.status(401).send('Forbidden');
    payment.status = 'requested';
    await db.save(payment);
    return res.status(200).send(payment);

  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}

export const initiateRefund = ({ db,settings }) => async (req, res) => {
  try {
    if (!req.body.id || !req.body.status) return res.status(400).send('Bad Request');
    if (req.body.status === 'cancelled') {
      const payment = await db.findOne({ table: Payment, key: { id: req.body.id } });
      if (!payment) return res.status(401).send('Forbidden');
      payment.status = "cancelled";
      await db.save(payment);
      return res.status(200).send('Refund Request Successfully Cancelled');
    }
    else if (req.body.status === 'refunded') {
       const payment = await db.findOne({ table: Payment, key: { id: req.body.id } });
       if (!payment) return res.status(401).send('Forbidden');
       const sslcz = new SSLCommerzPayment(settings.SSL_STORE_ID, settings.SSL_STORE_PASSWORD, settings.SSL_IS_LIVE);
      sslcz
        .initiateRefund({
          refund_amount: payment?.amount,
          refund_remarks: "Refunded by Admin",
          bank_tran_id: payment?.bank_tran_id,
          refe_id: payment?._id.toString(),
        })
        .then(async(data) => {
          if (data?.status === 'success') {
            payment.status = 'refunded';
            await db.save(payment);
            return res.status(200).send('Refund successfull');
          }
          else return res.status(400).send(data.errorReason);
        });
    }
    else return res.status(200).send('Operation Failed');

  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}