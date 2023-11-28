import Order from '../order/order.schema';
import Package from '../package/package.schema';
import User from "../user/user.schema";
import Payment from '../payment/payment.schema';
export const userDashboardData = ({ db }) => async (req, res) => {
  try {
const userId = req.user._id.toString(); // Assuming req.user contains the user information

const result = await Order.aggregate([
  {
    $match: {
      userId: userId,
    },
  },
  {
    $group: {
      _id: null,
      totalDocuments: { $sum: 1 },
      totalConfirmed: {
        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
      },
      totalCancelled: {
        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
      },
      totalCost: { $sum: "$cost" },
    },
  },
]);

    const aggregatedData = result.length > 0 ? result[0] : null;
    res.status(200).send(aggregatedData);

  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong');

  }
}



export const agencyDashboardData = () => async (req, res) => {
  try {

   const result = await Order.aggregate([
     {
       $match: {
         agency: req.user.agency.toString(),
       },
     },
     {
       $group: {
         _id: null,
         totalDocuments: { $sum: 1 },
         totalConfirmed: {
           $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
         },
       },
     },
   ]);
     const result2 = await Package.aggregate([
     {
       $match: {
         agency: req.user.agency,
       },
     },
     {
       $group: {
         _id: null,
         totalDocuments: { $sum: 1 },
         totalApproved: {
           $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
         },
       },
     },
     ]);

    res.status(200).send({
      orders: result[0]?.totalDocuments || 0,
      confirmed: result[0]?.totalConfirmed || 0,
      packages: result2[0]?.totalDocuments || 0,
      approved: result2[0]?.totalApproved || 0,
    });

  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}



export const hotelDashboardData = () => async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          hotel: req.user.hotel.toString(),
        },
      },
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
          totalConfirmed: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
        },
      },
    ]);
    const result2 = await Package.aggregate([
      {
        $match: {
          hotel: req.user.hotel,
        },
      },
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
          totalApproved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).send({
      orders: result[0]?.totalDocuments || 0,
      confirmed: result[0]?.totalConfirmed || 0,
      packages: result2[0]?.totalDocuments || 0,
      approved: result2[0]?.totalApproved || 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");
  }
};




export const adminDashboardData = () => async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUser: {
            $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] },
          },
          totalAgency: {
            $sum: { $cond: [{ $eq: ["$role", "agency"] }, 1, 0] },
          },
          totalHotel: {
            $sum: { $cond: [{ $eq: ["$role", "hotel"] }, 1, 0] },
          },
        },
      },
    ]);

    const result2 = await Package.aggregate([
      {
        $group: {
          _id: null,
          packsByAgency: {
            $sum: { $cond: [{ $eq: ["$type", "agency"] }, 1, 0] },
          },
          packsByHotel: {
            $sum: { $cond: [{ $eq: ["$type", "hotel"] }, 1, 0] },
          },
        },
      },
    ]);

    const result3 = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalStoreAmount: { $sum: "$store_amount" },
        },
      },
    ]);

    

    res.status(200).send({ ...result[0], ...result2[0], ...result3[0]});

  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}