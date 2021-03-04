const {validationResult} = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');

exports.getPost = (req, res, next) => {
    const currentPage = req.query.page || 1
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(posts => {
        if (!posts) {
            const error = new Error('Could Not Find The Posts');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Fetched All Posts Successfully",
            posts: posts,
            totalItems: totalItems
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    ;


};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    console.log(post)
    post
        .save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: { _id: creator._id, name: creator.name }
            });
        })
        .catch(err => {
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
        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
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

exports.deletePost = (req, res, next) => {


    const post_id = req.params.postId;

    Post.findById(post_id).then(post => {

        if (!post) {
            const error = new Error('Could Not Find The Post');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        //check logged in user;
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(post_id);

    }).then(result=>{
        return User.findById(req.userId);
    }).then(user=>{
        user.posts.pull(post_id);
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted Post.'})
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
