import React from "react"

export default class Thumb extends React.Component<{thumb: any}>{

    state = {
        loading: false,
        thumbs: undefined
    }
    
    componentWillReceiveProps = ()=>{
        
        this.setState({loading: true},()=>{
            let reader= new FileReader();

            reader.onload = () =>{
                this.setState(()=>({
                    loading: false,
                    thumbs: reader.result
                }))
            }
            console.log(this.props.thumb)
            reader.readAsDataURL(this.props.thumb)
        })
    }

    render(){
        
        return(
            <>
            <br/>
            <img alt="" src={this.state.thumbs} width="200 px"/>
            </>
        )
    }
}