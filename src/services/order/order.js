import { registerOrder } from "./order.entity";

export default function order() {
  /**
   * POST /order
   * @description This route is used to create a new order.
   * @response {Object} 201 - new order data.
   */
  this.route.post("/order", registerOrder(this));
}