import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

//  function for creating post
const handleCreatePost = async (req, res) => {
  try {
    const newPost = {
      title: req.body.title,
      tags: req.body.tags,
      content: req.body.content,
      coverUrl: req.body.coverUrl,
      author: req.user,
    };
    const result = await Posts.createPost(newPost);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//  function for fetching all posts
const handleFetchPosts = async (req, res) => {
  try {
    const result = await Posts.getPosts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//  function for fetching single posts
const handleFetchPost = async (req, res) => {
  try {
    const result = await Posts.getPost(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// function for deleting a single post
const handleDelete = async (req, res) => {
  try {
    const result = await Posts.deletePost(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// function for updating a post
const handleUpdatePost = async (req, res) => {
  try {
    console.log(req.body);
    await Posts.updatePost(req.params.id, req.body);
    res.json();
  } catch (error) {
    res.status(500).json({ error });
  }
};

// connect functions to routers
router.route('/posts')
  .post(requireAuth, handleCreatePost)
  .get(handleFetchPosts);

router.route('/posts/:id')
  .delete(requireAuth, handleDelete)
  .get(handleFetchPost)
  .put(requireAuth, handleUpdatePost);

// router for auth - sign in
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

// router for auth - sign up
router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
