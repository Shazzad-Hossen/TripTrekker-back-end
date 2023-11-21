import { auth } from "../middlewares";
import { agencyDashboardData, hotelDashboardData, userDashboardData } from "./dashboard.entity";

export default function dashboard() {
  /**
   * GET /dashboard-user
   * @description This route is used to get user Dashboard data.
   * @response {Object} 200 - new order data.
   */
  this.route.get("/dashboard-user", auth, userDashboardData(this));

  /**
   * GET /dashboard-agency
   * @description This route is used to get Agency Dashboard data.
   * @response {Object} 200 - new order data.
   */
  this.route.get("/dashboard-agency", auth, agencyDashboardData(this));

  /**
   * GET /dashboard-hotel
   * @description This route is used to get Hotel Dashboard data.
   * @response {Object} 200 - new order data.
   */
  this.route.get("/dashboard-hotel", auth, hotelDashboardData(this));
}

