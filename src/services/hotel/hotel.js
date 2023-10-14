import { auth } from "../middlewares";
import { getALLHotels, getSingleHotelDetails, registerHotel, removeHotel, updateHotel } from "./hotel.entity";

export default function hotel() {
  /**
   * POST /hotel
   * @description This route is used to create a hotel.
   * @response {Object} 201 - userData with hotel details.
   */
  this.route.post("/hotel", registerHotel(this));
  /**
   * GET/hotel
   * @description This route is used to update a hotel.
   * @response {Object} 200 -  user data with populated hotel details.
   */
  this.route.get("/hotel", getALLHotels(this));
  /**
   * GET/hotel/:id
   * @description This route is used to update a hotel.
   * @response {Object} 200 -  user data with populated hotel details.
   */
  this.route.get("/hotel/:id", getSingleHotelDetails(this));
  /**
   * PATCH /hotel
   * @description This route is used to update a hotel.
   * @response {Object} 200 -  user data with populated hotel details.
   */
  this.route.patch("/hotel", auth, updateHotel(this));
  /**
   * Delete /hotel/:id
   * @description This route is used to update a hotel.
   * @response {Object} 200 -  user data with populated hotel details.
   */
  this.route.delete("/hotel/:id", removeHotel(this));
}
