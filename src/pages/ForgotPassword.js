import React from 'react';
import Auth from '../auth';
import { withRouter, Redirect } from "react-router-dom";
import {Users} from '../sdk/SDK';

class ForgotPassword extends React.Component{

    constructor(props){
        super(props);
        this.email = React.createRef();
        this.state = {
            credentials:{
                email:''

            },
            loggedIn:false
        }
    }

    componentDidMount(){
        //alert(Auth.isAuthenticated);
    }

    render = ()=>{
        if(this.state.loggedIn){
            //console.log("Should Redirect");
            // return <Redirect to="/temp"/>
            return '';
        }else{
            return (
                <div className="container">
                    <div className="row justify-content-center">
        
                        <div className="col-xl-6 col-lg-7 col-md-9">
        
                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div classname="card-header">
                                    <div className="bg-login-image d-lg-block"></div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="row">
                                            <div className="col-lg-12">
                                                <div className="p-5">
                                                    <div className="text-center">
                                                        <h1 className="h4 text-gray-900 mb-4">Forgot Your Password?</h1>
                                                        <p class="mb-4">We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
                                                    </div>
                                                    <form className="user">
                                                        <div className="form-group">
                                                            <input ref={this.email} type="email" name="email" className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                                        </div>
                                                        <button type="button" onClick={this.handleSubmit} className="btn btn-primary btn-user btn-block">
                                                        Reset Password
                                                        </button>
                                                    </form>
                                                    <hr/>
                                                    <div className="text-center">
                                                        <a className="small" href="/register">Create an Account!</a>
                                                    </div>
                                                    <div className="text-center">
                                                        <a className="small" href="/Login">Already have an account? Login!</a>
                                                    </div>
                                                    <p className="text-center text-danger">
                                                        {this.state.error?this.state.error.toString():''}
                                                    </p>
                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            );
        }
        
    }
    handleSubmit = async (event)=> {
        //alert('A name was submitted: ' + JSON.stringify(this.state));
        var me = this;
        try{
            let data = await Users.forgotPassword(this.email.current.value);
            alert("Password reset emaill has been sent.  Please follow the link in the email to reset your pasword");

        }catch(err){
            try{
                let message = await err.text();
                this.setState({
                    error:message
                })
            }catch(errmessage){
                console.log(err);
                this.setState({
                    error:'Failed'
                })
            }
        }
        
        // Auth.authenticate(this.state.credentials, ()=>{
        //     //alert(Auth.isAuthenticated);
        //     console.log("Logged In");
        //     me.setState({
        //         loggedIn:true
        //     },()=>{
        //         console.log(this.state.loggedIn);
        //         window.location = "/";
        //         //me.props.history.push("/");

        //     })

        // },(err)=>{
        //     me.setState({
        //         error:err
        //     })
        // })
        
        event.preventDefault();
    }
}

export default  withRouter(ForgotPassword);