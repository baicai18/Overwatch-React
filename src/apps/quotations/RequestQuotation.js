import React from 'react';

import {Button, Modal, Form, InputGroup} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import QuotationDeliverable from './QuotationDeliverable';


class RequestQuotation extends React.Component { 
    constructor(props){
        super(props);
        this.deliverableForm = React.createRef();
        this.state={
            show:props.show,
            project_id:props.project_id, 
            revision_id:props.revision_id,
            data:{
                quantity:[null]
            },
            rfqForm:{}
        }

    }

    async componentDidMount(){
        //this.refreshRequirements();
        try{
            let pms = await SDK.Users.findPMs()
            let rfqForm = await SDK.RFQ.getRFQForm();
            let rfqTypes = await SDK.RFQTypes.getRFQTypes();
            this.setState({
                rfqForm:rfqForm?rfqForm.formData:null,
                rfqTypes:rfqTypes,
                pms:pms,
                selectedType:rfqTypes.length > 0?rfqTypes[0]:null
            })
        }catch(err){
            console.error(err);
            alert(err);
        }
    }
    componentDidUpdate(props){
        if(props.revision_id !== this.props.revision_id){
            this.setState({
                revision_id:this.props.revision_id
            })
        }
    }
    closeModal = ()=>{
        this.setState({
            show:false,
            data:{
                quantity:[null]
            },
        })
    }
    showModal = ()=>{
        this.setState({
            show:true
        })
        
    }
    submitRequest = async ()=>{
        let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        try{
            await SDK.Projects.requestQuotation(this.state.project_id, this.state.revision_id, this.props.productType._id, this.state.selectedType?this.state.selectedType._id:null, this.state.data, formData);
            if(this.props.onSubmit){
                this.props.onSubmit(this.state.data, formData);
            }
            this.closeModal();
        }catch(err){
            console.error(err);
            alert('Error:' + err);
        }
    }

    controlChanged = (e)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        data[e.currentTarget.name] = value;
        this.setState({
            data:data
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
        

    }
    
    updateTypeReqs = async (e)=>{
        try{
            let selectedType = this.state.rfqTypes.find((row)=>{
                if(row._id === e.target.value){
                    return true;
                }
            })
            this.setState({
                selectedType:selectedType
            })
        }catch(err){
            this.setState({
                selectedType:null
            })
        }
        this.controlChanged(e);
    }

    addQuanitity = ()=>{
        let data = this.state.data;
        if(data.quantity){
            if(Array.isArray(data.quantity)){
                data.quantity.push(null);
            }else{
                data.quantity = [data.quantity,null];
            }
        }else{
            data.quantity = [null,null];
        }
        this.setState({
            data:data
        })
    }
    removeQuantity = ()=>{
        let data = this.state.data;
        if(data.quantity){
            if(Array.isArray(data.quantity)){
                data.quantity.splice(data.quantity.length - 1, 1);
            }else{
                data.quantity = [null];
            }
        }else{
            data.quantity = [null];
        }
        this.setState({
            data:data
        })
    }
    quantityChanged = (e, index)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        if(data.quantity[index]){
            data.quantity[index].quantity = value;
        }else{
            data.quantity[index] = {
                quantity:value
            }
        }
        
        this.setState({
            data:data
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
    }
    leadTimeChanged = (e, index)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        if(data.quantity[index]){
            data.quantity[index].leadTime = value;
        }else{
            data.quantity[index] = {
                leadTime:value
            }
        }
        
        this.setState({
            data:data
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Quotation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.rfqTypes&&this.state.rfqTypes.length > 0?
                    <Form.Group>
                        <Form.Label>Order Type</Form.Label>
                        <Form.Control name="order_type" as="select" size="sm" value={this.state.selectedType?this.state.selectedType._id:''} onChange={this.updateTypeReqs}>
                            <option></option>
                            {this.state.rfqTypes?this.state.rfqTypes.map((row)=>{
                                return <option value={row._id}>{row.order_type}</option>
                            }):null}
                        </Form.Control>
                    </Form.Group>
                    :null
                    }
                    <h3>{this.props.productType?this.props.productType.product_name:''}</h3>
                    {/* <Form.Group>
                        <Form.Label>Quantity *</Form.Label>
                        {
                            Array.isArray(this.state.data.quantity)?
                            this.state.data.quantity.map((row,index)=>{
                                return <InputGroup>
                                    <Form.Control name="quantity" type="number" min="1" value={row||''} className="mb-1" onChange={(e)=>{this.quantityChanged(e,index)}}/>
                                    {
                                        index === this.state.data.quantity.length-1?
                                        <div>
                                            <Button variant="secondary" id="button-addon2"  onClick={this.addQuanitity}>
                                                <i className="fa-solid fa-plus"></i>
                                            </Button>
                                            <Button variant="danger" id="button-addon2"  onClick={this.removeQuantity}>
                                            <i className="fa-solid fa-xmark"></i>
                                            </Button>

                                        </div>
                                        :null
                                    }

                                </InputGroup>
                            })
                            :<InputGroup>
                                <Form.Control name="quantity" type="number" min="1" value={this.state.data.quantity||''} onChange={this.controlChanged}/>
                                    <Button variant="outline-secondary" id="button-addon2" onClick={this.addQuanitity}>
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                            </InputGroup>
                        }
                        
                    </Form.Group> */}
                    {
                            Array.isArray(this.state.data.quantity)?
                            
                            <Form.Row>
                                <Form.Group className="col-md-6">
                                    <Form.Label>
                                        Quantity
                                    </Form.Label>
                                    {
                                        this.state.data.quantity.map((row,index)=>{
                                            return <InputGroup>
                                                <Form.Control name="quantity" type="number" min="1" value={row?row.quantity||'':''} className="mb-1" onChange={(e)=>{this.quantityChanged(e,index)}}/>
            
                                            </InputGroup>
                                        })
                                    }
                                    {/* <Form.Control name="quantity" type="number" min="1" value={this.state.data.quantity||''} onChange={this.controlChanged}/> */}
                                </Form.Group>
                                <Form.Group className="col-md-6">
                                    <Form.Label>
                                        Lead Time
                                    </Form.Label>
                                    
                                    {
                                        this.state.data.quantity.map((row,index)=>{
                                            return <InputGroup>
                                                <Form.Control name="leadTime" type="number" min="1" value={row?row.leadTime||'':''} className="mb-1" onChange={(e)=>{this.leadTimeChanged(e,index)}}/>
                                                {
                                                    index === this.state.data.quantity.length-1?
                                                    <div>
                                                        <Button variant="secondary" id="button-addon2"  onClick={this.addQuanitity}>
                                                            <i className="fa-solid fa-plus"></i>
                                                        </Button>
                                                        {
                                                            index !== 0?
                                                            <Button variant="danger" id="button-addon2"  onClick={this.removeQuantity}>
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </Button>
                                                            :null
                                                        }
            
                                                    </div>
                                                    :null
                                                }
            
                                            </InputGroup>
                                        })
                                    }
                                    {/* <InputGroup>
                                        <Form.Control name="quantity" type="number" min="1" value={this.state.data.quantity||''} onChange={this.controlChanged}/>
                                            <Button variant="outline-secondary" id="button-addon2" onClick={this.addQuanitity}>
                                                <i className="fa-solid fa-plus"></i>
                                            </Button>
                                    </InputGroup> */}
                                </Form.Group>
                            </Form.Row>
                            :
                            <Form.Row>
                                <Form.Group className="col-md-6">
                                    <Form.Label>
                                        Quantity
                                    </Form.Label>
                                    <Form.Control name="quantity" type="number" min="1" value={this.state.data.quantity||''} onChange={this.controlChanged}/>
                                </Form.Group>
                                <Form.Group className="col-md-6">
                                    <Form.Label>
                                        Lead Time
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control name="leadTime" type="number" min="1" value={this.state.data.leadTime||''} onChange={(e)=>{this.leadTimeChanged(e,1)}}/>
                                            <Button variant="outline-secondary" id="button-addon2" onClick={this.addQuanitity}>
                                                <i className="fa-solid fa-plus"></i>
                                            </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Form.Row>
                        }
                    <DeliverableForm ref={this.deliverableForm} formDesign={this.state.rfqForm}/>
                    <Form.Group>
                        <Form.Label>ITAR</Form.Label>
                        <Form.Control name="itar" as="select" size="sm" value={this.state.data?this.state.data.itar:'no'} onChange={this.controlChanged}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                            
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>PM</Form.Label>
                        <Form.Control className="form-control-sm" as="select" name="pm"  value={this.state.data?this.state.data.pm:''} onChange={this.controlChanged} >
                            <option></option>
                            {
                                this.state.pms?
                                this.state.pms.map((row)=>{
                                    return <option value={row.first_name + ' ' + row.last_name}>{row.first_name + ' ' + row.last_name}</option>
                                })
                                :null
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Comments</Form.Label>
                        <Form.Control name="comments" as="textarea" rows="5" size="sm" value={this.state.data?this.state.data.comments:''} onChange={this.controlChanged}/>
                    </Form.Group>
                    {/* {
                        this.state.selectedType?
                        this.state.selectedType.requirements.map((row)=>{
                            return <QuotationDeliverable requirement={row.requirement}/>
                        })
                        :null
                    } */}
                </Modal.Body>
                {/* <Modal.Body>
                    <pre>
                        {JSON.stringify(this.state.data, null, 2)}
                    </pre>
                </Modal.Body> */}
                <Modal.Footer>
                    {/* <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button> */}
                    <Button variant="primary" size="sm"onClick={this.submitRequest}>
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>
        )
        
    }

    
}

export default RequestQuotation;