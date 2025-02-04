import React from 'react';

import {Container, Card, Button, Modal} from 'react-bootstrap';
import Requirement from './Requirement';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';
import ReactGrid from '../../tools/ReactGrid/ReactGrid';
import moment from 'moment';

import RequirementModal from './RequirementModal';

class Requirements extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            requirements:[],
            showDeleteDialog:false,
        }
        this.requirementModal = React.createRef();
        this.requirementTable = React.createRef();
    }

    componentDidMount(){
        this.updateRequirements();
    }
    editRequirement = (_id)=>{
        this.requirementModal.current.showModal(_id);
        // alert(_id);
    }

    updateRequirements = ()=>{
        SDK.Requirements.getRequirements()
        .then(data=>{
            this.setState({
                requirements:data
            })
        })
    }

    requirementChanged = (index, requirement)=>{
        var requirements = this.state.requirements;
        requirements[index] = requirement;
        this.setState({
            requirements:requirements
        })
    }
    newRequirement = ()=>{
        this.requirementModal.current.showModal();
        // var editing = false;
        // for(var x = 0; x < this.state.requirements.length; x++){
        //     if(this.state.requirements[x].editing){
        //         editing = true;
        //     }
        // }
        // if(editing){
        //     alert("Please save changes to current open requirement");
        // }else{
        //     var requirements = this.state.requirements;
        //     requirements.push({
        //         new:true,
        //         editing:true,
        //     })
        //     this.setState({
        //         requirements:requirements
        //     });
        // }
    }

    onCancel = (index, requirement) =>{
        var requirements = this.state.requirements;
        if(requirement._id){
            requirements[index] = requirement;
        }else{
            requirements.splice(index,1);
        }
        this.setState({
            requirements:requirements
        })
    }

    tryDelete = ()=>{
        this.setState({
            showDeleteDialog:true
        })
    }
    handleClose = ()=>{
        this.setState({
            showDeleteDialog:false
        })
    }
    deleteRequirement = async()=>{
        try{
            let rows = this.requirementTable.current.getSelectedRows();
            if(rows.length > 0){
                let row = rows[0].row;
                let data = await SDK.Requirements.deleteRequirement(row._id);
                this.updateRequirements();
                this.setState({
                    showDeleteDialog:false
                })
            }
        }catch(err){
            alert(err);
            this.setState({
                showDeleteDialog:false
            })
        }
    }
    render() {
        let columns = [
            {key:'requirement_name', name:'Requirement Name', formatter:({value,row})=>{
                return <Button variant="link" onClick={()=>{this.editRequirement(row._id)}}>{value}</Button>
            }},
            {key:'display_name', name:'Display Name'},
            {key:'description', name:'Description'},
            {key:'create_date', name:'Create Date', formatter:({value,row})=>{
                return moment(value).format('YYYY-MM-DD hh:mm a')
            }},
            {key:'created_by', name:'Created By'},
            {key:'last_modified', name:'Last Modified', formatter:({value,row})=>{
                return moment(value).format('YYYY-MM-DD hh:mm a')
            }},
            {key:'modified_by', name:'Modified By'},
        ]
        // columns = null;
        return (
            <Container fluid>
                <Card>
                    <Card.Header className="card-header-border">
                        Requirements
                        <div className="header-actions">
                            <a onClick={this.newRequirement}>
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ReactGrid
                            ref={this.requirementTable}
                            height={'70vh'}
                            columns={columns}
                            rowGetter={i=> this.state.requirements?this.state.requirements[i]:{}}
                            rowsCount={this.state.requirements?this.state.requirements.length:0} 
                        />
                    </Card.Body>
                    <Card.Footer>
                        <Button size="sm" onClick={this.tryDelete}>Delete</Button>
                    </Card.Footer>
                        {/* <Card.Body>
                        {
                            this.state.requirements.length > 0 ?
                                this.state.requirements.map((x, index)=>{
                                    return <Requirement key={x._id} index={index} requirement={x} onDataChanged={this.requirementChanged} editable={true} editing={x._id == null} onCancel={(req)=>{this.onCancel(index,req)}}/>
                                })
                            :
                            <p>No requirements created yet click the + to add</p>
                        }
                        </Card.Body> */}
                </Card>
                <RequirementModal ref={this.requirementModal} onRequirementSaved={()=>{this.updateRequirements();}}/>
                <Modal
                        show={this.state.showDeleteDialog}
                        backdrop={'static'}
                        onHide={this.handleClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Warning! Deleting requirement will also delete any instances created of this type.  Are you sure you wish to continue?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                            <Button variant="primary" onClick={this.deleteRequirement}>Confirm</Button>
                        </Modal.Footer>
                    </Modal>
            </Container>
        )
    }
}

export default Requirements;