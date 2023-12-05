import { auth } from "../middlewares";
import { addPromotion, getAllPromotions, getSinglePromotions, updateSinglePromotions } from "./promotion.entity";

export default function Promotion() {
  /**
   * POST /promotion
   * @description This route is used to create a new promotion.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/promotion", auth, addPromotion(this));

  /**
   * GET /promotion
   * @description This route is used to get all promotions.
   * @response {Object} 200 - the new user.
   */
  this.route.get("/promotion", getAllPromotions(this));

  /**
   * GET /promotion/:id
   * @description This route is used to create a get a single promotion.
   * @response {Object} 200 - the new user.
   */
  this.route.get("/promotion/:id", getSinglePromotions(this));

  /**
   * PATCH /promotion/:id
   * @description This route is used to create a get a single promotion.
   * @response {Object} 200 - the new user.
   */
  this.route.patch("/promotion/:id", auth, updateSinglePromotions(this));
}
