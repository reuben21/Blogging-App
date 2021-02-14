const {validationResult} = require('express-validator');
const Post = require('../models/post');


exports.getPost = (req, res, next) => {
    Post.find().then(posts => {
        if (!posts) {
            const error = new Error('Could Not Find The Posts');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Fetched All Posts Successfully",
            posts: posts
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, Entered Data is incorrect');
        error.statusCode = 422
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        imageUrl: 'images/bread.jpeg',
        content: content,
        creator: {
            name: 'Reuben'
        },
    });
    post.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post Created Successfully!',
            post: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    });

};

exports.getSinglePost = (req, res, next) => {
    const post_id = req.params.postId;
    Post.findById(post_id).then(post => {
        if (!post) {
            const error = new Error('Could Not Find The Post');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post Fetched',
            post: post
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

};
