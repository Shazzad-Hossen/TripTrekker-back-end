import Comment from './comment.schema';
import Post from '../post/post.schema';
export const postComment = ({ db }) => async (req, res) => {
  try {
    if (!req.body.id || !req.body.text) return res.stats(400).send('Bad request');
    const comment = await db.create({
      table: Comment, key: {
        post: req.body.id,
        text: req.body.text,
        author: req.user._id.toString()

      }
    });
    if (!comment) return res.status(400).send('Faild to post comment');
    const post = await db.findOne({ table: Post, key: { id: req.body.id } });
    if (!post) return res.status(400).send('Faild to post comment');
    post.comment.push(comment._id);
    await db.save(post);
    await db.populate(post, { path: "author comment location", select: "fullName avatar text author name", populate: { path: 'author', select: 'avatar fullName', strictPopulate: false} })
    res.status(200).send(post);


  } catch (error) {
     console.log(error);
     res.status(500).send("Something wents wrong");

  }
}