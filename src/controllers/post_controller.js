import Post from '../models/post_model';

export const createPost = async (postFields) => {
  // await creating a post
  // return post
  const post = new Post();
  post.title = postFields.title;
  post.coverUrl = postFields.coverUrl;
  post.tags = postFields.tags;
  post.content = postFields.content;
  post.author = postFields.author;

  try {
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
};
export const getPosts = async () => {
  try {
    const posts = await Post.find().populate('author');
    return posts;
  } catch (error) {
    throw new Error(`fetch posts error: ${error}`);
  }
};
export const getPost = async (id) => {
  // await finding one post
  // return post
  try {
    const post = await Post.findById(id).populate('author');
    return post;
  } catch (error) {
    throw new Error(`fetch post error: ${error}`);
  }
};
export const deletePost = async (id) => {
  // await deleting a post
  // return confirmation
  try {
    const post = await Post.findByIdAndDelete(id);
    return post;
  } catch (error) {
    throw new Error(`delete post error: ${error}`);
  }
};
export const updatePost = async (id, postFields) => {
  // await updating a post by id
  // return *updated* post
  try {
    const post = await Post.findByIdAndUpdate(id, postFields);
    return post;
  } catch (error) {
    throw new Error(`delete post error: ${error}`);
  }
};
