import React from 'react';

import {Card, Col, Button, Row, Form} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// var blankprocess = {
//     _id:null,
//     process_name:null,
//     display_name:null,
//     type:null,
//     description:null,
// }

// blankprocess = {
//     product_id:null,
//     process_name:'TK',
//     display_name:'Turnkey',
//     description:'Description',
//     workflow:[],
//     processs:[{
//         _id:null,
//         name:'BOM',
//         type:'bom',
//         description:'BOM for build'
//     }],
// }

class Process extends React.Component { 
    constructor(props){
        super(props);

        this.state={
            expand:false,
            editable:props.editable,
            process:props.process,

            onRemove:props.onRemove
        }
        this.saveProcess = this.saveProcess.bind(this);
        this.editProcess = this.editProcess.bind(this);
        this.controlChanged = this.controlChanged.bind(this);
        this.removeProcess = this.removeProcess.bind(this);
    }
    render() {
        return (
            <Card className={this.state.process.editing?"fullscreen":""}>
                {
                    this.state.process.editing?
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Process Code</Form.Label>
                                <Form.Control name="process_code" placeholder="Process Code" value={this.state.process.process_name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control name="process_name" placeholder="Process Name" value={this.state.process.process_name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="description" placeholder="Description" value={this.state.process.description} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Process Type</Form.Label>
                                <Form.Control name="process_type" placeholder="Process Type" value={this.state.process.process_type} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                        </Card.Body>

                    :
                        <Card.Header>
                            <Row>
                                <Col md={9}>
                                    <Card.Title><h4>{this.state.process.process_name}</h4></Card.Title>
                                    <Card.Subtitle>{this.state.process.description}</Card.Subtitle>
                                </Col>
                                <Col md={3}>
                                    <Card.Text>{this.state.process.type}</Card.Text>
                                </Col>
                            </Row>
                            {
                                this.state.editable?
                                <div className="header-actions">
                                    <a onClick={this.editProcess}>
                                        <i class="fas fa-edit"/>
                                        {/* <FontAwesomeIcon icon="edit"/> */}
                                    </a>
                                </div>
                                :''
                            }
                        </Card.Header>
                    
                }
                {
                    this.state.process.editing?
                    <Card.Footer>
                        <Button variant="primary" size="sm"  onClick={this.saveProcess}>Save</Button>
                    </Card.Footer>
                    :""
                }
            </Card>
        )
        
    }

    saveProcess(){
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
            expand:true,
            process:process
        })
    }
    removeProcess(){
        if(this.state.onRemove){
            this.state.onRemove(this.state.index, this.state.process);
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

export default Process;