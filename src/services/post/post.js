
import { auth } from "../middlewares";
import { addPost } from "./post.entity";

export default function Post() {
  /**
   * POST /post
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/post",auth, addPost(this));

}
