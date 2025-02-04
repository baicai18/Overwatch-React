import React from 'react';

import {FormGroup, Card, Col, Button, Row, Form} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Requirement from './Requirement';

class RFQRequirement extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            index:props.index,
            editable:props.editable,
            rfqRequirement:props.rfqRequirement,
            requirement:props.rfqRequirement.requirement,
        }
        this.saveRFQ = this.saveRFQ.bind(this);
        this.editRequirement = this.editRequirement.bind(this);
        this.controlChanged = this.controlChanged.bind(this);
        this.removeRequirement = this.removeRequirement.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidUpdate(props){
        if(props.rfqRequirement !== this.props.rfqRequirement || props.requirement !== this.props.requirement){
            this.setState({
                rfqRequirement:this.props.rfqRequirement,
                requirement:this.props.rfqRequirement.requirement
                // requirement:this.props.requirement
            })
        }
    }
    render() {
        return (
            <Card className={this.state.requirement.editing?"fullscreen":""}>
                {
                    this.state.requirement.editing?
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Requirment Name</Form.Label>
                                <Form.Control name="requirement_name" placeholder="Requirement Name" value={this.state.requirement.requirement_name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control name="display_name" placeholder="Display Name" value={this.state.requirement.display_name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="description" placeholder="Description" value={this.state.requirement.description} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                        </Card.Body>

                    :
                        <Card.Header>
                            <Row>
                                <Col md={6}>
                                    <Requirement requirement={this.state.requirement} editable={this.state.editable}/>
                                </Col>
                                {/* <Col md={3}>
                                    <FormGroup>
                                        <Form.Label>Required For RFQ</Form.Label>
                                        <Form.Check type="checkbox" value="true" name="requiredForRFQ" checked={this.state.rfqRequirement.requiredForRFQ} onChange={this.state.editable?this.onChange:()=>{}} disabled={!this.props.editable}></Form.Check>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Form.Label>Required For Job</Form.Label>
                                        <Form.Check type="checkbox" value="true" name="requiredForJob" checked={this.state.rfqRequirement.requiredForJob} onChange={this.state.editable?this.onChange:()=>{}} disabled={!this.props.editable}></Form.Check>
                                    </FormGroup>
                                </Col> */}
                            </Row>
                            {
                                this.state.editable?
                                    <div className="header-actions">
                                        <a onClick={this.removeRequirement}>
                                            <i class="fas fa-times"/>
                                            {/* <FontAwesomeIcon icon="times"/> */}
                                        </a>
                                    </div>
                                :''

                            }
                        </Card.Header>
                    
                }
                {
                    this.state.requirement.editing?
                    <Card.Footer>
                        <Button variant="primary" size="sm"  onClick={this.saveRFQ}>Save</Button>
                    </Card.Footer>
                    :""
                }
            </Card>
        )
        
    }
    onChange(e){
        var rfqRequirement = this.state.rfqRequirement;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        rfqRequirement[e.currentTarget.name] = value;
        
        this.setState({
            rfqRequirement:rfqRequirement
        })
        this.props.onDataChanged(this.state.index, this.state.rfqRequirement);
    }



    saveRFQ(){
        var requirement = this.state.requirement;
        requirement.editing = false;
        this.setState({
            requirement:requirement
        })
    }
    editRequirement(){
        var requirement = this.state.requirement;
        requirement.editing = true;
        this.setState({
            requirement:requirement
        })
    }
    removeRequirement(){
        if(this.props.onRemove){
            this.props.onRemove(this.state.index, this.state.requirement);
        }
    }
    controlChanged(e){
        var requirement = this.state.requirement;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        requirement[e.currentTarget.name] = value;
        this.setState({
            requirement:requirement
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.requirement);
        }
        

    }
}

export default RFQRequirement;