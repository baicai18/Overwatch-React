
import Auth from '../auth';
import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';
// import './../../styles/loginPage.css';

class LoginPage extends Component{
    constructor(props){
        super(props);
        console.log(props.match);

        this.username=React.createRef();
        this.password=React.createRef();

        this.state={
            redirect:props.redirect || '/',
            error:''
        }

    }

    componentDidMount(){
    }

    tryLogin = async ()=>{
        try{
            if(await Auth.login(this.username.current.value, this.password.current.value)){
                window.location.href = this.state.redirect;
            }else{
                this.setState({
                    error:"Invalid username or password"
                });
            }
        }catch(err){
            alert(err);
        }
    }

    passKeyPress = async(e)=>{
        if(e.key === 'Enter'){
            this.tryLogin();
        }
    }

    render(){

        return(
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
                                                    <form className="user">
                                                        <div className="form-group">
                                                            <input ref={this.username} type="email" name="email" className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..."/>
                                                        </div>
                                                        <div className="form-group">
                                                            <input ref={this.password} type="password" name="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" onKeyPress={this.passKeyPress} />
                                                        </div>
                                                        <div className="form-group">
                                                        <div className="custom-control custom-checkbox small">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck"/>
                                                            <label className="custom-control-label" htmlFor="customCheck" name="remember_me">Remember Me</label>
                                                        </div>
                                                        </div>
                                                        <button type="button" onClick={this.tryLogin} className="btn btn-primary btn-user btn-block">
                                                        Login
                                                        </button>
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
            
        )
    }
}

export default LoginPage