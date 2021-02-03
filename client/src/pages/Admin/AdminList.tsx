import React, { Component } from "react";
import styles from "./AdminList.module.css";

class AdminList extends Component{
    render(){
        return (
            <>
                <div className = {styles.container}>
                    <form>
                        <input 
                            className = {styles.searchBox} 
                            type = "text" 
                            placeholder = "Search"
                        />
                    </form>
                    <br />
                    <br />
                    <div className="row">
                        <div className="col">
                            <b>Name</b>
                        </div>
                        <div className="col">
                            <b>ID</b>
                        </div>
                        <div className="col">
                            <b>Type</b>
                        </div>
                        <div className="col">
                            <b>Status</b>
                        </div>
                    </div>
                    <hr className = {styles.line}/>
                </div>
            </>
        )
    }
}

export default AdminList;
 