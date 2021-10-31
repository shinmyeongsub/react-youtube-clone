import React, {useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import {userSelector} from 'react-redux';

const{TextArea} = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () =>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) =>{
        setCommentValue(event.currentTarget.CommentValue)
    }

    const onSubmit = (event) =>{
        event.preventDefault();

        const variables = {
            content : CommentValue,
            writer : user.userDate._id,
            postId : props.postId,
            responseTo : props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response=>{
            if(response.data.success) {
                console.log(response.data.result)
                setCommentValue("")
                setOpenReply(false)
                props.refreshFunction(response.data.result)

            } else { 
                alert('커멘트로 저장하지 못했습니다.')
            }
        })
    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment>
                actions = {actions}
                author = {props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content = {<p>{props.comment.content}</p>}
            </Comment>

        {OpenReply &&
            <form style = {{display : 'flex' }} onSubmit = {onSubmit} >
                <textarea
                    style={{width:'100%',borderRadius : '5px'}}
                    onChange ={onHandleChange}
                    value ={CommentValue}
                    placeholder = "코멘트를 작성해 주세요"
                    
                />
                <br />
                <button style={{width : '20%', height:'52px'}} onClick = {onSubmit} >Submit</button>
            </form>
        }

        </div>
    )
}

export default SingleComment