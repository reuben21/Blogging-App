
exports.getPost = (req, res,next)=>{
    res.status(200).json({
        posts:[{
            _id:"1",
            title:'first post',
            content:'This is Just a Dummy Content',
            imageUrl:'images/bread.jpeg',
            creator:{
                name:'Reuben'
            },
            createdAt: new Date(),
        },
            {
                _id:"1",
                title:'first post',
                content:'This is Just a Dummy Content',
                imageUrl:'images/bread.jpeg',
                creator:{
                    name:'Reuben'
                },
                createdAt: new Date(),
            }
        ]
    });
};

exports.createPost = (req, res,next)=>{
    const title = req.body.title;
    const content = req.body.content;

    res.status(200).json({
        message:'Post Created Successfully!',
        post: {id: new Date().toISOString(),title:title,content:content}
    });
};
