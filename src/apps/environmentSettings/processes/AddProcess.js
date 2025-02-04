import React from 'react';

import {Card, ListGroup, Col, Button, Row, Modal} from 'react-bootstrap';
import SDK from '../../../sdk/SDK';


class AddProcess extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            show:props.show,
            selectedIndex:-1,
            processes:[]
        }

        this.refreshProcesses = this.refreshProcesses.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.selectProcess = this.selectProcess.bind(this);
        this.processClicked = this.processClicked.bind(this);
    }

    componentDidMount(){
        //this.refreshProcesses();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Process</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ListGroup as="ul">
                    {
                        this.state.processes.map((x,index)=>{
                            return (
                                <ListGroup.Item as="li" active={this.state.selectedIndex === index} onClick={()=>this.processClicked(index)}>
                                    <Row>
                                        <Col md={9}>
                                            <Card.Title><h4>{x.process_name}</h4></Card.Title>
                                            <Card.Subtitle>{x.description}</Card.Subtitle>
                                        </Col>
                                        <Col md={3}>
                                            <Card.Text>{x.type}</Card.Text>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                            )
                        })
                    }
                </ListGroup>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.selectProcess}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
        )
        
    }
    refreshProcesses(){
        return new Promise((resolve, reject)=>{
            SDK.Processes.getProcesses()
            .then(data=>{
                this.setState({
                    processes:data
                })
                resolve(data);
            })
            .catch(err=>{
                reject(err)
            })
        })
        
    }
    closeModal(){
        this.setState({
            show:false,
            selectedIndex:-1
        })
    }
    showModal(){
        this.refreshProcesses()
        .then(data=>{
            this.setState({
                show:true
            })
        })
        
    }
    processClicked(index){
        this.setState({
            selectedIndex:index
        })
    }

    selectProcess(){
        if(this.state.selectedIndex !== -1){
            if(this.props.onSelected){
                this.props.onSelected(this.state.processes[this.state.selectedIndex]);
            }
            this.closeModal();
        }
    }

    saveProduct(){
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

export default AddProcess;