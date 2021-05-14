import { Router } from 'express';
import * as Posts from './controllers/post_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

/// your routes will go here

const handleCreatePost = async (req, res) => {
  try {
    const newPost = {
      title: req.body.title,
      tags: req.body.tags,
      content: req.body.content,
      coverUrl: req.body.coverUrl,
    };
    const result = await Posts.createPost(newPost);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const handleFetchPosts = async (req, res) => {
  try {
    const result = await Posts.getPosts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const handleFetchPost = async (req, res) => {
  try {
    const result = await Posts.getPost(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const handleDelete = async (req, res) => {
  try {
    const result = await Posts.deletePost(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const handleUpdatePost = async (req, res) => {
  try {
    console.log(req.body);
    await Posts.updatePost(req.params.id, req.body);
    res.json();
  } catch (error) {
    res.status(500).json({ error });
  }
};

router.route('/posts')
  .post(handleCreatePost)
  .get(handleFetchPosts);

router.route('/posts/:id')
  .delete(handleDelete)
  .get(handleFetchPost)
  .put(handleUpdatePost);
export default router;
