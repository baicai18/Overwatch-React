import React from 'react';
import {Form, Col, Button, Row, Card} from 'react-bootstrap';
import SDK from '../../sdk/SDK';


class Addresses extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            organization_name: props.organization_name,
            newAddress: true,
            validated:false,
            addressInfo:{organization:props.organization_name},
            addresses:[]
        }

    }

    componentDidMount(){
        var me = this;
        SDK.Organizations.getAddresses(this.state.organization_name)
        .then(function(data){
            me.setState({
                addresses:data
            });
        })
        .catch(err=>{
            console.log(err);
        })
    }

    AddressList = props =>{
        const listItems = (props.addresses? props.addresses.map((address)=>{
            return (
                <li className="list-group-item list-group-item-action flex-column align-items-start" data-label={address.label} onClick={this.addressClick} key={address}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{address.label}</h5>
                        <small></small>
                    </div>
                    <p className="mb-1">{address.address1}</p>
                    <p className="mb-1">{address.address2}</p>
                    <p className="mb-1">{address.address3}</p>
                    <p className="mb-1">{address.address4}</p>
                    <p className="mb-1">{address.city + ', ' + address.state + ', ' + address.zip}</p>
                    <p className="mb-1">{address.country}</p>
                </li>
            )
        }):[]);
        return (<div>{listItems}</div>);
    }
    addressList = (addresses)=>{
        const listItems = (addresses? addresses.map((address)=>{
            return (
                <li className="list-group-item list-group-item-action flex-column align-items-start" data-label={address.label} onClick={this.addressClick} key={address}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{address.label}</h5>
                        <small></small>
                    </div>
                    <p className="mb-1">{address.address1}</p>
                    <p className="mb-1">{address.address2}</p>
                    <p className="mb-1">{address.address3}</p>
                    <p className="mb-1">{address.address4}</p>
                    <p className="mb-1">{address.city + ', ' + address.state + ', ' + address.zip}</p>
                    <p className="mb-1">{address.country}</p>
                </li>
            )
        }):[]);
        return (<div>{listItems}</div>);
    }

    addressClick = e =>{
        var me = this;
        SDK.Organizations.getAddress(this.state.organization_name, this.state.addressInfo.label)
        .then(data=>{
            me.setState({
                addressInfo: data,
                newAddress: false
            })
        })
        .catch(err=>{
            console.log(err);
        })

    }

    

    handleSubmit = (event) => {
        const form = event.currentTarget;
        
        event.preventDefault();
        event.stopPropagation();

        
        if (form.checkValidity() === false) {
            this.setValidated(true);
            event.preventDefault();
            event.stopPropagation();
        }else{
            if(this.state.newAddress){
                SDK.Organizations.saveAddress(this.state.organization_name, this.state.addressInfo)
                .then(data=>{
                    SDK.Organizations.getAddresses(this.state.organization_name)
                    .then(data=>{
                        this.setState({
                            addresses:data
                        })
                    });
                    SDK.Organizations.getAddress(this.state.organization_name, this.state.addressInfo.label)
                    .then(data=>{
                        this.setState({
                            addressInfo: data
                        })
                    })
                    this.setValidated(false);
                    if(this.props.onSave){
                        this.props.onSave(this.state.addressInfo);
                    }
                })
                .catch(err=>{
                    err.text().then(text=>alert(text));
                    console.log(err);
                })
            }else{
                SDK.Organizations.updateAddress(this.state.organization_name, this.state.addressInfo.label, this.state.addressInfo)
                .then(data=>{
                    alert("saved");
                    
                    SDK.Organizations.getAddresses(this.state.organization_name)
                    .then(data=>{
                        this.setState({
                            addresses:data
                        })
                    });
                    SDK.Organizations.getAddress(this.state.organization_name, this.state.addressInfo.label)
                    .then(data=>{
                        this.setState({
                            addressInfo: data
                        })
                    })
                    this.setState({
                        newAddress:false
                    })
                    this.setValidated(false);
                    if(this.props.onSave){
                        this.props.onSave(this.state.addressInfo);
                    }
                })
                .catch(err=>{
                    err.text().then(text=>alert(text));
                    console.log(err);
                })
            }
            
            
        }
        event.preventDefault();
        event.stopPropagation();
    };
    
    setValidated = (value)=>{
        this.setState({
            validated: value
        });
    }
    formChange = (event) =>{

        var item = this.state.addressInfo;
        item[event.target.name] = event.target.value;
        this.setState({
            addressInfo:item
        })
    }

    newAddress = (event) =>{
        this.setState({
            newAddress:true,
            addressInfo:{
                label:'',
                address1:'',
                address2:'',
                address3:'',
                address4:'',
                city:'',
                state:'',
                zip:'',
                country:''
            }
        })
    }
    render = ()=>{
        return (
            <Row>
                <div className="col-md-8">
                    <Card className="h-100">
                        <Card.Header>
                            <h6 className="m-0 font-weight-bold text-primary">Addresses</h6>
                        </Card.Header>
                        <div className="card-body d-flex flex-column">
                            <div className="list-group" style={{overflow:"scroll", height:"700px"}} id="addresses">
                                {
                                    this.addressList(this.state.addresses)
                                }
                                {/* <this.AddressList addresses={this.state.addresses}/> */}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-md-4">
                    <div className="card shadow mb-4 h-100">
                        <div className="card-header py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="m-0 font-weight-bold text-primary">Address Info</h6>
                                <button className="close" id="newAddress" title="New Address" onClick={this.newAddress}>+</button>
                            </div>
                        </div>
                        <Card.Header>
                            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                        <Form.Label>Label</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Label"
                                            defaultValue=""
                                            value={this.state.addressInfo.label}
                                            name="label"
                                            onChange={this.formChange}
                                            readOnly={!this.state.newAddress}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                        <Form.Label>Address 1</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="address1"
                                            value={this.state.addressInfo.address1}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                                        <Form.Label>Address 2</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="address2"
                                            value={this.state.addressInfo.address2}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                                        <Form.Label>Address 3</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="address3"
                                            value={this.state.addressInfo.address3}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                                        <Form.Label>Address 4</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="address4"
                                            value={this.state.addressInfo.address4}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="city"
                                            value={this.state.addressInfo.city}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="state"
                                            value={this.state.addressInfo.state}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                                        <Form.Label>Zip / Postal</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="zip"
                                            value={this.state.addressInfo.zip}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            defaultValue=""
                                            name="country"
                                            value={this.state.addressInfo.country}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit" className="btn-primary">Save</Button>

                            </Form>
                        </Card.Header>
                    </div>
                </div>
            </Row>
        );
    }

}

export default  Addresses;