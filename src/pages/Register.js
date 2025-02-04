import React from 'react';
import { withRouter } from "react-router-dom";
import {Form, Col, Button} from 'react-bootstrap';

class Register extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            usr:{
                email:'',
                first_name: '',
                last_name: '',
                phone_number: '',
                organization: '',
                job_title: '',
                password:'',
                repeat_password: '',

            },
            validated: false,
            error:null
            
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setValidated = this.setValidated.bind(this);
    }
    

    componentDidMount(){
        //alert(Auth.isAuthenticated);
    }
    setValidated(value){
        this.setState({
            validated: value
        });
    }
    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }else{
            fetch(process.env.REACT_APP_APISERVER + '/api/users/register', {
                method: 'POST',
                body: JSON.stringify(this.state.usr),
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            })
            .then(response=>{
                if(!response.ok){
                    this.setState({error:'FAILED'});
                    response.text().then(text=>alert(text));
                    throw Error(response);
                }else{
                    return response.json()
                }

            })
            .then(data=>{
                window.location.href = "/login";
                this.setValidated(true);
            })
            .catch(err=>{
                console.log(err);
            })
        }
        this.setValidated(true);
        event.preventDefault();
        event.stopPropagation();
    };

    formChange = event =>{

        var item = this.state.usr;
        item[event.target.name] = event.target.value;
        this.setState({
            usr:item
        })
    }


    render = ()=>{
        return (
        <div className="container">
            
            <div className="row justify-content-center">

                <div className="card o-hidden border-0 shadow-lg my-5 col-lg-7">
                    <div classname="card-header">
                        <div className="bg-login-image d-lg-block"></div>
                    </div>
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                    </div>
                                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                        <Form.Row>
                                            <Form.Group as={Col} md="12" controlId="validationCustom01">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="email"
                                                    placeholder="Email"
                                                    defaultValue=""
                                                    value={this.state.usr.email}
                                                    name="email"
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid email format.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                                <Form.Label>First name</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="First name"
                                                    defaultValue=""
                                                    name="first_name"
                                                    value={this.state.usr.first_name}
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                                <Form.Label>Last name</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="Last name"
                                                    defaultValue=""
                                                    name="last_name"
                                                    value={this.state.usr.last_name}
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="12" controlId="validationCustom01">
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="phone"
                                                    placeholder="Phone number (xxx)xxx-xxxx"
                                                    defaultValue=""
                                                    name="phone_number"
                                                    value={this.state.usr.phone_number}
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid phone format.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="12" controlId="validationCustom01">
                                                <Form.Label>Organization Name</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="Organization"
                                                    defaultValue=""
                                                    name="organization"
                                                    value={this.state.usr.organization}
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="12" controlId="validationCustom01">
                                                <Form.Label>Job Title</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder="Job Title"
                                                    defaultValue=""
                                                    name="job_title"
                                                    value={this.state.usr.job_title}
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="password"
                                                    placeholder="Password"
                                                    defaultValue=""
                                                    name="password"
                                                    pattern=".{8,}"
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">
                                                    Minimum 8 characters
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                                <Form.Label>Repeat Password</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="password"
                                                    placeholder="Repeat Password"
                                                    defaultValue=""
                                                    name="repeat_password"
                                                    pattern=".{8,}"
                                                    onChange={this.formChange}
                                                />
                                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">
                                                    Minimum 8 characters
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Button type="submit" className="btn-block">Register Account</Button>
                                        <hr/>
                                        <Button type="submit" className="btn-google btn-block">Register with Google</Button>
                                        <Button type="submit" className="btn-facebook e btn-block">Register with Facebook</Button>

                                    </Form>
                                    <hr/>
                                    <div className="text-center">
                                        <a className="small" href="/forgot-password">Forgot Password?</a>
                                    </div>
                                    <div className="text-center">
                                        <a className="small" href="/login">Already have an account? Login!</a>
                                    </div>
                                    <p className="text-center text-danger">
                                        {this.state.error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
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
    
}

export default  withRouter(Register);