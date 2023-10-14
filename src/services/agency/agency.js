import { auth } from "../middlewares";
import { getALLAgencies, getSingleAgencyDetails, registerAgency, removeAgency, updateAgency } from "./agency.entity";

export default function agency() {
  /**
   * POST /agency
   * @description This route is used to create a agency.
   * @response {Object} 201 - userData with agency details.
   */
  this.route.post("/agency", registerAgency(this));
  /**
   * GET/agency
   * @description This route is used to update a agency.
   * @response {Object} 200 -  user data with populated agency details.
   */
  this.route.get("/agency", getALLAgencies(this));
  /**
   * GET/agency/:id
   * @description This route is used to update a agency.
   * @response {Object} 200 -  user data with populated agency details.
   */
  this.route.get("/agency/:id", getSingleAgencyDetails(this));
  /**
   * PATCH /agency
   * @description This route is used to update a agency.
   * @response {Object} 200 -  user data with populated agency details.
   */
  this.route.patch("/agency", auth, updateAgency(this));
  /**
   * Delete /agency/:id
   * @description This route is used to update a agency.
   * @response {Object} 200 -  user data with populated agency details.
   */
  this.route.delete("/agency/:id", removeAgency(this));
};