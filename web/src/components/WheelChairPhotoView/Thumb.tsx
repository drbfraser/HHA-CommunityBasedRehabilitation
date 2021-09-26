import React from "react";
import { useEffect, useState } from "react"

interface Iprops {
    file: any | null;
}

export const Thumb = (props: Iprops) => {

    const [thumb, setThumb] = useState<string | undefined>(undefined);

    useEffect(()=>{
        if(props.file !== null){
            
            let reader = new FileReader();

            reader.onload = () =>{
                setThumb(reader.result as string)
            }
            reader.readAsDataURL(props.file)
        }  
    },[props.file])

    return(
        <>
        <br/>
        <img alt="" src={thumb} width="200 px"/>
        </> 
    )
}