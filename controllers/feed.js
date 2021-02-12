exports.getPost = (req, res,next)=>{
    res.status(200).json({
        post:[{title:'first post',content:'This is Just a Dummy Content'}]
    });
}

exports.createPost = (req, res,next)=>{
    const title = req.body.title;
    const content = req.body.content;

    res.status(200).json({
        message:'Post Created Successfully!',
        post: {id: new Date().toISOString(),title:title,content:content}
    });
}
