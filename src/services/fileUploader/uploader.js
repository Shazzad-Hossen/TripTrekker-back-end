import { serveFile, uploadFiles } from "./uploader.entity";


export default function uploader() {
  /**
   * GET ‘/file’
   * @description this route is used to Serve files.
   * @response {Object} 200 - file.
   */
  this.route.get("/file/:id", serveFile(this));
  /**
   * Post ‘/file’
   * @description this route is used to upload files.
   * @response {Object} 201 - the file path.
   */
  this.route.post("/file", uploadFiles(this));
}