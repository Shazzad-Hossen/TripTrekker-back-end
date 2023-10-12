import { auth } from "../middlewares";
import { registerHotel, updateHotel } from "./hotel.entity";


export default function hotel() {
  /**
   * POST /hotel
   * @description This route is used to create a hotel.
   * @response {Object} 201 - userData with hotel details.
   */
  this.route.post("/hotel", registerHotel(this));
  /**
   * patch /hotel
   * @description This route is used to update a hotel.
   * @response {Object} 200 -  user data with populated hotel details.
   */
  this.route.patch("/hotel", auth, updateHotel(this));
};