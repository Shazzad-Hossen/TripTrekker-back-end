import { auth, checkRole } from "../middlewares";
import { deleteDivision, getDivision, register } from "./division.entity";

export default function division() {
  /**
   * POST /division
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/division", register(this));

  /**
   * GET /division
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.get("/division", getDivision(this));
  /**
   * DELETE /division
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.delete("/division/:id", deleteDivision(this));
}