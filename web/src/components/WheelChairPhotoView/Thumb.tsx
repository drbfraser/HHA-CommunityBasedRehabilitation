import { apiFetch, Endpoint } from '@cbr/common/util/endpoints'
import React, { useEffect, useState } from 'react'

interface Iprops{
    Id: number,
    Url: string
}

export const Thumb = (props:Iprops) =>{

    const [thumb,setThumb] = useState<string>('')

    useEffect(()=>{
        if(props.Url){
            console.log(props.Id)
            console.log('fetching')
            apiFetch(Endpoint.REFERRAL_PICTURE, `${props.Id}`)
            .then((resp)=>resp.blob())
            .then((blob)=>{
                console.log(blob)
                setThumb(URL.createObjectURL(blob))
            })
            
        }
    },[props.Id,props.Url])

    return(
        <img alt = '' src={thumb} width="200px"></img>
    )

}