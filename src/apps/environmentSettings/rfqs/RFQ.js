import React from 'react';
import SDK from '../../../sdk/SDK';
import {Card, Col, Button, Row, Form, Modal} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AddRequirement from '../requirements/AddRequirement';
import RFQRequirement from '../requirements/RFQRequirement';
import AddProcess from '../processes/AddProcess';
import RFQProcess from '../processes/RFQProcess';
import EditRFQ from './EditRFQ';

var blankRFQ = {
    rfq_id:null,
    rfq_name:null,
    description:null,
    processes:[],
    requirements:[],
}

class RFQ extends React.Component { 
    constructor(props){
        super(props);

        if(props.rfq.new){
            Object.assign(props.rfq, blankRFQ);
        }
        this.reqModal = React.createRef();
        this.processModal = React.createRef();
        this.editModal = React.createRef();

        this.state={
            index:props.index,
            expand:false,
            editing:props.editing?props.editing:false,
            showDeleteDialog:false,
            rfq:props.rfq,
            edit_rfq:props.rfq
        }
    }
    componentDidUpdate(props){
        if(props.rfq !== this.props.rfq){
            this.setState({
                rfq:this.props.rfq
            })
        }
    }
    rfqSaved = (data)=>{
        this.setState({
            rfq:data
        },()=>{
            if(this.props.onSave){
                this.props.onSave(data);
            }
        })
    }

    tryDeleteRFQ = ()=>{
        this.setState({
            showDeleteDialog:true
        })
    }
    handleClose = ()=>{
        this.setState({
            showDeleteDialog:false
        })
    }

    deleteRFQ = async()=>{
        try{
            let data = await SDK.RFQTypes.deleteRFQType(this.state.rfq._id);
            this.setState({
                showDeleteDialog:false
            },()=>{
                if(this.props.onDelete){
                    this.props.onDelete();
                }
            })
        }catch(err){
            this.setState({
                showDeleteDialog:false
            })
            alert(err);
        }
    }

    render() {
        return (
            <div>
                <Card className="mb-2">
                    <Card.Header className="card-header-border">
                            {this.state.editing?
                                <Form.Control name="order_name" placeholder="Order Name" value={this.state.rfq.order_name} onChange={this.controlChanged}></Form.Control>
                                :<h4>{this.state.rfq.order_type}</h4>
                            }
                            {!this.state.editing?
                                <div className="header-actions">
                                    <a onClick={this.tryDeleteRFQ}>
                                        <i class="fas fa-times"/>
                                    {/* <FontAwesomeIcon icon="times"/> */}
                                    </a>
                                </div>
                                :''
                            }
                    </Card.Header>
                        <Card.Body>
                            {this.state.editing?
                                <Form.Control as="textarea" rows="4" name="description" placeholder="Description" value={this.state.rfq.description} onChange={this.controlChanged}></Form.Control>
                                :
                                <pre>{this.state.rfq.description}</pre>
                            }
                            <Row>
                                {/* <Col md={6}>
                                    <Card>
                                        <Card.Header>
                                            Process
                                            {this.state.editing?
                                            <div className="header-actions">
                                                <a onClick={this.newProcess}>
                                                    <FontAwesomeIcon icon="plus" title={"Add Process"}/>
                                                </a>
                                            </div>:''
                                            }
                                        </Card.Header>
                                        <Card.Body key={this.state.editing?this.state.editing:false} style={{maxHeight:"50vh", overflow:"auto"}}>
                                            {
                                                this.state.rfq.processes.map((x,index)=>{
                                                    if(x.process != null){
                                                        return <RFQProcess key={x.process_id+index.toString()} index={index} editable={this.state.editing} rfqProcess={x} onRemove={this.removeProcess} onDataChanged={this.rfqProcessChanged}/>
                                                    }else{
                                                        return '';
                                                    }
                                                    
                                                })
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col> */}
                                <Col md={12}>
                                    <Card>
                                        <Card.Header>
                                        Requirements
                                        {
                                            this.state.editing?
                                            <div className="header-actions">
                                                <a onClick={this.newRequirement}>
                                                    <i class="fas fa-plus" title={"Add Requirement"}/>
                                                    {/* <FontAwesomeIcon icon="plus" title={"Add Requirement"}/> */}
                                                </a>
                                            </div>
                                            :''
                                        }
                                        
                                        </Card.Header>
                                        <Card.Body key={this.state.editing?this.state.editing:false} style={{maxHeight:"50vh", overflow:"auto"}}>
                                            {
                                                this.state.rfq.requirements.map((x,index)=>{
                                                    if(x.requirement != null){
                                                        return <RFQRequirement key={x} index={index} editable={this.state.editing} rfqRequirement={x} onRemove={this.removeRequirement} onDataChanged={this.rfqRequirementChanged}/>
                                                    }else{
                                                        return '';
                                                    }
                                                    
                                                })
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                        </Card.Body>
                    <Card.Footer>
                        {
                            this.state.editing?
                                <Button variant="primary" size="sm"  onClick={this.saveRFQ}>Save</Button>
                            :
                            <Button variant="primary" size="sm"  onClick={this.editRFQ}>Edit</Button>
                        }
                    </Card.Footer>
                    <AddRequirement ref={this.reqModal}show={false} onSelected={this.addRequirement}/>
                    <AddProcess ref={this.processModal}show={false} onSelected={this.addProcess}/>
                    <EditRFQ ref={this.editModal} onSave={this.rfqSaved}/>
                </Card>
                    <Modal
                        show={this.state.showDeleteDialog}
                        backdrop={'static'}
                        onHide={this.handleClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Warning! Deleting rfq will also delete any projects create of this type.  Are you sure you wish to continue?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                            <Button variant="primary" onClick={this.deleteRFQ}>Confirm</Button>
                        </Modal.Footer>
                    </Modal>
            </div>
            
        )
    }

    rfqRequirementChanged = (index, rfqRequirement)=>{
        var rfq = this.state.rfq;
        rfq.requirements[index] = rfqRequirement;
        this.setState({
            rfq:rfq
        }, ()=>{
            console.log(this.state.rfq)
        })
        
    }
    newRequirement = () =>{
        this.reqModal.current.showModal();
    }
    addRequirement=(requirement)=>{
        var rfq = this.state.rfq;
        rfq.requirements.push({
            requirement_id:requirement._id,
            required:false,
            requirement:requirement,
        });
        this.setState({
            rfq:rfq
        })

        
    }
    removeRequirement=(index, requirement)=>{
        var rfq = this.state.rfq;

        rfq.requirements.splice(index,1);
        this.setState({
            rfq: rfq
        })
    }

    
    rfqProcessChanged=(index, rfqProcess)=>{
        var rfq = this.state.rfq;
        rfq.processes[index] = rfqProcess;
        this.setState({
            rfq:rfq
        })
    }
    newProcess=()=>{
        this.processModal.current.showModal();
    }
    addProcess=(process)=>{
        var rfq = this.state.rfq;
        rfq.processes.push({
            process_id:process._id,
            required:false,
            process:process,
        });
        this.setState({
            rfq:rfq
        })

        
    }
    removeProcess=(index, process)=>{
        var rfq = this.state.rfq;

        rfq.processes.splice(index,1);
        this.setState({
            rfq: rfq
        })
    }



    saveRFQ=()=>{

        console.log(this.state.rfq);
        SDK.RFQTypes.saveRFQType(this.state.rfq)
        .then(data=>{
            var rfq = this.state.rfq;
            rfq._id = data._id;
            this.setState({
                editing:false,
                rfq:rfq
            })
        })
        .catch(err=>{
            console.log(err);
            alert(err);
        })

        
    }
    editRFQ=()=>{
        // alert(JSON.stringify(this.state.rfq));
        this.editModal.current.showModal(this.state.rfq._id);
        // var rfq = this.state.rfq;
        // this.setState({
        //     expand:true,
        //     editing:true,
        //     rfq:rfq
        // })
    }
    controlChanged=(e)=>{
        var rfq = this.state.rfq;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        rfq[e.currentTarget.name] = value;
        this.setState({
            rfq:rfq
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.rfq);
        }
        

    }
}

export default RFQ;