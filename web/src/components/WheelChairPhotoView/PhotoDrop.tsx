import { file } from "@babel/types";
import React, { useEffect, useState } from "react";
import Dropzone from 'react-dropzone'

interface Iprops {
    onPictureChange: (newPictureURL: string) => void;
}
interface Iprops{

}
export const PhotoDrop = (props: Iprops) =>{

    const[loading, setLoading] = useState<boolean>(false)
    const [files] = useState<Array<string>>([])
    console.log(files)

    useEffect(()=>{
    },[loading, files])

    return (
        <>
        <Dropzone
                    accept="image/*"
                    onDrop={(acceptedFiles)=>{
                        acceptedFiles.forEach((file) => {
                            const reader = new FileReader()
                            setLoading(true)
                            reader.onabort = () => console.log('file reading was aborted')
                            reader.onerror = () => console.log('file reading has failed')
                            reader.onload = () => {
                            // Do whatever you want with the file contents
                                const image = (reader.result as ArrayBuffer)?? undefined;
                                const url = URL.createObjectURL(new Blob([image]))
                                files.push(url)
                                props.onPictureChange(url)
                                setLoading(false)
                            }
                            reader.readAsArrayBuffer(file)
                          })
                    }}>
                        {({getRootProps, getInputProps}) => (
                        <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        </section>
                        
                    )}
            </Dropzone>
            <div>
                {files.map((url)=> <img alt ='' width ="200 px" src={url}></img>)}
            </div>
            </>
    )
}