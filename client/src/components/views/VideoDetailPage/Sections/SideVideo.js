import React,{useEffect, useState} from 'react'
import Axios from 'axios'
import {response} from 'express'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if(response.data.success){
                    setsideVideos(response.data.videos);
                } else {
                    alert('비디오 가져오기를 실패 했습니다.');
                }
            })
    }, [])

    const renderSideVideo = sideVideos.map((video,index)=>{

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes*60));   //duration이 초 단위로 나오므로 계산해줘야 함

       return <div key={index} style = {{display:'flex', marginBottom:"1rem",padding:'0 2rem'}}>
                    <div style = {{width:'40%', marginRight:'1rem'}}>

                        <a href>
                            <img style={{width:'100%', heigth:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt = {thumbnail}/>
                        </a>
                    </div>
                    <div style={{ width:'50%'}}>
                        <a href style={{color : 'gray'}}>
                            <span style={{fontSize: '1rem', color:'black'}}>{video.title}</span>
                            <span>{video.wrtier.name}</span><br/>
                            <span>{video.vies}views</span><br/>
                            <span>{minutes} : {seconds}</span>
                        </a>
                    </div>
                    SideVideo
                </div>
    })

    return (
        <React.Fragment>
            <div style ={{marginTop:'3rem'}} />
            {renderSideVideo}
        </React.Fragment>
    )
}

export default SideVideo
