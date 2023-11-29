
import { auth } from "../middlewares";
import { addPost, getAllPost, manageLike } from "./post.entity";

export default function Post() {
  /**
   * POST /post
   * @description This route is used to create a post.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/post", auth, addPost(this));

  /**
   * GET /post
   * @description This route is used to get All Post.
   * @response {Object} 200 - the new user.
   */
  this.route.get("/post", auth, getAllPost(this));

  /**
   * POST /post/like
   * @description This route is used to create a post.
   * @response {Object} 200 - the new user.
   */
  this.route.post("/post/like", auth, manageLike(this));
}
