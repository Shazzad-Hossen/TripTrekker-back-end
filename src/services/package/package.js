import { auth } from "../middlewares";
import { getAllPackages, getSinglePackage, registerPackage, removePackage, updatePackage } from "./package.entity";


export default function packages() {
  /**
   * POST /package
   * @description This route is used to create a  new package.
   * @response {Object} 201 - new Package.
   */
  this.route.post("/package", registerPackage(this));

  /**
   * GET /package
   * @description This route is used to get all packages.
   * @response {Object} 200 - All Packages.
   */
  this.route.get("/package", getAllPackages(this));

  /**
   * GET /package/:id
   * @description This route is used to get single package.
   * @response {Object} 200 - Single Package.
   */
  this.route.get("/package/:id", getSinglePackage(this));

  /**
   * PATCH /package/
   * @description This route is used to update package.
   * @response {Object} 200 - updated Package.
   */
  this.route.patch("/package/", updatePackage(this));

  /**
   * DELETE /package/:id
   * @description This route is used to get all packages.
   * @response {Object} 200 - All Packages.
   */
  this.route.delete("/package/:id", removePackage(this));
}
