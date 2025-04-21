import React from 'react';
import {Redirect} from 'react-router-dom';
import SDK from '../../sdk/SDK';
import FormDesigner from '../tools/formDesigner/FormDesigner';
import StatusAdmin from './StatusAdmin';
import LookupAdmin from './LookupAdmin';
import RFQTypes from './RFQTypes';
import { Card, Button, Tabs, Tab } from 'react-bootstrap';

import NotificationBuilder from '../tools/notifications/NotificationBuilder';
import Auth from '../../auth';

class RFQOptions extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            rfqOptions:null,
            RFQForm:{},
        }
    }

    async componentDidMount(){
        try{
            console.log(JSON.stringify(Auth.userInfo,null,2))
            // let rfqOptions = await SDK.RFQ.getRFQOptions();
            // let rfqForm = await SDK.RFQ.getRFQForm();
            let users = await SDK.Organizations.getOrganizationUsers(Auth.userInfo.organizationdetails.name);
            console.log(users)
            let roles = await SDK.UserRoles.findUserRoles({q:`organization_name="` + Auth.userInfo.organizationdetails.name + `"`});
            this.setState({
                // rfqOptions:rfqOptions,
                // RFQForm: rfqForm.formData,
                users:users,
                roles:roles
            },()=>{
                this.forceUpdate();
            })
        }catch(err){
            alert(err);
            //alert(err);  
        }
        
    }

    formDataChanged = (formData)=>{
        var RFQForm = this.state.RFQForm;
        RFQForm = formData;
        this.setState({
            RFQForm:RFQForm
        },()=>{
        });
    }
    saveRFQForm = async ()=>{
        if(this.state.RFQForm){
            try{
                await SDK.RFQ.saveRFQOptionsForm(this.state.RFQForm);
            }catch(err){
                alert(err);
            }
        }
    }
    render = ()=>{
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }else{
            return (
                <div className="container-fluid">
                    <h1 className="h3 mb-2 text-gray-800">RFQ Options</h1>
                    <p className="mb-4">Settings for RFQ</p>

                    
                    <Tabs defaultActiveKey="extra_fields">
                        <Tab eventKey="extra_fields" title="Submit - Extra Fields">
                            <Card>
                                <Card.Header>
                                    <h6 className="m-0 font-weight-bold text-primary">Extra Fields</h6>
                                </Card.Header>
                                <Card.Body>
                                <FormDesigner formData={this.state.RFQForm} onFormDataChanged={this.formDataChanged}/>

                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" size="sm"  onClick={this.saveRFQForm}>Save</Button>
                                </Card.Footer>
                            </Card>
                        </Tab>
                        <Tab eventKey="statuses" title="Statuses">
                            <Card>
                                <Card.Body>
                                    <StatusAdmin processType={'RFQ'}/>

                                </Card.Body>
                            </Card>                            
                        </Tab>
                        <Tab eventKey="types" title="RFQ Types">
                            <Card>
                                <Card.Body>
                                    <RFQTypes/>

                                </Card.Body>
                            </Card>                            
                        </Tab>
                        <Tab eventKey="archive" title="Archive Reasons">
                            <Card>
                                <Card.Body>
                                    <LookupAdmin processType={'Archive Reasons'}/>

                                </Card.Body>
                            </Card>                            
                        </Tab>
                        <Tab eventKey="notifications" title="Notifications">
                            <NotificationBuilder users={this.state.users} roles={this.state.roles} type={1} code={'RFQ'}></NotificationBuilder>                
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        
    }    

}

export default RFQOptions;