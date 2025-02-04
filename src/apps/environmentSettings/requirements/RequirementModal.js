import React from 'react';

import {Card, Col, Button, Row, Form, Modal} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';
import FormDesigner from '../../tools/formDesigner/FormDesigner';
import FileRequirements from './FileRequirements';
import BomRequirements from './BomRequirements';

// var blankRequirement = {
//     _id:null,
//     requirement_name:null,
//     display_name:null,
//     type:null,
//     description:null,
// }

// blankRequirement = {
//     product_id:null,
//     requirement_name:'TK',
//     display_name:'Turnkey',
//     description:'Description',
//     workflow:[],
//     requirements:[{
//         _id:null,
//         name:'BOM',
//         type:'bom',
//         description:'BOM for build'
//     }],
// }

class RequirementModal extends React.Component { 
    constructor(props){
        super(props);

        this.state={
            expand:false,
            editing:false,
            requirementId:props.requirementId,
            editable:props.editable,
            requirement:props.requirement || {},
            requirementTypes:[],

            onRemove:props.onRemove
        }
        this.baseRequirement = Object.assign({},this.state.requirement);

    }

    componentDidMount(){
        this.updateRequirementTypes();
        this.updateRequirement();
    }

    componentDidUpdate(props){
        if(props.requirementId !== this.props.requirementId){
            this.setState({
                requirementId:this.props.requirementId
            },()=>{
                this.updateRequirement();
            })
        }
    }

    closeModal = ()=>{
        this.setState({
            show:false,
        })
    }
    showModal = (requirementId)=>{
        this.setState({
            requirementId:requirementId,
            show:true
        },()=>{
            this.updateRequirement();
        })
        
    }

    updateRequirementTypes = async()=>{
        try{
            let requirementTypes = await SDK.Requirements.getRequirementTypes();
            this.setState({
                requirementTypes:requirementTypes
            })
        }catch(err){
            alert(err);
        }
    }
    updateRequirement = async()=>{
        try{
            if(this.state.requirementId){
                let requirement = await SDK.Requirements.getRequirement(this.state.requirementId);
                this.setState({
                    requirement:requirement
                })

            }else{
                this.setState({
                    requirement:{}
                })
            }
        }catch(err){
            alert(err);
            this.setState({
                requirement:{}
            })
        }
    }

    // componentDidUpdate(){
    //     if(this.props.requirement !== this.state.requirement || this.props.editable !== this.state.editable){
    //         this.setState({
    //             requirement:this.props.requirement
    //         })
    //         //this.baseRequirement = this.props.requirement
    //     }
    // }


    requirementTypeForm = (type)=>{
        switch(type){
            case 'bom':
                return <BomRequirements bomData={this.state.requirement.bomData} onBomDataChanged={this.bomDataChanged}/>
                break;
            case 'file':
                return <FileRequirements fileData={this.state.requirement.fileData} onFileDataChanged={this.fileDataChanged}/>
                break;
            case 'form':
                return <FormDesigner formData={this.state.requirement.formData} onFormDataChanged={this.formDataChanged}/>
                break;
            default:
                return <div></div>
        }
    }

    bomDataChanged = (bomData)=>{
        var requirement = this.state.requirement;
        requirement.bomData = bomData;
        this.setState({
            requirement:requirement
        },()=>{
            console.log(JSON.stringify(this.state));
        });
    }
    fileDataChanged = (fileData)=>{
        var requirement = this.state.requirement;
        requirement.fileData = fileData;
        this.setState({
            requirement:requirement
        },()=>{
            console.log(JSON.stringify(this.state));
        });
    }
    formDataChanged = (formData)=>{
        var requirement = this.state.requirement;
        requirement.formData = formData;
        this.setState({
            requirement:requirement
        },()=>{
        });
    }
    render() {
        return (
            <Modal 
                show={this.state.show} 
                onHide={this.closeModal} 

                dialogClassName="fullscreen"
                >
                <Modal.Header closeButton>
                    <Modal.Title>Requirement Info</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form.Row>
                        <Form.Group as={Col} md={2}>
                            <Form.Label>Requirement Type</Form.Label>
                            {
                                this.state.requirementTypes && this.state.requirementTypes.length > 0 && this.state.requirement._id == null?
                                <Form.Control as="select" onChange={this.controlChanged} name="type" readOnly={this.state.requirement._id != null}>
                                    <option value=""></option>
                                    {
                                        this.state.requirementTypes.map(x=>{
                                            return <option  name="type" value={x.requirement_type} selected={this.state.requirement.type === x.requirement_type}>{x.requirement_type}</option>
                                        })
                                    }
                                </Form.Control>
                                :
                                <Form.Control name="type" placeholder="Requirement Type" value={this.state.requirement.type} onChange={this.controlChanged} readOnly={this.state.requirement._id != null}></Form.Control>
                            }
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Label>Requirement Name</Form.Label>
                            <Form.Control name="requirement_name" placeholder="Requirement Name" value={this.state.requirement.requirement_name} onChange={this.controlChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <Form.Label>Display Name</Form.Label>
                            <Form.Control name="display_name" placeholder="Display Name" value={this.state.requirement.display_name} onChange={this.controlChanged}></Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control name="description" placeholder="Description" value={this.state.requirement.description} onChange={this.controlChanged}></Form.Control>
                        </Form.Group>

                    </Form.Row>
                </Modal.Body>
                <Modal.Body style={{maxHeight:'60vh',overflow:'auto'}}>
                    {this.requirementTypeForm(this.state.requirement.type)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" size="sm"  onClick={this.saveRequirement}>Save</Button>
                    <Button variant="secondary" size="sm"  onClick={this.cancelChanges}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
        
    }
    cancelChanges=()=>{
        this.setState({
            show:false,
            requirement:{},
            requirementId:null
        })
    
    }
    saveRequirement = async ()=>{
        try{
            let requirement = this.state.requirement;
            requirement.editing = false;
            let data = await SDK.Requirements.saveRequirement(requirement);
            requirement._id = data._id;
            this.setState({
                requirement:requirement,
                show:false,
                requirement:{},
                requirementId:null
            },()=>{
                if(this.props.onRequirementSaved){
                    this.props.onRequirementSaved(requirement);
                }
            })
        }catch(err){
            console.error(err);
            alert(err);
        }
        
    }
    editRequirement = ()=>{
        var requirement = this.state.requirement;
        this.baseRequirement = Object.assign({},requirement);
        requirement.editing = true;

        this.setState({
            expand:true,
            requirement:requirement
        })
    }
    removeRequirement = ()=>{
        if(this.state.onRemove){
            this.state.onRemove(this.state.index, this.state.requirement);
        }
    }
    controlChanged=(e)=>{
        var requirement = this.state.requirement;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        requirement[e.currentTarget.name] = value;

        this.setState({
            requirement:requirement
        }, ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.requirement);
            }

        })
        
        

    }
}

export default RequirementModal;