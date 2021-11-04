const express = require('express');
const router = express.Router();
const multer = require("multer");
var ffmpeg=require("fluent-ffmpeg");

const { Video } = require("../models/Video");
const {Subscriber} = require('../models/Subscriber');
const { auth } = require("../middleware/auth");


//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null,true)
    }
})

const upload = multer({storage:storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res)=>{     //client > server_index.js로 가서  /api/video를 읽은 후 현재창으로 오기 때문에 굳이 post('/api/video/up...')로 쓰지 않아도 된다.
    //비디오를 서버에 저장한다.
    upload (req,res,err =>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, url:res.req.file.path, fileName:res.req.file.filename})
    })
}) 

router.post('/uploadVideo', (req, res)=>{
    //비디오 정보들을 저장한다.

    const video = new Video(req.body)   //인스턴스로 가져온다?

    video.save((err,doc)=>{
        if(err) return res.json({success:false,err})
        res.status(200).json({success:true})
    })  // save : 몽고DB method. 
}) 

router.get('/getVideos', (req, res)=>{
    
    //비디오를 DB에서 가져와서 client에게 보내기
    
    Video.find()  // video collection 안에 있는 모든 비디오를 가져옴
        .populate('writer')   //populate 하지 않으면 > user Id 만 가져오고, populate하면 writer의 모든 정보를 가져온다.
        .exec ((err,videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, videos})
        })
}) 

router.post('/getSubscriptionVideos', (req, res)=>{
    
    // 구독하고 있는 writer 조회
    
    Subscriber.find({'userFrom':req.body.userFrom})
        .populate('userFrom')
        .exec((err, subscriberInfo)=>{
            if(err) return res.status(400).send(err);
            
            let subscribedUser=[];
            subscriberInfo.map((subscriber, i)=>{
                subscribedUser.push(subscriber.userTo);
            })

            // writer들의 비디오를 가져온다.
            Video.find({writer:{$in: subscribedUser}})
                .populate('writer')
                .exec((err, videos)=>{
                    if(err) return res.status(400).send(err);
                    return res.status(200).json({success:true, videos})
                })
        })
})

router.post('/getVideoDetail', (req, res)=>{
    Video.findOne({"_id" : req.body.videoId})
        .populate('writer')
        .exec((err,videoDetail)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, videoDetail})
        })
});

router.post('/thumbnail', (req, res)=>{
    let filePath=""
    let fileDuration=""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url,function(err,metadata){   //메타데이터를 가져옴
        console.dir(metadata); //all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })

    //썸네일 생성
    ffmpeg(req.body.url)   // url = client에서 온 비디오 저장 경로 (uploads)
    .on('filenames', function(filenames){   //파일 이름 생성
        console.log('Will generate' + filenames.join(','))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end',function(){    //모두 생성 후 무엇을 할 것인가
        console.log('Screenshots taken');
        return res.json({success:true, url:filePath, fileDuration:fileDuration})
    })
    .on('error',function(err){    //에러가 날 경우에는?
        console.error(err);
        return res.json({success:false, err});
    })
    .screenshots({
        //Will take screenshots at 20%, 40%, 60% and 80% of the video
        count:3,    //3개의 썸네일을 찍을 수 있음
        folder:'uploads/thumbnails',
        size:'320x240',
        //'%b' : input basename (filename w/o extension)   : 본래 파일 이름(basename) , 확장자명은 뺀 상태
        filename:'thumbnail-%b.png'
    })
}) 

module.exports = router;