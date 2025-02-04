import React from 'react';
// with es5
import {Form, InputGroup} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import RFQInfo from './RFQInfo';
import moment from 'moment';
import auth from '../../auth';


class QuotationInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            readOnly:this.props.readOnly,
            showPurchaseOrder:this.props.showPurchaseOrder == null?true:this.props.showPurchaseOrder,
            quotationNumber: props.match?props.match.params.quotationNumber:props.quotationNumber,
            quotationInfo:{},
            statuses:[]
        }
        this.quotationModal = React.createRef();
        this.formData = React.createRef();
    }

    async componentDidMount(){
        this.updateStatuses();
        this.updateInfo();
    }
    componentDidUpdate(props){
        if(props.quotationNumber !== this.state.quotationNumber){
            alert('updated');
            this.updateInfo();
        }
        
        if(props.readOnly !== this.props.readOnly){
            this.setState({
                readOnly:this.props.readOnly
            })
        }
    }
    
    updateStatuses = async ()=>{
        try{
            let statuses = await SDK.Statuses.findStatuses({q:`process_type="Quotation"`})
            this.setState({
                statuses:statuses
            })
        }catch(err){
            console.error(err);
            alert(err);
        }
    }
    updateInfo = async ()=>{
        try{
            if(this.state.quotationNumber){
                let data = await SDK.Quotations.getQuotation(this.state.quotationNumber);
                if(data){
                    //found
                    let form = data.formId?await SDK.Forms.getForm(data.formId):{}
                    let formDesign = form.formId?await SDK.Forms.getFormDesign(form.formId):{};
    
                    this.setState({
                        formDesign:formDesign,
                        form:form,
                        quotationInfo:data,
                    });
                }else{
                    //alert("NOT FOUND");
                    this.setState({
                        formDesign:null,
                        form:null,
                        quotationInfo:{},
                    });
                }
            }else{
                this.setState({
                    formDesign:null,
                    form:null,
                    quotationInfo:{},
                });

            }
            
            
        }catch(err){
        }
    }
    
    
    quotationInfoChanged = (e)=>{
        var quotationInfo = this.state.quotationInfo;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                            target.checked :
                        target.type==='number'?
                            Number(target.value):
                            target.value;
        quotationInfo[e.currentTarget.name] = value;
        this.setState({
            quotationInfo:quotationInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.quotationInfo);
        }
        if(this.props.onModified)this.props.onModified()

    }
    dataChanged = (e)=>{
        var quotationInfo = this.state.quotationInfo;
        if(!quotationInfo.data){
            quotationInfo.data={};
        }
        let target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                            target.checked :
                        target.type==='number'?
                            Number(target.value):
                            target.value;
        quotationInfo.data[e.currentTarget.name] = value;
        this.setState({
            quotationInfo:quotationInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.quotationInfo);
        }
        if(this.props.onModified)this.props.onModified()

    }

    trySave = async ()=>{
        try{
            let quotationInfo = this.state.quotationInfo;
            quotationInfo.formData = this.formData.current.getFormData();
            let data = await SDK.Quotations.updateQuotationInfo(this.state.quotationNumber,quotationInfo);
            this.formData.current.commitData();
            if(this.props.onSaved){
                this.props.onSaved();
            }
            alert("Saved");
        }catch(err){
            alert("error:" + err);
        }
    }


    render = ()=>{
        return (
            <div>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Quotation #</label>
                        <Form.Control className="form-control-sm" type="text" name="quotationNumber" onChange={this.quotationInfoChanged} value={this.state.quotationInfo.quotationNumber} disabled={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label>Status</label>
                        <Form.Control className="form-control-sm" as="select" type="text" name="status" onChange={this.quotationInfoChanged} value={this.state.quotationInfo.status} disabled={this.state.readOnly} >
                            {
                                this.state.statuses.map((row)=>{
                                    return <option value={row.status_code} disabled={row.inactive}>{row.status_name} {row.inactive?' *inactive*':''}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        this.state.quotationInfo.purchaseOrderNumber && this.state.showPurchaseOrder?
                        <Form.Group className="col-3">
                            
                            <label htmlFor="multple">Customer PO</label>
                            <InputGroup>
                                {/* <Form.Control size="sm"  type="text" value={this.state.rfqInfo.quotationNumber} readOnly={true}/> */}
                                {
                                    this.state.quotationInfo.purchaseOrderInfo?
                                    <a href={'/purchaseOrder/' + this.state.quotationInfo.purchaseOrderNumber}>{this.state.quotationInfo.purchaseOrderInfo.data.customerPO}</a>
                                    :''
                                }
                                
                            </InputGroup>
                        </Form.Group>
                        :''
                    }
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Quotation Date</label>
                        <Form.Control name="request_date" className="form-control-sm" type="date" onChange={this.quotationInfoChanged} value={moment(this.state.quotationInfo.request_date).format('YYYY-MM-DD')}  readOnly={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-4">
                        <label htmlFor="multple">Submitted By</label>
                        <Form.Control className="form-control-sm" type="text"  value={this.state.quotationInfo.requested_by} readOnly={true}/>
                    </Form.Group>
                </Form.Row>
                {
                auth.userInfo && auth.userInfo.permissions.includes('EMPLOYEE_VIEW_PRICING')?
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Total Price (Max)</label>
                        <Form.Control name="totalPriceMax" className="form-control-sm" type="number" onChange={this.dataChanged} value={this.state.quotationInfo.data?this.state.quotationInfo.data.totalPriceMax:''} readOnly={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Total Price (Min)</label>
                        <Form.Control name="totalPriceMin" className="form-control-sm" type="number" onChange={this.dataChanged} value={this.state.quotationInfo.data?this.state.quotationInfo.data.totalPriceMin:''} readOnly={this.state.readOnly}/>
                    </Form.Group>
                </Form.Row>
                :null
                }
                <DeliverableForm ref={this.formData} readOnly={this.state.readOnly} formDesign={this.state.formDesign?this.state.formDesign.formData:{}} formData={this.state.form?this.state.form.formData:{}} onModified={()=>{if(this.props.onModified)this.props.onModified()}}/>
                <RFQInfo readOnly={true} key={this.state.quotationInfo.rfq_number} rfq_number={this.state.quotationInfo?this.state.quotationInfo.rfq_number:''} showQuote={false}/>
            </div>
        );
    }
    

}

export default  QuotationInfo;