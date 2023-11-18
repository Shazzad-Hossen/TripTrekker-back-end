import Order from '../order/order.schema';
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