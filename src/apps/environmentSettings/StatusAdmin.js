import React from 'react';

import {Col, Form, Button, Modal} from 'react-bootstrap';
import ReactGrid from './../tools/ReactGrid/ReactGrid';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../sdk/SDK';

class StatusAdmin extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            statuses:[],
            statusTypes:[],
            newStatus:{},
            showNewStatus:false,
            showEditStatus:false,
            selectedRow:null
        }

        this.statusTable = React.createRef();

        this.statusColumns = [
            // {key:'name', name:'Name', resizable:false, formatter:({value,row})=>{
            //     return <a href={'/organization/'+value} title={value}>{value}</a>
            // }},
            // {key:'process_type', name:'Process Type', resizable:false},
            {key:'status_code', name:'Status Code', resizable:false},
            {key:'status_name', name:'Status Name', resizable:false},
            {key:'status_type', name:'Status Type', resizable:false},
            {key:'description', name:'Description', resizable:false},
            {key:'inactive', name:'Inactive', resizable:false},
            {key:'locked', name:'Locked', resizable:false},
            {key:'create_date', name:'Creation Date', resizable:false},
            {key:'created_by', name:'Creation User', resizable:false},
            {key:'last_modified', name:'Last Modified', resizable:false},
            {key:'modified_by', name:'Modified By', resizable:false},
            // {key:'inactive_date', name:'Inactive Date', resizable:false},
        ]

    }

    componentDidMount(){
        this.updateStatusTypes();
        this.updateStatuses();
    }

    updateStatusTypes = async ()=>{
        try{
            let statusTypes = await SDK.Statuses.getStatusTypes()
            this.setState({
                statusTypes:statusTypes
            })
            
        }catch(err){
            console.error(err);
        }
    }

    updateStatuses = async ()=>{
        try{
            if(this.props.processType){
                let match = {
                    process_type:this.props.processType
                }

                let q = `process_type="` + this.props.processType + `"`
                if(!this.state.showInactive){
                    q+= `,inactive=false`
                }
                let statuses = await SDK.Statuses.findStatuses({q:q})
                this.setState({
                    statuses:statuses
                })
            }else{
                console.error("Process Type not defined");
            }
            
        }catch(err){
            console.error(err);
        }
    }

    toggleShowInactive = ()=>{
        this.setState({
            showInactive:!this.state.showInactive
        },()=>{
            this.updateStatuses();
        })
    }

    showNewStatus = ()=>{
        this.setState({
            newStatus:{},
            showNewStatus:true
        })
    }

    handleClose = ()=>{
        this.setState({
            newStatus:{},
            showNewStatus:false
        })
    }

    trySaveStatus = async()=>{
        try{

            if(this.state.newStatus.status_code && this.state.newStatus.status_name && this.state.newStatus.status_type){
                let newStatus= {
                    process_type:this.props.processType,
                    status_code:this.state.newStatus.status_code,
                    status_name:this.state.newStatus.status_name,
                    status_type:this.state.newStatus.status_type,
                    description:this.state.newStatus.description,
                }
                await SDK.Statuses.saveStatus(newStatus);
                this.updateStatuses();
                this.handleClose();
            }else{

            }
        }catch(err){
            alert(err);
        }
    }
    newStatusChanged = (e)=>{
        let value = e.target.value;
        let name = e.target.name;
        let newStatus = this.state.newStatus;
        newStatus[name] = value;
        this.setState({
            newStatus:newStatus
        })
    }
    onRowClicked = (index,row)=>{
        this.setState({
            selectedRow:JSON.parse(JSON.stringify(row))
        })
    }

    tryDelete = async ()=>{
        try{
            if(this.state.selectedRow && !this.state.selectedRow.inactive){
                if(this.state.selectedRow.locked){
                    await SDK.Statuses.inactivateStatus(this.state.selectedRow.process_type, this.state.selectedRow.status_code);
                    alert("Process type is locked and cannot be deleted.  It has been inactivated instead");
                }else{
                    await SDK.Statuses.deleteStatus(this.state.selectedRow.process_type, this.state.selectedRow.status_code);
                }
                
                this.updateStatuses();
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    toggleEdit = ()=>{
        let rows = this.statusTable.current.getSelectedRows();
        if(rows.length > 0){
            let selectedRow = JSON.parse(JSON.stringify(rows[0].row));
            this.setState({
                showEditStatus:true,
                selectedRow:selectedRow
            })
        }
        
    }

    handleEditClose = ()=>{
        this.setState({
            showEditStatus:false
        })
    }
    editStatusChanged = (e)=>{
        let value = e.target.value;
        let name = e.target.name;
        let selectedRow = this.state.selectedRow;
        selectedRow[name] = value;
        this.setState({
            selectedRow:selectedRow
        })
    }
    tryUpdateStatus = async()=>{
        try{

            if(this.state.selectedRow.status_code && this.state.selectedRow.status_name && this.state.selectedRow.status_type){
                let newStatus= {
                    process_type:this.props.processType,
                    status_code:this.state.selectedRow.status_code,
                    status_name:this.state.selectedRow.status_name,
                    status_type:this.state.selectedRow.status_type,
                    description:this.state.selectedRow.description,
                }
                await SDK.Statuses.updateStatus(newStatus);
                this.updateStatuses();
                this.handleEditClose();
            }else{

            }
        }catch(err){
            alert(err);
        }
    }

    render() {
        return (
            <div>
                
                <ReactGrid
                    ref={this.statusTable}
                    resizeable={false}
                    columns={this.statusColumns}
                    rowGetter={i=> this.state.statuses?this.state.statuses[i]:{}}
                    rowsCount={this.state.statuses?this.state.statuses.length:0} 
                    sortable={true}
                    buttons={[
                        <Col xs="auto" style={{display:"inline-block"}}><Form.Check label="Show Inactive" checked={this.state.showInactive} onClick={this.toggleShowInactive}></Form.Check></Col>,
                        this.state.selectedRow && !this.state.selectedRow.inactive && !this.state.selectedRow.locked?<Button size="sm" variant="warning" onClick={()=>{this.toggleEdit()}} className="ml-1"><i class="fas fa-pen-to-square"></i> Edit</Button>:null,
                        this.state.selectedRow && !this.state.selectedRow.inactive && !this.state.selectedRow.locked?<Button size="sm" variant="danger" onClick={()=>{this.tryDelete()}} className="ml-1"><i class="fas fa-trash"></i> Delete</Button>:null,
                        this.state.selectedRow && !this.state.selectedRow.inactive && this.state.selectedRow.locked?<Button size="sm" variant="danger" onClick={()=>{this.tryDelete()}} className="ml-1"><i class="fas fa-lock"></i> Inactivate</Button>:null,
                        this.state.selectedRow && this.state.selectedRow.inactive?<Button size="sm" variant="success" onClick={()=>{this.tryRestore()}} className="ml-1"><i class="fas fa-unlock"></i> Restore</Button>:null
                    ]}
                    rightButtons={[
                        <Button className="close" onClick={()=>{this.showNewStatus()}}>+</Button>
                        // <Button size="sm" variant="danger" onClick={()=>{this.showNewStatus()}}><i class="fas fa-trash"></i></Button>
                    ]}
                    onRowClicked={this.onRowClicked}
                />
                <Modal show={this.state.showNewStatus} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Status Code</Form.Label>
                            <Form.Control type="text" name="status_code" value={this.state.newStatus.status_code} onChange={this.newStatusChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status Name</Form.Label>
                            <Form.Control type="text" name="status_name" value={this.state.newStatus.status_name} onChange={this.newStatusChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status Type</Form.Label>
                            <Form.Control as={"select"} name="status_type" value={this.state.newStatus.status_type} onChange={this.newStatusChanged}>
                                <option></option>
                                {
                                    this.state.statusTypes.map((row)=>{
                                        return <option value={row}>{row}</option>
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={this.state.newStatus.description} onChange={this.newStatusChanged}></Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button size="sm" variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button size="sm" variant="primary" onClick={this.trySaveStatus}>
                        Save Status
                    </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditStatus} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Status Code</Form.Label>
                            <Form.Control type="text" name="status_code" value={this.state.selectedRow?this.state.selectedRow.status_code:''} onChange={this.editStatusChanged} readOnly={true}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status Name</Form.Label>
                            <Form.Control type="text" name="status_name" value={this.state.selectedRow?this.state.selectedRow.status_name:''} onChange={this.editStatusChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status Type</Form.Label>
                            <Form.Control as={"select"} name="status_type" value={this.state.selectedRow?this.state.selectedRow.status_type:''} onChange={this.editStatusChanged} readOnly={true}>
                                <option></option>
                                {
                                    this.state.statusTypes.map((row)=>{
                                        return <option value={row}>{row}</option>
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={this.state.selectedRow?this.state.selectedRow.description:''} onChange={this.editStatusChanged}></Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button size="sm" variant="secondary" onClick={this.handleEditClose}>
                        Close
                    </Button>
                    <Button size="sm" variant="primary" onClick={this.tryUpdateStatus}>
                        Update Status
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
    
}

export default StatusAdmin;