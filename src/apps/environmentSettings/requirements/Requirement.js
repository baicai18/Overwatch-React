import React from 'react';

import {Card, Col, Button, Row, Form} from 'react-bootstrap';
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

class Requirement extends React.Component { 
    constructor(props){
        super(props);

        this.state={
            expand:false,
            editing:false,
            editable:props.editable,
            requirement:props.requirement,
            requirementTypes:[],

            onRemove:props.onRemove
        }
        this.baseRequirement = Object.assign({},this.state.requirement);

    }

    componentDidMount(){
        SDK.Requirements.getRequirementTypes()
        .then(data=>{
            this.setState({
                requirementTypes:data
            })
        })
        .catch(err=>{
            console.error(err);
        })
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
                return <div>Hmm</div>
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
            <Card key={this.state.requirement} className={this.state.requirement.editing?"fullscreen":""}>
                {
                    this.state.requirement.editing?
                        <Card.Body style={{height:"100%",overflow:"auto"}}>
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
                            <hr/>
                            {this.requirementTypeForm(this.state.requirement.type)}
                        </Card.Body>

                    :
                        <Card.Header>
                            <Row>
                                <Col md={9}>
                                    <Card.Title><h4>{this.state.requirement.display_name}</h4></Card.Title>
                                    <Card.Subtitle>{this.state.requirement.description}</Card.Subtitle>
                                </Col>
                                <Col md={3}>
                                    <Card.Text>{this.state.requirement.type}</Card.Text>
                                </Col>
                            </Row>
                            {
                                this.state.editable?
                                <div className="header-actions">
                                    <a onClick={this.editRequirement}>
                                        <i class="fas fa-edit"/>
                                        {/* <FontAwesomeIcon icon="edit"/> */}
                                    </a>
                                </div>
                                :''
                            }
                        </Card.Header>
                    
                }
                {
                    this.state.requirement.editing?
                    <Card.Footer>
                        <Button variant="primary" size="sm"  onClick={this.saveRequirement}>Save</Button>
                        <Button variant="secondary" size="sm"  onClick={this.cancelChanges}>Cancel</Button>
                    </Card.Footer>
                    :""
                }
            </Card>
        )
        
    }
    cancelChanges=()=>{
        var req = Object.assign({},this.baseRequirement);
        req.editing = false;
        req.expand = false;
        this.setState({
            editing:false,
            expand:false,
            requirement: req
        },()=>{
            if(this.props.onCancel){
                this.props.onCancel(this.state.requirement);
            }
        })
    
    }
    saveRequirement = ()=>{
        var requirement = this.state.requirement;
        requirement.editing = false;
        SDK.Requirements.saveRequirement(requirement)
        .then(data=>{
            requirement._id = data._id;

            this.setState({
                requirement:requirement
            })
        })
        
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

export default Requirement;