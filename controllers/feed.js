const {validationResult} = require('express-validator');
const Post = require('../models/post');


exports.getPost = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: "1",
            title: 'first post',
            content: 'This is Just a Dummy Content',
            imageUrl: 'images/bread.jpeg',
            creator: {
                name: 'Reuben'
            },
            createdAt: new Date(),
        },
            {
                _id: "1",
                title: 'first post',
                content: 'This is Just a Dummy Content',
                imageUrl: 'images/bread.jpeg',
                creator: {
                    name:'Reuben'
                },
                createdAt: new Date(),
            }
        ]
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
        imageUrl: 'images/duck.jpg',
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
