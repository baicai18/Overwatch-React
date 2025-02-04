import React from 'react';
import {Redirect} from 'react-router-dom';
import SDK from '../../sdk/SDK';
import FormDesigner from '../tools/formDesigner/FormDesigner';
import ChecklistDesigner from '../tools/checklistDesigner/ChecklistDesigner';
import StatusAdmin from './StatusAdmin';
import { Card, Button,Tabs,Tab, Form} from 'react-bootstrap';

class PurchaseOrderOptions extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            purchaseOrderOptions:null,
            purchaseOrderForm:{},
            checklistForm:{},
            purchaseOrderChecklist:{
                formData:{}
            }
        }
    }

    async componentDidMount(){
        try{
            let purchaseOrderOptions = await SDK.PurchaseOrders.getPurchaseOrderOptions();
            let purchaseOrderForm = await SDK.PurchaseOrders.getPurchaseOrderForm();
            let purchaseOrderChecklist = await SDK.PurchaseOrders.getPurchaseOrderChecklist();
            let notifications = await SDK.PurchaseOrders.getPurchaseOrderNotifications();
            this.setState({
                purchaseOrderOptions:purchaseOrderOptions||{},
                purchaseOrderForm: purchaseOrderForm?purchaseOrderForm.formData:null,
                purchaseOrderChecklist:purchaseOrderChecklist ||{
                    formData:{}
                },
                notifications:notifications
            },()=>{
                this.forceUpdate();
            })
        }catch(err){
            alert(err);
        }
        
    }

    formDataChanged = (formData)=>{
        var purchaseOrderForm = this.state.purchaseOrderForm;
        purchaseOrderForm = formData;
        this.setState({
            purchaseOrderForm:purchaseOrderForm
        },()=>{
        });
    }
    
    savePurchaseOrderForm = async ()=>{
        if(this.state.purchaseOrderForm){
            try{
                await SDK.PurchaseOrders.savePurchaseOrderOptionsForm(this.state.purchaseOrderForm);
                alert("Saved");
            }catch(err){
                alert(err);
            }
        }
    }
    checklistDataChanged = (formData)=>{
        var purchaseOrderChecklist = this.state.purchaseOrderChecklist;
        purchaseOrderChecklist.formData = formData;
        this.setState({
            purchaseOrderChecklist:purchaseOrderChecklist
        },()=>{
        });
    }
    savePurchaseOrderChecklist = async ()=>{
        if(this.state.purchaseOrderChecklist){
            try{
                await SDK.PurchaseOrders.savePurchaseOrderOptionsChecklist(this.state.purchaseOrderChecklist);
                alert("Saved");
            }catch(err){
                alert(err);
            }
        }
    }
    savePurchaseOrderNotifications = async ()=>{
        if(this.state.notifications){
            try{
                await SDK.PurchaseOrders.savePurchaseOrderOptionsNotifications(this.state.notifications);
                alert("Saved");
            }catch(err){
                alert(err);
            }
        }
    }
    notificationsChanged = (e)=>{
        let notifications = this.state.notifications;
        if(!notifications){
            notifications={};
        }
        notifications[e.target.name] = e.target.value

        this.setState({
            notifications:notifications
        })
    }
    render = ()=>{
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }else{
            return (
                <div className="container-fluid">


                    <h1 className="h3 mb-2 text-gray-800">Purchase Order Options</h1>
                    <p className="mb-4">Settings for Purchase Orders</p>
                    <Tabs defaultActiveKey="extra_fields">
                        <Tab eventKey="extra_fields" title="Submit - Extra Fields">
                            <Card>
                                <Card.Body>
                                    <FormDesigner formData={this.state.purchaseOrderForm} onFormDataChanged={this.formDataChanged}/>

                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" size="sm"  onClick={this.savePurchaseOrderForm}>Save</Button>
                                </Card.Footer>
                            </Card>
                            
                        </Tab>
                        <Tab eventKey="checklist" title="Approved - Checklist">
                            <Card>
                                <Card.Body>
                                    <ChecklistDesigner checklist={this.state.purchaseOrderChecklist} onFormDataChanged={this.checklistDataChanged}/>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" size="sm"  onClick={this.savePurchaseOrderChecklist}>Save</Button>
                                </Card.Footer>
                            </Card>
                            
                            
                        </Tab>
                        <Tab eventKey="statuses" title="Statuses">
                            <Card>
                                <Card.Body>
                                    <StatusAdmin processType={'Purchase Order'}/>

                                </Card.Body>
                            </Card>                            
                        </Tab>
                        <Tab eventKey="notifications" title="Notifications">
                            <Card>
                                <Card.Body>
                                    <h6>Separate email addresses by semicolon ";"</h6>
                                    <Form.Group>
                                        <Form.Label>Approval Emails</Form.Label>
                                        <Form.Control type="text" size="sm" name="approvalEmails" value={this.state.notifications?this.state.notifications.approvalEmails:''} onChange={this.notificationsChanged}></Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" size="sm"  onClick={this.savePurchaseOrderNotifications}>Save</Button>
                                </Card.Body>
                                
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        
    }    

}

export default PurchaseOrderOptions;