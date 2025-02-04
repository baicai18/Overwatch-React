import React from 'react';

import {Card, ListGroup, Col, Button, Row, Modal} from 'react-bootstrap';
import SDK from '../../../sdk/SDK';


class AddRequirement extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            show:props.show,
            selectedIndex:-1,
            requirements:[]
        }

        this.refreshRequirements = this.refreshRequirements.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.selectRequirement = this.selectRequirement.bind(this);
        this.requirementClicked = this.requirementClicked.bind(this);
    }

    componentDidMount(){
        //this.refreshRequirements();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Requirement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ListGroup as="ul">
                    {
                        this.state.requirements.map((x,index)=>{
                            return (
                                <ListGroup.Item as="li" active={this.state.selectedIndex === index} onClick={()=>this.requirementClicked(index)}>
                                    <Row>
                                        <Col md={9}>
                                            <Card.Title><h4>{x.display_name}</h4></Card.Title>
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
                    <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" size="sm"onClick={this.selectRequirement}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
        )
        
    }
    refreshRequirements(){
        return new Promise((resolve, reject)=>{
            SDK.Requirements.getRequirements()
            .then(data=>{
                this.setState({
                    requirements:data
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
        this.refreshRequirements()
        .then(data=>{
            this.setState({
                show:true
            })
        })
        
    }
    requirementClicked(index){
        this.setState({
            selectedIndex:index
        })
    }

    selectRequirement(){
        if(this.state.selectedIndex !== -1){
            if(this.props.onSelected){
                this.props.onSelected(this.state.requirements[this.state.selectedIndex]);
            }
            this.closeModal();
        }
    }

    saveProduct(){
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
            expand:true,
            requirement:requirement
        })
    }
    removeRequirement(){
        if(this.state.onRemove){
            this.state.onRemove(this.state.index, this.state.requirement);
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

export default AddRequirement;