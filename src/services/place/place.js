import { auth, checkRole } from "../middlewares";
import {  UpdatePlce, deletePlace, getPlaces, register, singlePlace } from "./place.entity";

export default function place() {
  /**
   * POST /place
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/place", register(this));
  /**
   * GET /place
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.get("/place", getPlaces(this));

  /**
   * GET /place/:id
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.get("/place/:id", singlePlace(this));

  /**
   * DELETE /place/:id
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.delete("/place/:id", deletePlace(this));


  /**
   * PATCH /place/:id
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.patch("/place/:id", UpdatePlce(this));
}
