import { auth } from "../middlewares";
import { userDashboardData } from "./dashboard.entity";

export default function dashboard() {
  /**
   * GET /dashboard-user
   * @description This route is used to get user Dashboard data.
   * @response {Object} 200 - new order data.
   */
  this.route.get("/dashboard-user", auth, userDashboardData(this));
}

