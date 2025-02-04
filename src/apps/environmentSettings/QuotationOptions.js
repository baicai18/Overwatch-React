import React from 'react';
import {Redirect} from 'react-router-dom';
import SDK from '../../sdk/SDK';
import FormDesigner from '../tools/formDesigner/FormDesigner';
import StatusAdmin from './StatusAdmin';
import { Card, Button, Tab, Tabs, Form } from 'react-bootstrap';

class QuotationOptions extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            quotationOptions:{},
            quotationForm:{},
        }
    }

    async componentDidMount(){
        try{
            let quotationOptions; 
            let quotationForm;
            try{
                quotationOptions= await SDK.Quotations.getQuotationOptions();
            }catch(err){
                 
            }
            try{
                quotationForm = await SDK.Quotations.getQuotationForm();
            }catch(err){
                
            }
            this.setState({
                quotationOptions:quotationOptions || {},
                quotationForm: quotationForm?quotationForm.formData:{}
            },()=>{
                this.forceUpdate();
            })
        }catch(err){
        }
        
    }

    formDataChanged = (formData)=>{
        var quotationForm = this.state.quotationForm;
        quotationForm = formData;
        this.setState({
            quotationForm:quotationForm
        },()=>{
        });
    }
    saveQuotationOptions = async ()=>{
        try{
            if(this.state.quotationOptions && this.state.quotationOptions.options){
                await SDK.Quotations.saveQuotationOptions(this.state.quotationOptions.options);
                alert("Saved");
            }else{
                alert("No Data");
            }
        }catch(err){
            alert(err);
        }
    }
    saveQuotationForm = async ()=>{
        try{
            if(this.state.quotationForm){
                try{
                    await SDK.Quotations.saveQuotationOptionsForm(this.state.quotationForm);
                    alert("Saved");
                }catch(err){
                    alert(err);
                }
            }
        }catch(err){
            alert(err);
        }
        
    }
    updateManualEntry = async(e)=>{
        let data = this.state.quotationOptions || {};
        if(data.options){
            data.options.manualQuotationNumber = e.target.checked;
        }else{
            data.options = {
                manualQuotationNumber:e.target.checked
            }
        }

        this.setState({
            qutationOptions:data
        })
    }
    render = ()=>{
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }else{
            return (
                <div className="container-fluid">
                    <h1 className="h3 mb-2 text-gray-800">Quotation Options</h1>
                    <p className="mb-4">Settings for Quotation</p>
                    
                    <Tabs defaultActiveKey="extra_fields">
                        <Tab eventKey="extra_fields" title="Submit - Extra Fields">
                            <Card>
                                <Card.Body>
                                    <FormDesigner formData={this.state.quotationForm} onFormDataChanged={this.formDataChanged}/>

                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" size="sm"  onClick={this.saveQuotationForm}>Save</Button>
                                </Card.Footer>
                            </Card>                            
                        </Tab>
                        <Tab eventKey="statuses" title="Statuses">
                            <Card>
                                <Card.Body>
                                    <StatusAdmin processType={'Quotation'}/>

                                </Card.Body>
                            </Card>                            
                        </Tab>
                        {/* <Tab eventKey="checklist" title="Approved - Checklist">
                            <Card>
                                <Card.Body>
                                    <ChecklistDesigner checklist={this.state.purchaseOrderChecklist} onFormDataChanged={this.checklistDataChanged}/>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="primary" size="sm"  onClick={this.savePurchaseOrderChecklist}>Save</Button>
                                </Card.Footer>
                            </Card>
                        </Tab> */}
                        <Tab eventKey="otherOptions" title="Other Options">
                            <Card>
                                <Card.Body>
                                    {/* <Form.Group>
                                        <Form.Label>Approval Emails</Form.Label>
                                        <Form.Control type="text" size="sm" name="approvalEmails" value={this.state.notifications?this.state.notifications.approvalEmails:''} onChange={this.notificationsChanged}></Form.Control>
                                    </Form.Group> */}
                                    <Form.Check 
                                        type={'checkbox'}
                                        label={'Enable manual quotation number entry'}
                                        onClick={this.updateManualEntry}
                                        checked={this.state.quotationOptions.options?
                                                this.state.quotationOptions.options.manualQuotationNumber
                                                :false}
                                    />
                                    <br/>
                                    <Button variant="primary" size="sm"  onClick={this.saveQuotationOptions}>Save</Button>
                                </Card.Body>
                                
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        
    }    

}

export default QuotationOptions;