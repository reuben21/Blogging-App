const {validationResult} = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

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
    if (!req.file) {
        const error = new Error('No Image Provided!');
        error.statusCode = 422
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path;

    const post = new Post({
        title: title,
        imageUrl: imageUrl,
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


exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, Entered Data is incorrect');
        error.statusCode = 422
        throw error;
    }

    const post_id = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    console.log("WHAT IMAGE URL", imageUrl)
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error("No File Picked.");
        error.statusCode = 422;
        throw error;


    }
    Post.findById(post_id).then(post => {
        if (!post) {
            const error = new Error('Could Not Find The Post');
            error.statusCode = 404;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();


    }).then(result => {
        res.status(200).json({
            message: 'Post Updated',
            post: result
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => {
        console.log(err);
    })
}