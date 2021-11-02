import React, {useEffect, useState} from 'react'
import Axios from 'axios'

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    useEffect(() => {
        let variable={userTo:props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(response.data.subscriberNumber)
                }else{
                    alert('구독자 수 정보를 가져오지 못했습니다.')
                }

            })
        
        let subscribedVariable={userTo:props.userTo, userFrom:localStorage.getItem('userId')}
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                }else{
                    alert('사용자 정보를 가져오는 데 실패했습니다.')
                }
            })
    }, [])

    const onSubscribe=()=>{
        let subscribeVariable={userTo:props.userTo, userFrom:props.userFrom}
        
        // 이미 구독 중이라면
        if(Subscribed){
            Axios.post('/api/subscribe/unsubscribe', subscribeVariable)
                .then(response=>{
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독을 취소하는 데 실패했습니다.')
                    }
                })
        // 구독 중이지 않다면
        }else{
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response=>{
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독하는 데 실패했습니다.')
                    }
                })
        }
    }

    return (
        <div>
            <button
                style={{backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius:'4px', color:'#fff', padding:'10px 16px', fontWeight:'500', fontSize:'1rem', textTransform:'uppercase'}}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe