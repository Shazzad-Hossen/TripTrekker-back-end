import Post from './post.schema';
const allowedQuery = new Set(["page"]);
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
    res.status(201).send(post);


  } catch (error) {
    console.log(error);
    res.status(500).send('Something wents wrong')

  }
}


export const getAllPost = ({ db }) => async (req, res) => {
  try {
    const post = await db.find({
      table: Post,
      key: {allowedQuery:allowedQuery, query: {...req.query}, populate: { path: "author comment location", select: "fullName avatar text author name", populate: { path: 'author', select: 'avatar fullName', strictPopulate: false} } },
    });
    if (!post) return res.status(400).send('Bad request');
    res.status(200).send(post);

  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");


  }
}

export const manageLike = ({ db }) => async (req, res) => {
  try {

    if (!req.body.id) return res.status(400).send('Bad request');
    const post = await db.findOne({ table: Post, key: { id: req.body.id } });
    if (!post) return res.status(400).send("Bad request");
    const isFound = post.like.find(p => p.toString() === req.user?._id.toString());
    if (isFound) post.like = post.like.filter(p => p.toString() !== req.user?._id.toString());
    else post.like.push(req.user?._id.toString());
    await db.save(post);
    res.status(200).send(post);


  } catch (error) {
    console.log(error);
    res.status(500).send("Something wents wrong");

  }
}