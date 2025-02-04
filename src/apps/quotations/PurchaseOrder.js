import React from 'react';
// with es5
import {Form, Nav, Card, Button, Badge} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import QuotationInfo from './QuotationInfo';
import SubmitPurchaseOrder from './SubmitPurchaseOrder';
import auth from '../../auth';
import PurchaseOrderInfo from './PurchaseOrderInfo';

class PurchaseOrder extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            purchaseOrderNumber: props.match.params.purchaseOrderNumber,
            purchaseOrderInfo:{}
        }
        this.poModal = React.createRef();
        this.purchaseOrderInfo = React.createRef();
    }

    componentDidMount(){
        this.loadPurchaseOrder(this.state.purchaseOrderNumber);
    }
    loadPurchaseOrder = async()=>{
        try{
            let data = await SDK.PurchaseOrders.getPurchaseOrder(this.state.purchaseOrderNumber);
            if(data){
                let form = data.formId?await SDK.Forms.getForm(data.formId):null;
                let formDesign = data.formId?await SDK.Forms.getFormDesign(form.formId):null;
                this.setState({
                    formDesign:formDesign,
                    form:form,
                    purchaseOrderInfo:data
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
        alert("Saved");
    }
    getFile = (file)=>{
        SDK.Vault.getFile(file);
    }

    approvePurchaseOrder = async ()=>{
        try{
            await SDK.PurchaseOrders.approvePurchaseOrder(this.state.purchaseOrderNumber);
            this.purchaseOrderInfo.current.updateInfo();
        }catch(err){
            console.error(err);
            alert(err);
        }

    }

    toggleEdit = ()=>{
        this.setState({
            editing:!this.state.editing
        },()=>{
            if(!this.state.editing){
                this.purchaseOrderInfo.current.updateInfo();
            }
            this.setModified(false);
        })
    }
    
    saveChanges=()=>{
        this.purchaseOrderInfo.current.trySave();
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
                        <h6 className="m-0 font-weight-bold text-primary">Purchase Order</h6>
                            <div className="header-actions">
                            {this.state.modified?<Badge><i class="fa fas fa-triangle-exclamation"></i> Warning  you have unsaved changed</Badge>:null} 
                            {
                                auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") && !this.state.purchaseOrderInfo.approved?
                                <   button className="btn btn-primary btn-sm" onClick={this.approvePurchaseOrder}>Approve Purchase Order</button>
                                :''
                            }
                            
                            <button className="btn btn-primary btn-sm" onClick={this.toggleEdit}>{this.state.editing?'Cancel':'Edit'}</button>
                            </div>
                    </div>
                    <div className="card-body">
                        <PurchaseOrderInfo  readOnly={!this.state.editing} ref={this.purchaseOrderInfo} key={this.state.purchaseOrderNumber} purchaseOrderNumber={this.state.purchaseOrderNumber} onModified={()=>{this.setModified(true)}} onSaved={()=>{this.setModified(false)}}/>
                    </div>
                    {
                        this.state.editing?
                        <Card.Footer><Button size="sm" onClick={this.saveChanges}>Save</Button></Card.Footer>
                        :''
                    }
                    {/* <div className="card-body">
                        <pre>
                            {
                                this.state?
                                JSON.stringify(this.state, null, 2)
                                :''
                            }
                        </pre>
                    </div> */}
                </div>
                <SubmitPurchaseOrder ref={this.poModal} quotationNumber={this.state.quotationNumber} onSubmit={this.submitPurchaseOrder}/>
            </div>
        );
    }
    

}

export default  PurchaseOrder;