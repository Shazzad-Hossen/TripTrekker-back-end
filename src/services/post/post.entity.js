import Post from './post.schema';
export const addPost = ({ db, fileUp }) => async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data);
    if(req.files.image) {
      let images = [];
      if (Array.isArray(req.files.image)) {
        for (let img of req.files.image) {
          images = [...images, await fileUp(img.path)];
        }
        req.body.images = images;
      }
      else {
        const url = await fileUp(req.files.image.path);
        req.body.images = [url];
      }
    }

    req.body.author = req.user._id.toString();
    const post = await db.create({ table: Post, key: { ...req.body } });
    if (!post) return res.status(400).send('Bad Request');
    res.status(201).send(post)


  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong')

  }
}