const path = require("path");

export const uploadFiles =
  ({ fileUp }) =>
  async (req, res) => {
    try {

      if (req.files?.file?.path) {
        const url = await fileUp(req.files?.file.path);
        if (!url) return res.status(400).send("File Upload failed");
        return res.status(201).send(url);

      }
      if (req.files.image) {
        let urls = [];
        for (let img of req.files.image) {
          urls = [...urls, (await fileUp(img.path))];
        }
        return res.status(201).send(urls);

      }

      res.status(400).send('Faild to upload image');
    } catch (error) {
      console.log(error);
      res.status(500).send("Something wents wrong");
    }
  };

/**
 * This function is used serve an image.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const serveFile = () => async (req, res) => {
  try {
    if (!req.params.id)
      return res
        .status(400)
        .send({ error: true, message: "file id missing in params" });
    const filePath = path.join(path.resolve(), "file", req.params.id);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");
  }
};
