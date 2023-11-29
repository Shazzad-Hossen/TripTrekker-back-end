import { auth } from "../middlewares";
import { postComment } from "./comment.entity";

export default function Comment() {
  /**
   * POST /comment
   * @description This route is used to create a post.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/comment", auth, postComment(this));

}
