import React from 'react';

import {FormGroup, Card,  Col, Button, Row, Form} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Process from './Process';

class RFQProcess extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            index:props.index,
            editable:props.editable,
            rfqProcess:props.rfqProcess,
            process:props.rfqProcess.process,
        }
        this.saveRFQ = this.saveRFQ.bind(this);
        this.editProcess = this.editProcess.bind(this);
        this.controlChanged = this.controlChanged.bind(this);
        this.removeProcess = this.removeProcess.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    render() {
        return (
            <Card className={this.state.process.editing?"fullscreen":""}>
                {
                    this.state.process.editing?
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Requirment Name</Form.Label>
                                <Form.Control name="process_name" placeholder="Requirement Name" value={this.state.process.process_name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control name="display_name" placeholder="Display Name" value={this.state.process.display_name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="description" placeholder="Description" value={this.state.process.description} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                        </Card.Body>

                    :
                        <Card.Header>
                            <Row>
                                <Col md={9}>
                                    <Process process={this.state.process} editable={this.state.editable}/>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Form.Label>Required</Form.Label>
                                        <Form.Check type="checkbox" value="true" name="required" checked={this.state.rfqProcess.required} onChange={this.state.editable?this.onChange:()=>{}} readOnly={!this.state.editable}></Form.Check>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {
                                this.state.editable?
                                    <div className="header-actions">
                                        <a onClick={this.removeProcess}>
                                            <i class="fas fa-times"/>
                                            {/* <FontAwesomeIcon icon="times"/> */}
                                        </a>
                                    </div>
                                :''

                            }
                        </Card.Header>
                    
                }
                {
                    this.state.process.editing?
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
        var process = this.state.process;
        process.editing = false;
        this.setState({
            process:process
        })
    }
    editProcess(){
        var process = this.state.process;
        process.editing = true;
        this.setState({
            process:process
        })
    }
    removeProcess(){
        if(this.props.onRemove){
            this.props.onRemove(this.state.index, this.state.process);
        }
    }
    controlChanged(e){
        var process = this.state.process;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        process[e.currentTarget.name] = value;
        this.setState({
            process:process
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.process);
        }
        

    }
}

export default RFQProcess;