import React from 'react';
// with es5
import { Prompt } from 'react-router'
import {Form, InputGroup, Row, Col, Card, Button, Badge} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import moment from 'moment';
import ProjectDeliverable from '../projects/ProjectDeliverable';
import QuotationDeliverable from './QuotationDeliverable';

class RFQInfo extends React.Component{
    // routerWillLeave(nextLocation) {
    //     alert("TEST");
    //     // return false to prevent a transition w/o prompting the user,
    //     // or return a string to allow the user to decide:
    //     // return `null` or nothing to let other hooks to be executed
    //     //
    //     // NOTE: if you return true, other hooks will not be executed!
    //     // if (true)
    //       return 'Your work is not saved! Are you sure you want to leave?'
    //   }
  

    constructor(props){
        super(props);
        this.state = {
            readOnly:this.props.readOnly,
            showQuote:this.props.showQuote == null?true:this.props.showQuote,
            rfq_number: props.match?props.match.params.rfq_number:props.rfq_number,
            rfqInfo:{},
            statuses:[]
        }
        this.quotationModal = React.createRef();
        this.formData = React.createRef();


        
    }

    async componentDidMount(){
        
        this.updatePMs();
        this.updateStatuses();
        this.updateInfo();

        
    }

    componentDidUpdate(props){
        if(props.rfq_number !== this.state.rfq_number){
            // alert('updated');
            this.updateInfo();
        }
        if(props.readOnly !== this.props.readOnly){
            this.setState({
                readOnly:this.props.readOnly
            })
        }
    }
    updatePMs = async ()=>{
        try{
            let pms = await SDK.Users.findPMs()
            this.setState({
                pms:pms
            })
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    updateStatuses = async ()=>{
        try{
            let statuses = await SDK.Statuses.findStatuses({q:`process_type="RFQ"`})
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
            if(this.state.rfq_number){
                let data = await SDK.RFQ.getRFQ(this.state.rfq_number);
                if(data){
                    //found
                    let form = data.formId?await SDK.Forms.getForm(data.formId):{};
                    let formDesign = form.formId?await SDK.Forms.getFormDesign(form.formId):{};
                    let revision = data.project.revisions.find((x)=>{
                        return x._id == data.revision_id
                    })
                    this.setState({
                        formDesign:formDesign,
                        form:form,
                        rfqInfo:data,
                        revision:revision,
                        project:data.project
                    });
                }else{
                    this.setState({
                        formDesign:null,
                        form:null,
                        rfqInfo:{},
                        revision:null,
                    });
                }
            }else{
                this.setState({
                    formDesign:null,
                    form:null,
                    rfqInfo:{},
                    revision:null,
                });

            }
            
            
        }catch(err){
        }
    }

    rfqInfoChanged = (e)=>{
        var rfqInfo = this.state.rfqInfo;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                            target.checked :
                        target.type==='number'?
                            Number(target.value):
                            target.value;
        rfqInfo[e.currentTarget.name] = value;
        this.setState({
            rfqInfo:rfqInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.rfqInfo);
        }
        if(this.props.onModified){
            this.props.onModified();
        }
        

    }
    dataChanged = (e)=>{
        var rfqInfo = this.state.rfqInfo;
        if(!rfqInfo.data){
            rfqInfo.data={};
        }
        let target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked :
                    target.type === 'number'?
                        Number(target.value):
                        target.value;
        rfqInfo.data[e.currentTarget.name] = value;
        this.setState({
            rfqInfo:rfqInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.rfqInfo);
        }

        if(this.props.onModified){
            this.props.onModified();
        }
    }

    trySave = async ()=>{
        try{
            let rfqInfo = this.state.rfqInfo;
            rfqInfo.formData = this.formData.current.getFormData();
            let data = await SDK.RFQ.updateRFQInfo(rfqInfo);
            this.formData.current.commitData();
            if(this.props.onSaved){
                this.props.onSaved();
            }
            alert("Saved");
        }catch(err){
            alert(err);
        }
    }

    unarchiveRFQ = async()=>{
        try{
            let rfqInfo = this.state.rfqInfo;
            let data = await SDK.RFQ.unarchiveRFQ(rfqInfo.rfq_number);
            this.updateInfo();
            if(this.props.onSaved){
                this.props.onSaved();
            }
            alert("Updated");
        }catch(err){
            alert(err);
        }
    }

    

    saveChanges=()=>{
        this.quotationInfo.current.trySave();
    }

    deliverableSaved = async (data)=>{
        console.log(data);
        await this.updateInfo();
        this.forceUpdate();
    }

    
    addQuanitity = ()=>{
        let rfqInfo = this.state.rfqInfo;
        let data = rfqInfo.data || {};
        if(data.quantity){
            if(Array.isArray(data.quantity)){
                data.quantity.push(null);
            }else{
                data.quantity = [data.quantity,null];
            }
        }else{
            data.quantity = [null,null];
        }
        rfqInfo.data = data;
        this.setState({
            rfqInfo:rfqInfo
        })
        if(this.props.onModified){
            this.props.onModified();
        }
    }
    removeQuantity = ()=>{
        let rfqInfo = this.state.rfqInfo;

        let data = rfqInfo.data || {};
        if(data.quantity){
            if(Array.isArray(data.quantity)){
                data.quantity.splice(data.quantity.length - 1, 1);
            }else{
                data.quantity = [null];
            }
        }else{
            data.quantity = [null];
        }
        rfqInfo.data = data;
        this.setState({
            rfqInfo:rfqInfo
        })
        if(this.props.onModified){
            this.props.onModified();
        }
    }
    quantityChanged = (e, index)=>{
        let rfqInfo = this.state.rfqInfo;
        var data = rfqInfo.data || {};
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        if(data.quantity[index]){
            if(typeof data.quantity[index] === 'object'){
                data.quantity[index].quantity = value;
            }else{
                data.quantity[index] = {quantity:value};
            }
            
        }else{
            data.quantity[index] = {
                quantity:value
            }
        }
        // data.quantity[index] = value;
        rfqInfo.data = data;
        this.setState({
            rfqInfo:rfqInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.rfqInfo);
        }
        if(this.props.onModified){
            this.props.onModified();
        }
    }
    leadTimeChanged = (e, index)=>{
        let rfqInfo = this.state.rfqInfo;
        var data = rfqInfo.data || {};
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        if(data.quantity[index]){
            if(typeof data.quantity[index] === 'object'){
                data.quantity[index].leadTime = value;
            }else{
                data.quantity[index] = {leadTime:value};
            }
        }else{
            data.quantity[index] = {
                leadTime:value
            }
        }
        // data.quantity[index] = value;
        rfqInfo.data = data;
        this.setState({
            rfqInfo:rfqInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.rfqInfo);
        }
        if(this.props.onModified){
            this.props.onModified();
        }
    }
    render = ()=>{
        return (
            <div>{
                (this.state.rfqInfo && this.state.rfqInfo.archived)?
                <Button className="mb-3" size="sm" onClick={this.unarchiveRFQ} >Unarchive</Button>
                :null
            }
                <Row>
                    <Col md={8}>
                        {/* <RFQInfo readOnly={!this.state.editing} ref={this.rfqInfo} key={this.state.rfq_number} rfq_number={this.state.rfq_number} showQuote={true}/> */}
                        <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">RFQ ID 
                            {
                            (this.state.rfqInfo && this.state.rfqInfo.archived)?
                                <Badge className="ml-3" bg="warning" variant="warning">Archived</Badge>
                            :null
                            }
                        </label>
                        <Form.Control className="form-control-sm" type="text" value={this.state.rfqInfo.rfq_number} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Order Type</label>
                        <Form.Control className="form-control-sm" type="text" value={this.state.rfqInfo.orderType?this.state.rfqInfo.orderType.order_type:''} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label>Status</label>
                        <Form.Control className="form-control-sm" as="select" type="text" name="status" onChange={this.rfqInfoChanged} value={this.state.rfqInfo.status} disabled={this.state.readOnly} >
                            {
                                this.state.statuses.map((row)=>{
                                    return <option value={row.status_code}>{row.status_name}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        this.state.rfqInfo.quotationNumber && this.state.showQuote?
                        <Form.Group className="col-3">
                            <label htmlFor="multple">Quotation #</label>
                            <InputGroup>
                                {/* <Form.Control size="sm"  type="text" value={this.state.rfqInfo.quotationNumber} readOnly={true}/> */}
                                <a href={'/quotation/' + this.state.rfqInfo.quotationNumber}>{this.state.rfqInfo.quotationNumber}</a>
                            </InputGroup>
                        </Form.Group>
                        :''
                    }
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Company</label>
                        <Form.Control className="form-control-sm" type="text" value={this.state.rfqInfo.project?this.state.rfqInfo.project.organization_info.name:''}  readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">RFQ Date</label>
                        <Form.Control className="form-control-sm" type="datetime-local" name="request_date" onChange={this.rfqInfoChanged} value={moment(this.state.rfqInfo.request_date).format('YYYY-MM-DDTHH:mm:ss')} readOnly={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Requested By</label>
                        <Form.Control className="form-control-sm" type="text"  value={this.state.rfqInfo.requested_by} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">PM</label>
                        <Form.Control className="form-control-sm" type="text" name="pm"  value={this.state.rfqInfo.data?this.state.rfqInfo.data.pm:''} onChange={this.dataChanged} readOnly={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">PM</label>
                        <Form.Control className="form-control-sm" as="select" name="pm"  value={this.state.rfqInfo.data?this.state.rfqInfo.data.pm:''} onChange={this.dataChanged} disabled={this.state.readOnly}>
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
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-5">
                        <label htmlFor="multple">Assembly Number</label>
                        <Form.Control className="form-control-sm" type="text" value={this.state.rfqInfo.project?this.state.rfqInfo.project.itemnumber:''} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Revision</label>
                        <Form.Control className="form-control-sm" type="text" value={this.state.revision?this.state.revision.revision:''} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">ITAR</label>
                        <Form.Control  name="itar" as="select" size="sm" onChange={this.dataChanged} value={this.state.rfqInfo.data?this.state.rfqInfo.data.itar:'no'} disabled={this.state.readOnly} readOnly={this.state.readOnly}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                {
                            this.state.rfqInfo.data && Array.isArray(this.state.rfqInfo.data.quantity)?
                            
                            <Form.Row>
                                <Form.Group className="col-md-6">
                                    <Form.Label>
                                        Quantity
                                    </Form.Label>
                                    {
                                        this.state.rfqInfo.data.quantity.map((row,index)=>{
                                            return <InputGroup>
                                                <Form.Control name="quantity" type="number" min="1" value={row?row.quantity||'':''} className="mb-1" onChange={(e)=>{this.quantityChanged(e,index)}}  disabled={this.state.readOnly}/>
            
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
                                        this.state.rfqInfo.data.quantity.map((row,index)=>{
                                            return <InputGroup>
                                                <Form.Control name="quantity" type="number" min="1" value={row?row.leadTime||'':''} className="mb-1" onChange={(e)=>{this.leadTimeChanged(e,index)}}  disabled={this.state.readOnly}/>
                                                {
                                                    !this.state.readOnly && index === this.state.rfqInfo.data.quantity.length-1?
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
                                    <Form.Control name="quantity" type="number" min="1" value={this.state.rfqInfo.data?this.state.rfqInfo.data.quantity||'':''} onChange={this.controlChanged}  disabled={this.state.readOnly}/>
                                </Form.Group>
                                <Form.Group className="col-md-6">
                                    <Form.Label>
                                        Lead Time
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control name="quantity" type="number" min="1" value={this.state.rfqInfo.data?this.state.rfqInfo.data.quantity||'':''} onChange={this.controlChanged}  disabled={this.state.readOnly}/>
                                            {
                                                !this.state.readOnly?
                                                <Button variant="outline-secondary" id="button-addon2" onClick={this.addQuanitity}>
                                                    <i className="fa-solid fa-plus"></i>
                                                </Button>
                                                :null
                                            }
                                    </InputGroup>
                                </Form.Group>
                            </Form.Row>
                        }
                    {/* <Form.Group className="col-3">
                        <label htmlFor="multple">Quantity</label>
                        {
                            this.state.rfqInfo.data && Array.isArray(this.state.rfqInfo.data.quantity)?
                            this.state.rfqInfo.data.quantity.map((row,index)=>{
                                return <InputGroup>
                                    <Form.Control name="quantity" type="number" className="mb-1" min="1" value={row||''} onChange={(e)=>{this.quantityChanged(e,index)}} readOnly={this.state.readOnly}/>
                                    {
                                        index === this.state.rfqInfo.data.quantity.length-1 && !this.state.readOnly?
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
                                <Form.Control name="quantity" type="number" min="1" value={this.state.rfqInfo.data && this.state.rfqInfo.data.quantity||''} onChange={this.dataChanged} readOnly={this.state.readOnly}/>
                                {
                                    !this.state.readOnly?
                                    
                                    <Button variant="outline-secondary" id="button-addon2" onClick={this.addQuanitity}>
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                                    :null
                                }
                            </InputGroup>
                        }
                        {/* <Form.Control className="form-control-sm" type="number" name="quantity" onChange={this.dataChanged} value={this.state.rfqInfo.data?this.state.rfqInfo.data.quantity:''} readOnly={this.state.readOnly}/> */}
                    {/* </Form.Group> */}
                </Form.Row>
                <DeliverableForm ref={this.formData} readOnly={this.state.readOnly} formDesign={this.state.formDesign?this.state.formDesign.formData:{}} formData={this.state.form?this.state.form.formData:{}} onModified={()=>{if(this.props.onModified){this.props.onModified()}}}/>

                <Form.Row>
                
                    <Form.Group className="col-12">
                        <label htmlFor="multple">Comments</label>
                        <Form.Control className="form-control-sm" type="text" as="textarea" rows="5" name="comments" onChange={this.dataChanged}  value={this.state.rfqInfo.data?this.state.rfqInfo.data.comments:''} readOnly={this.state.readOnly}/>
                    </Form.Group>
                </Form.Row>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Header>
                                Requirements
                            </Card.Header>
                            <Card.Body>
                                <h4>{this.state.rfqInfo && this.state.rfqInfo.productType?this.state.rfqInfo.productType.product_name:null}</h4>
                                {
                                    this.state.rfqInfo?
                                    this.state.rfqInfo.productType?
                                    this.state.rfqInfo.productType.requirements.map((x,index)=>{
                                        return <ProjectDeliverable 
                                            key={index}
                                            project={this.state.project}
                                            revision={this.state.revision} 
                                            requirement={x.requirement} 
                                            deliverable={
                                                this.state.revision.deliverables?
                                                this.state.revision.deliverables.find((element)=>{
                                                    return element.requirement === x.requirement_id
                                                })
                                                :{}
                                            }
                                            onSaved={this.deliverableSaved}
                                            />
                                    })
                                    :''
                                    :''
                                }
                            </Card.Body>
                            <Card.Body>
                                <h4>{this.state.rfqInfo && this.state.rfqInfo.orderType?this.state.rfqInfo.orderType.order_type:null}</h4>
                                {
                                    this.state.rfqInfo?
                                    this.state.rfqInfo.orderType?
                                    this.state.rfqInfo.orderType.requirements.map((x,index)=>{
                                        return <QuotationDeliverable 
                                            key={index}
                                            rfq_number={this.state.rfqInfo.rfq_number}
                                            requirement={x.requirement} 
                                            deliverable={
                                                this.state.rfqInfo.deliverables?
                                                this.state.rfqInfo.deliverables.find((element)=>{
                                                    return element.requirement === x.requirement_id
                                                })
                                                :{}
                                            }
                                            onSaved={this.deliverableSaved}
                                            />
                                    })
                                    :''
                                    :''
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
            </div>
        );
    }
    

}

export default  RFQInfo;