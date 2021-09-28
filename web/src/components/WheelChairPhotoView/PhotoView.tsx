import React from "react";
import { useState } from "react"

interface Iprops {
    onPictureChange: (newPictureURL: string) => void;
}

export const PhotoView = (props: Iprops) => {
    
    const [thumb, setThumb] = useState<string | undefined>(undefined);
    return(
        <>
        <br/>
        <img alt="" src={thumb} width="200 px"/>
        <br/>
        <input
            type="file"
            accept= "image/*"
            onChange={(event)=>{
                const files = event.target.files;
                if(!files){
                    return;
                }

                let reader = new FileReader()
                reader.onload = () =>{
                    
                    const image = (reader.result as ArrayBuffer)?? undefined;
                    const url = URL.createObjectURL(new Blob([image]))
                    setThumb(url)
                    props.onPictureChange(url)
                }

                reader.readAsArrayBuffer(files[0])
            }}>
        </input>
        </> 
    )
}