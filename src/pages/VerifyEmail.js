import React from 'react';
import Auth from '../auth';
import Loading from './Loading';
import NotFound from './404';
import {Users} from '../sdk/SDK';

class VerifyEmail extends React.Component{

    constructor(props){
        super(props);
        this.password = React.createRef();
        this.password2 = React.createRef();

        this.state = {
            confirmation:props.match.params.confirmation,
            confirmed:false,
            error:false,
            passwordError:null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){
        Users.verifyEmail(this.state.confirmation)
        .then(data=>{
            this.setState({
                confirmed:true,
                confirmationData:data.confirmation
            });
        })
        .catch(err=>{
            this.setState({
                error:true
            });
        })
        //alert(Auth.isAuthenticated);
    }

    resetPassword = async ()=>{
        //alert(this.password.current.value + " " +  this.password2.current.value)
        try{
            await Users.verifyEmailPassword(this.state.confirmation,this.password.current.value, this.password2.current.value)
            this.setState({
                confirmationData:null
            })
        }catch(err){
            try{
                let message = await err.text();
                console.log(message);
                this.setState({
                    passwordError:message
                })
            }catch(err){
                this.setState({
                    passwordError:err
                })
            }
            
        }
        

    }

    render(){

        if(this.state.error){
            return <NotFound/>
        }else if(this.state.confirmed){
            if(this.state.confirmationData){
                switch(this.state.confirmationData.confirmationType){
                    case 1:
                        return (
                            <div class="container">
                                <div class="row justify-content-center">
                
                                    <div class="col-xl-6 col-lg-6 col-md-9">
                
                                        <div class="card o-hidden border-0 shadow-lg my-5">
                                            <div class="card-body p-0">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <div class="p-5">
                                                            <div class="text-center">
                                                                <h1 class="h4 text-gray-900 mb-4">Please set your password</h1>
                                                            </div>
                                                            <form class="user">
                                                                <div class="form-group">
                                                                    <input ref={this.password} type="password" name="password" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Password"/>
                                                                </div>
                                                                <div class="form-group">
                                                                    <input ref={this.password2} type="password" name="password2" class="form-control form-control-user" id="exampleInputPassword" placeholder="Re-enter Password"/>
                                                                </div>
                                                                <button type="button" onClick={this.resetPassword} class="btn btn-primary btn-user btn-block">Save Password</button>
                                                                <p class="text-center text-danger">
                                                                {
                                                                    this.state.passwordError?this.state.passwordError:''
                                                                }
                                                                </p>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                
                                    </div>
                
                                </div>
                            </div>
                        )
                    case 2:
                        return (
                            <div class="container">
                                <div class="row justify-content-center">
                
                                    <div class="col-xl-6 col-lg-6 col-md-9">
                
                                        <div class="card o-hidden border-0 shadow-lg my-5">
                                            <div class="card-body p-0">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <div class="p-5">
                                                            <div class="text-center">
                                                                <h1 class="h4 text-gray-900 mb-4">Thank you for confirming your email</h1>
                                                            </div>
                                                                <div class="form-group">
                                                                    <input ref={this.password} type="password" name="password" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Password"/>
                                                                </div>
                                                                <div class="form-group">
                                                                    <input ref={this.password2} type="password" name="password2" class="form-control form-control-user" id="exampleInputPassword" placeholder="Re-enter Password"/>
                                                                </div>
                                                                <button type="button" onClick={this.resetPassword} class="btn btn-primary btn-user btn-block">Save Password</button>
                                                                <p class="text-center text-danger">
                                                                {
                                                                    this.state.passwordError?this.state.passwordError:''
                                                                }
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
                    default:
                        break;
                }
            }else{
                return (
                    <div class="container">
                        <div class="row justify-content-center">
        
                            <div class="col-xl-6 col-lg-6 col-md-9">
        
                                <div class="card o-hidden border-0 shadow-lg my-5">
                                    <div class="card-body p-0">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div class="p-5">
                                                    <div class="text-center">
                                                        <h1 class="h4 text-gray-900 mb-4">Thank you for confirming your email</h1>
                                                    </div>
                                                    <div class="text-center">
                                                        <a class="small" href="/login">Please proceed to login screen</a>
                                                    </div>
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
            
        }else{
            return <Loading/>;

        }
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

export default  VerifyEmail