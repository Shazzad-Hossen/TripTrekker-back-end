import { auth, checkRole } from "../middlewares";
import { getALLOrders, registerOrder, singleOrder, updateOne } from "./order.entity";

export default function order() {
  /**
   * POST /order
   * @description This route is used to create a new order.
   * @response {Object} 201 - new order data.
   */
  this.route.post("/order", auth, registerOrder(this));
  /**
   * GET /order
   * @description This route is used to get all orders.
   * @response {Object} 20 - All orders data.
   */
  this.route.get("/order", auth, getALLOrders(this));
  /**
   * GET /order/:id
   * @description This route is used to get all orders.
   * @response {Object} 20 - All orders data.
   */
  this.route.get("/order/:id", auth, singleOrder(this));
  /**
   * PATCH /order/
   * @description This route is used to get all orders.
   * @response {Object} 20 - All orders data.
   */
  this.route.patch("/order/", auth, checkRole(['hotel', 'agency']), updateOne(this));
}