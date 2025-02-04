import React from 'react';

import {Button, Modal, Form} from 'react-bootstrap';
import SDK from '../../sdk/SDK';


class NewRevisionModal extends React.Component { 
    constructor(props){
        super(props);
        this.deliverableForm = React.createRef();
        this.state={
            show:props.show,
            project_id:props.project_id,
            data:{},
            // quotationForm:{}
        }

    }

    async componentDidMount(){
        //this.refreshRequirements();
        try{
            let quotationForm = await SDK.Quotations.getQuotationForm();
            if(quotationForm){
                this.setState({
                    quotationForm:quotationForm.formData
                })

            }
        }catch(err){

        }
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>New Revision</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Form.Group>
                        <Form.Label>Revision</Form.Label>
                        <Form.Control name="revision"  onChange={this.controlChanged}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" type="text" onChange={this.controlChanged}/>
                    </Form.Group>
                    {/* <DeliverableForm ref={this.deliverableForm} formDesign={this.state.quotationForm}/> */}

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button> */}
                    <Button variant="primary" size="sm"onClick={this.saveRevision}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        )
        
    }
    closeModal = ()=>{
        this.setState({
            show:false,
            selectedIndex:-1
        })
    }
    showModal = ()=>{
        this.setState({
            show:true
        })
        
    }

    saveRevision = async ()=>{
        // let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        try{
            await SDK.Projects.newRevision(this.state.project_id, this.state.data);
            if(this.props.onSubmit){
                this.props.onSubmit(this.state.data);
            }
            this.closeModal();
        }catch(err){
            alert('Error:' + err);
        }
    }

    submitRequest = ()=>{
        let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        if(this.state.selectedIndex !== -1){
            if(this.props.onSubmit){
                this.props.onSubmit(this.state.data, formData);
            }
            this.closeModal();
        }
    }

    controlChanged = (e)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        data[e.currentTarget.name] = value;
        this.setState({
            data:data
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
        

    }
}

export default NewRevisionModal;