import React from 'react';
import Auth from '../auth';
import { withRouter, Redirect } from "react-router-dom";

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            credentials:{
                email:'',
                password:'',

            },
            loggedIn:false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                                                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                    </div>
                                                    <form className="user" onSubmit={this.handleSubmit}>
                                                        <div className="form-group">
                                                            <input type="email" name="email" className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." onChange={this.handleInputChange}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="password" name="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" onChange={this.handleInputChange}/>
                                                        </div>
                                                        <div className="form-group">
                                                        <div className="custom-control custom-checkbox small">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck"/>
                                                            <label className="custom-control-label" htmlFor="customCheck" name="remember_me">Remember Me</label>
                                                        </div>
                                                        </div>
                                                        <button type="submit" formMethod="post" className="btn btn-primary btn-user btn-block">
                                                        Login
                                                        </button>
                                                        <hr/>
                                                        <a href="/" className="btn btn-google btn-user btn-block">
                                                            <i className="fab fa-google fa-fw"></i> Login with Google
                                                        </a>
                                                        <a href="/" className="btn btn-facebook btn-user btn-block">
                                                            <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                                        </a>
                                                    </form>
                                                    <hr/>
                                                    <div className="text-center">
                                                        <a className="small" href="/forgot-password">Forgot Password?</a>
                                                    </div>
                                                    <div className="text-center">
                                                        <a className="small" href="/register">Create an Account!</a>
                                                    </div>
                                                    <p className="text-center text-danger">
                                                        {this.state.error?this.state.error:''}
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
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        var credentials = this.state.credentials;
        credentials[name] = value
        this.setState({
            credentials: credentials
        });
    }
    
    handleSubmit = async(event)=> {
        //alert('A name was submitted: ' + JSON.stringify(this.state));
        try{

        }catch(err){

        }
        var me = this;
        Auth.login(this.state.credentials, ()=>{
            //alert(Auth.isAuthenticated);
            console.log("Logged In");
            me.setState({
                loggedIn:true
            },()=>{
                console.log(this.state.loggedIn);
                window.location = "/";
                //me.props.history.push("/");

            })

        },(err)=>{
            me.setState({
                error:err
            })
        })
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

export default  withRouter(Login);