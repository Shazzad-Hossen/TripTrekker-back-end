import { auth } from "../middlewares";
import { cancelled, failed, getAllTransaction, initiateRefund, paymentInit, refundReq, success } from "./payment.entity";

export default function payment() {
  /**
   * POST /payment
   * @description This route is used to create a new payment.
   * @response {Object} redirect to payment  gateway.
   */
  this.route.post("/payment", auth, paymentInit(this));
  /**
   * POST /payment/success
   * @description This route is used for payment success.
   * @response {Object} redirect to payment  gateway.
   */
  this.route.post("/payment/success", success(this));

  /**
   * POST /payment/failed
   * @description This route is used for payment failure.
   * @response {Object} redirect to payment  gateway.
   */
  this.route.post("/payment/failed", failed(this));

  /**
   * POST /payment/cancelled
   * @description  This route is used for payment cancelled
   * @response {Object} redirect to payment  gateway.
   */
  this.route.post("/payment/cancelled", cancelled(this));

  /**
   * GET /payment/
   * @description  This route is used for payment cancelled
   * @response {Object} redirect to payment  gateway.
   */
  this.route.get("/payment", auth, getAllTransaction(this));
  /**
   * POST /payment/refund-req
   * @description  This route is used for payment cancelled
   * @response {Object} redirect to payment  gateway.
   */
  this.route.post("/payment/refund-req", auth, refundReq(this));
  /**
   * POST /payment/refund-req
   * @description  This route is used for payment cancelled
   * @response {Object} redirect to payment  gateway.
   */
  this.route.post("/payment/refund-initiate", auth, initiateRefund(this));
  ;
}