import React from 'react';
import Auth from '../auth';
import { withRouter, Redirect } from "react-router-dom";

class Logout extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){
        
        Auth.signout(function(){
            
        });
        //alert(Auth.isAuthenticated);
    }

    render = ()=>{
        return (
            <Redirect to="/login"/>
        );
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    handleSubmit(event) {
        //alert('A name was submitted: ' + JSON.stringify(this.state));
        var me = this;
        Auth.authenticate(function(){
            //alert(Auth.isAuthenticated);
            me.props.history.replace("/");

        })
        event.preventDefault();
    }
}

export default  withRouter(Logout);