import React, { useState } from 'react'
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;

function Comment(props) {

    const videoId = props.postId;

    const user = useSelector(state => state.user);
    const [ commentValue, setcommentValue] = useState("")

    const handleChange = (event) =>{
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) =>{
        event.preventDefault();


        const variables = {
            content : commentValue,
            writer : user.userData._id,
            postId : videoId
        }

        axios.post('/api/comment/saveComment', variables)
        .then(response=>{
            if(response.data.success) {
                console.log(response.data.result)
                setcommentValue("")
                props.refreshFunction(response.data.result)
            } else { 
                alert('커멘트를 저장하지 못했습니다.')
            }
        })

    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />


            {/* Coment Lists */}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment parentCommentId={comment._id} postId={videoId} CommentLists={props.CommentLists} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            <SingleComment postId={videoId} />



            {/* Root comment Form */}

            <form style = {{display : 'flex' }} onSubmit = {onSubmit}>
                <TextArea
                    style={{width:'100%',borderRadius : '5px'}}
                    onChange = {handleChange}
                    value ={commentValue}
                    placeholder = "코멘트를 작성해 주세요"
                />
                <br />
                <Button style={{width : '20%', height:'52px'}} onClick = {onSubmit}>Submit</Button>
            </form>
        
        </div>
    )
}

export default Comment
