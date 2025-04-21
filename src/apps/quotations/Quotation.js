import React from 'react';
// with es5
import {Form, InputGroup, Card, Button, Badge} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import RFQInfo from './RFQInfo';
import SubmitPurchaseOrder from './SubmitPurchaseOrder';
import auth from '../../auth';
import QuotationInfo from './QuotationInfo';


class Quotation extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            quotationNumber: props.match.params.quotationNumber,
            quotationInfo:{},
            modified:false
        }
        this.poModal = React.createRef();
        this.quotationInfo = React.createRef();
    }

    async componentDidMount(){
        var me = this;
        try{
            let data = await SDK.Quotations.getQuotation(this.state.quotationNumber);
            if(data){
                let form = data.formId?await SDK.Forms.getForm(data.formId):{};
                let formDesign = form.formId?await SDK.Forms.getFormDesign(form.formId):{};
                me.setState({
                    formDesign:formDesign,
                    form:form,
                    quotationInfo:data
                });
            }else{
                alert("NOT FOUND");
            }
            
        }catch(err){
            alert(err);
        }
    }
    showRequestModal = ()=>{
        this.poModal.current.showModal();
    }
    submitPurchaseOrder = ()=>{
        this.quotationInfo.current.updateInfo();
        alert("Saved");

    }
    toggleEdit = ()=>{
        this.setState({
            editing:!this.state.editing,
        },()=>{
            if(!this.state.editing){
                this.quotationInfo.current.updateInfo();
            }
            this.setModified(false);
        })
    }

    saveChanges=async ()=>{
        
        await this.quotationInfo.current.trySave();
        
        if(this.state.quotationNumber !== this.quotationInfo.current.state.quotationInfo.quotationNumber){
            this.setState({
                editing:false
            },()=>{
                window.location.href = window.location.href.replace(this.state.quotationNumber, this.quotationInfo.current.state.quotationInfo.quotationNumber)
            })
        
        }
    }

    
    setModified  = (value)=>{
        if(value){
            window.onbeforeunload = function(event) {
                event.returnValue = "Write something clever here..";
            };
        }else{
            window.onbeforeunload = null;
            
        }
        this.setState({
            modified:value
        })

        
    }
    render = ()=>{
        return (
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Quotation</h6>
                        <div className="header-actions">
                            {this.state.modified?<Badge><i class="fa fas fa-triangle-exclamation"></i> Warning  you have unsaved changed</Badge>:null} 
                            {
                                auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") && !this.state.quotationInfo.purchaseOrderNumber?
                                <button className="btn btn-primary btn-sm" onClick={this.showRequestModal}>Submit Purchase Order</button>
                                :''
                            }
                            <button className="btn btn-primary btn-sm" onClick={this.toggleEdit}>{this.state.editing?'Cancel':'Edit'}</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <QuotationInfo readOnly={!this.state.editing} ref={this.quotationInfo} key={this.state.quotationNumber} quotationNumber={this.state.quotationNumber} showPurchaseOrder={true} onModified={()=>{this.setModified(true)}} onSaved={()=>{this.setModified(false)}}/>
                        
                    </div>
                    {
                        this.state.editing?
                        <Card.Footer><Button size="sm" onClick={this.saveChanges}>Save</Button></Card.Footer>
                        :''
                    }
                </div>
                <SubmitPurchaseOrder ref={this.poModal} quotationNumber={this.state.quotationNumber} onSubmit={this.submitPurchaseOrder}/>
            </div>
        );
    }
    

}

export default  Quotation;