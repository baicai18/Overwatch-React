import React from 'react';
import {Carousel, Form} from 'react-bootstrap';
import Stepper from 'react-stepper-horizontal';
import {Emailer,InitialSetup as initialSetup}  from '../sdk/SDK';
import ConfirmationRegister from '../pages/ConfirmationRegister';

class InitialSetup extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            company_info_validated:false,
            company_info:{

            },
            emailer_options_validated:false,
            emailer_options:{

            },
            email_test_validated:false,
            email_test_form:{

            },
            admin_options_validated:false,
            admin_options:{

            },
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
            index:0,
            validated: false,
            error:null
            
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendTestEmail = this.sendTestEmail.bind(this);
        this.setValidated = this.setValidated.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }
    

    componentDidMount(){
        //alert(Auth.isAuthenticated);
    }
    setValidated(value){
        this.setState({
            validated: value
        });
    }

    formChange = event =>{

        var item = this.state.usr;
        item[event.target.name] = event.target.value;
        this.setState({
            usr:item
        })
    }

    handleBack = event=>{
        if(this.state.index > 0){
            this.setState({
                index: this.state.index-1
            })

        }
    }
    handleNext = event =>{
        switch(this.state.index){
            case 0:
                this.setState({
                    index: this.state.index+1
                });
                break;
            case 1:
                if(this.refs.company_info.checkValidity() === false){
                    this.setState({
                        check_info_validated:true
                    });
                }else{
                    this.setState({
                        check_info_validated:false,
                        index:this.state.index+1
                    });
                }
                
                break;
            case 2:
                if(this.refs.emailer_options.checkValidity() === false){
                    this.setState({
                        emailer_options_validated:true
                    });
                }else{
                    this.setState({
                        emailer_options_validated:false,
                        index: this.state.index+1
                    });
                }
                break;
            case 3:
                if(this.refs.admin_options.checkValidity() === false){
                    this.setState({
                        admin_options_validated:true
                    });
                }else{
                    initialSetup.submitSetup({
                        company_info:this.state.company_info,
                        emailer_info: this.state.emailer_options,
                        admin_info: this.state.admin_options
                    })
                    .then(data=>{
                        this.setState({
                            admin_options_validated:false,
                            redirect:'/confirmationSent'
                        });
                    })
                    .catch(err=>{
                        alert(err);
                    })
                   
                }
                break;
            default:
                break;

        }
        if(this.state.index < 3){
            

        }
    }

    handleChange = e =>{
        var data = this.state[e.currentTarget.dataset.formname];
        data[e.currentTarget.name] = e.currentTarget.value;
        this.setState({
            [e.currentTarget.dataset.formname]:data
        });
            
    }

    sendTestEmail = e =>{
        if(this.refs.emailer_options.checkValidity() === false){
            this.setState({
                emailer_options_validated:true
            });
        }else if(this.refs.email_test_form.checkValidity() === false){
            this.setState({
                email_test_form_validated:true
            });
        }else{
            Emailer.sendTestEmail(this.state.emailer_options, this.state.email_test_form.test_email)
            .then(data=>{
                alert("Sent");
            })
            .catch(err=>{
                alert(err);
            })
        }
    }

    render = ()=>{

        if(this.state.redirect){
            return <ConfirmationRegister/>
        }else{

            return (
                <div className="container">
    
                    <div className="card o-hidden border-0 shadow-lg my-5 d-flex flex-column" style={{height:"800px"}}>
                        <Stepper steps={ [{title: 'Welcome'}, {title: 'Company Info'}, {title: 'Emailer Options'}, {title: 'Administrator Account'}] } activeStep={this.state.index } />
                        <div className="card-body d-flex flex-column">
                            <Carousel indicators={false} interval={null} controls={false} activeIndex={this.state.index} className="w-100 h-100" style={{margin:"auto"}}>
                                <Carousel.Item className="h-100 text-center">
                                    <div className="align-middle h-100 d-flex flex-column justify-content-center">
                                        <h1>Welcome</h1>
                                        <p>Let's set up your environment!</p>
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item className="h-100 text-center">
                                    <div className="align-middle h-100 d-flex flex-column justify-content-center">
                                        <h1>Company Info</h1>
                                        <p>Please fill out the following info</p>
                                        <Form ref="company_info" validated={this.state.check_info_validated}>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Company Name"
                                                defaultValue=""
                                                data-formname="company_info"
                                                value={this.state.company_info.company_name}
                                                name="company_name"
                                                onChange={this.handleChange}
                                                style={{margin:"0 auto", textAlign:"center", width:"300px"}}
                                            />
                                        </Form>
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item className="h-100 text-center">
                                    <div className="align-middle h-100 d-flex flex-column justify-content-center">
                                        <h1>Emailer Options</h1>
                                        <p>Please fill out the following info</p>
                                        <div clas="row" style={{marginLeft:"auto", marginRight:"auto"}}>
                                            <Form ref="emailer_options" validated={this.state.emailer_options_validated}>
                                                <div className="form-row">
                                                    <div className="col-md-9">
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="SMTP Host"
                                                            defaultValue=""
                                                            data-formname="emailer_options"
                                                            value={this.state.emailer_options.host}
                                                            name="host"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Form.Control
                                                            required
                                                            type="number"
                                                            placeholder="Port"
                                                            defaultValue=""
                                                            data-formname="emailer_options"
                                                            value={this.state.emailer_options.port}
                                                            name="port"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-6">
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="Username"
                                                            defaultValue=""
                                                            data-formname="emailer_options"
                                                            value={this.state.emailer_options.user}
                                                            name="user"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Form.Control
                                                            required
                                                            type="password"
                                                            placeholder="Password"
                                                            defaultValue=""
                                                            data-formname="emailer_options"
                                                            value={this.state.emailer_options.pass}
                                                            name="pass"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </Form>
                                            <hr/>
                                            <p>We'll send a test email to the following address</p>
                                            <Form ref="email_test_form" validated={this.state.email_test_form_validated}>
                                                <div className="form-row">
                                                    <Form.Control
                                                        required
                                                        type="email"
                                                        placeholder="Email"
                                                        data-formname="email_test_form"
                                                        value={this.state.email_test_form.test_email}
                                                        name="test_email"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </Form>
                                            <br/>
                                            <button className="btn btn-secondary" id="test_emailer" onClick={this.sendTestEmail}>Send Test Email</button>
                                        </div>
                                    </div>
                                </Carousel.Item>
                                <Carousel.Item className="h-100 text-center">
                                    <div className="align-middle h-100 d-flex flex-column justify-content-center">
                                        <h1>Administrator Account</h1>
                                        <p>Almost there! Let's create your account</p>
                                        <div style={{marginLeft:"auto", marginRight:"auto"}}>
                                        <Form ref="admin_options" validated={this.state.admin_options_validated}>
                                                <div className="form-row">
                                                    <div className="col-md-12">
                                                        <Form.Control
                                                            required
                                                            type="email"
                                                            placeholder="Email Address"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.email}
                                                            name="email"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-6">
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="First Name"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.first_name}
                                                            name="first_name"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="Last Name"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.last_name}
                                                            name="last_name"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-12">
                                                        <Form.Control
                                                            required
                                                            type="phone"
                                                            placeholder="Phone Number"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.phone_number}
                                                            name="phone_number"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-12">
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="Organization"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.organization}
                                                            name="organization"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-12">
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="Job Title"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.job_title}
                                                            name="job_title"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-12">
                                                        <Form.Control
                                                            required
                                                            type="password"
                                                            placeholder="Password"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.password}
                                                            name="password"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row mt-2">
                                                    <div className="col-md-12">
                                                        <Form.Control
                                                            required
                                                            type="password"
                                                            placeholder="Repeat Password"
                                                            defaultValue=""
                                                            data-formname="admin_options"
                                                            value={this.state.admin_options.repeat_password}
                                                            name="repeat_password"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        </div>
                        <div className="mt-auto p-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <button type="button" className="btn btn-primary navbar-right" id="back" style={this.state.index > 0? {} : {display:"none"}} onClick={this.handleBack}>Back</button> 
                                </div>
                                <div className="col-md-6 text-right">
                                    <button type="button" className="btn btn-primary navbar-right" id="next" onClick={this.handleNext}>Next</button> 
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
    
        this.setState({
          [name]: value
        });
    }
    
}

export default  InitialSetup;