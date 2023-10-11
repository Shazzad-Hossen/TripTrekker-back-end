import { auth } from "../middlewares";
import { registerAgency, updateAgency } from "./agency.entity";

export default function agency() {
  /**
   * POST /agency
   * @description This route is used to create a agency.
   * @response {Object} 201 - userData with agency details.
   */
  this.route.post("/agency", registerAgency(this));
  /**
   * patch /agency
   * @description This route is used to update a agency.
   * @response {Object} 200 -  user data with populated agency details.
   */
  this.route.patch("/agency", auth, updateAgency(this));
};