import React from 'react';

import {Col, Form, Button, Modal} from 'react-bootstrap';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../sdk/SDK';

class LookupAdmin extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            lookups:[],
            lookupTypes:[],
            newLookup:{},
            showNewLookup:false,
            showEditLookup:false,
            selectedRow:null
        }

        this.lookupTable = React.createRef();

        this.lookupColumns = [
            // {key:'name', name:'Name', resizable:false, formatter:({value,row})=>{
            //     return <a href={'/organization/'+value} title={value}>{value}</a>
            // }},
            // {key:'process_type', name:'Process Type', resizable:false},
            {key:'lookup_code', name:'Lookup Code', resizable:false},
            {key:'lookup_name', name:'Lookup Name', resizable:false},
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
        this.updateLookupTypes();
        this.updateLookups();
    }

    updateLookupTypes = async ()=>{
        try{
            let lookupTypes = await SDK.Lookups.getLookupTypes()
            this.setState({
                lookupTypes:lookupTypes
            })
            
        }catch(err){
            console.error(err);
        }
    }

    updateLookups = async ()=>{
        try{
            if(this.props.processType){
                let match = {
                    process_type:this.props.processType
                }

                let q = `process_type="` + this.props.processType + `"`
                if(!this.state.showInactive){
                    q+= `,inactive=false`
                }
                let lookups = await SDK.Lookups.findLookups({q:q})
                this.setState({
                    lookups:lookups
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
            this.updateLookups();
        })
    }

    showNewLookup = ()=>{
        this.setState({
            newLookup:{},
            showNewLookup:true
        })
    }

    handleClose = ()=>{
        this.setState({
            newLookup:{},
            showNewLookup:false
        })
    }

    trySaveLookup = async()=>{
        try{

            if(this.state.newLookup.lookup_code && this.state.newLookup.lookup_name){
                let newLookup= {
                    process_type:this.props.processType,
                    lookup_code:this.state.newLookup.lookup_code,
                    lookup_name:this.state.newLookup.lookup_name,
                    description:this.state.newLookup.description,
                }
                await SDK.Lookups.saveLookup(newLookup);
                this.updateLookups();
                this.handleClose();
            }else{
                alert("Please enter all info")
            }
        }catch(err){
            alert(err);
        }
    }
    newLookupChanged = (e)=>{
        let value = e.target.value;
        let name = e.target.name;
        let newLookup = this.state.newLookup;
        newLookup[name] = value;
        this.setState({
            newLookup:newLookup
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
                    await SDK.Lookups.inactivateLookup(this.state.selectedRow.process_type, this.state.selectedRow.lookup_code);
                    alert("Process type is locked and cannot be deleted.  It has been inactivated instead");
                }else{
                    await SDK.Lookups.deleteLookup(this.state.selectedRow.process_type, this.state.selectedRow.lookup_code);
                }
                
                this.updateLookups();
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    toggleEdit = ()=>{
        let rows = this.lookupTable.current.getSelectedRows();
        if(rows.length > 0){
            let selectedRow = JSON.parse(JSON.stringify(rows[0].row));
            this.setState({
                showEditLookup:true,
                selectedRow:selectedRow
            })
        }
        
    }

    handleEditClose = ()=>{
        this.setState({
            showEditLookup:false
        })
    }
    editLookupChanged = (e)=>{
        let value = e.target.value;
        let name = e.target.name;
        let selectedRow = this.state.selectedRow;
        selectedRow[name] = value;
        this.setState({
            selectedRow:selectedRow
        })
    }
    tryUpdateLookup = async()=>{
        try{

            if(this.state.selectedRow.lookup_code && this.state.selectedRow.lookup_name){
                let newLookup= {
                    process_type:this.props.processType,
                    lookup_code:this.state.selectedRow.lookup_code,
                    lookup_name:this.state.selectedRow.lookup_name,
                    description:this.state.selectedRow.description,
                }
                await SDK.Lookups.updateLookup(newLookup);
                this.updateLookups();
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
                    ref={this.lookupTable}
                    resizeable={false}
                    columns={this.lookupColumns}
                    rowGetter={i=> this.state.lookups?this.state.lookups[i]:{}}
                    rowsCount={this.state.lookups?this.state.lookups.length:0} 
                    sortable={true}
                    buttons={[
                        <Col xs="auto" style={{display:"inline-block"}}><Form.Check label="Show Inactive" checked={this.state.showInactive} onClick={this.toggleShowInactive}></Form.Check></Col>,
                        this.state.selectedRow && !this.state.selectedRow.inactive && !this.state.selectedRow.locked?<Button size="sm" variant="warning" onClick={()=>{this.toggleEdit()}} className="ml-1"><i class="fas fa-pen-to-square"></i> Edit</Button>:null,
                        this.state.selectedRow && !this.state.selectedRow.inactive && !this.state.selectedRow.locked?<Button size="sm" variant="danger" onClick={()=>{this.tryDelete()}} className="ml-1"><i class="fas fa-trash"></i> Delete</Button>:null,
                        this.state.selectedRow && !this.state.selectedRow.inactive && this.state.selectedRow.locked?<Button size="sm" variant="danger" onClick={()=>{this.tryDelete()}} className="ml-1"><i class="fas fa-lock"></i> Inactivate</Button>:null,
                        this.state.selectedRow && this.state.selectedRow.inactive?<Button size="sm" variant="success" onClick={()=>{this.tryRestore()}} className="ml-1"><i class="fas fa-unlock"></i> Restore</Button>:null
                    ]}
                    rightButtons={[
                        <Button className="close" onClick={()=>{this.showNewLookup()}}>+</Button>
                        // <Button size="sm" variant="danger" onClick={()=>{this.showNewLookup()}}><i class="fas fa-trash"></i></Button>
                    ]}
                    onRowClicked={this.onRowClicked}
                />
                <Modal show={this.state.showNewLookup} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Lookup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Lookup Code</Form.Label>
                            <Form.Control type="text" name="lookup_code" value={this.state.newLookup.lookup_code} onChange={this.newLookupChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Lookup Name</Form.Label>
                            <Form.Control type="text" name="lookup_name" value={this.state.newLookup.lookup_name} onChange={this.newLookupChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={this.state.newLookup.description} onChange={this.newLookupChanged}></Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button size="sm" variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button size="sm" variant="primary" onClick={this.trySaveLookup}>
                        Save Lookup
                    </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditLookup} onHide={this.handleEditClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Lookup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Lookup Code</Form.Label>
                            <Form.Control type="text" name="lookup_code" value={this.state.selectedRow?this.state.selectedRow.lookup_code:''} onChange={this.editLookupChanged} readOnly={true}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Lookup Name</Form.Label>
                            <Form.Control type="text" name="lookup_name" value={this.state.selectedRow?this.state.selectedRow.lookup_name:''} onChange={this.editLookupChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={this.state.selectedRow?this.state.selectedRow.description:''} onChange={this.editLookupChanged}></Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button size="sm" variant="secondary" onClick={this.handleEditClose}>
                        Close
                    </Button>
                    <Button size="sm" variant="primary" onClick={this.tryUpdateLookup}>
                        Update Lookup
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
    
}

export default LookupAdmin;