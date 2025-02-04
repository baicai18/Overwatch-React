import React from 'react';

import {Button, Modal, Form} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';


class SubmitQuotation extends React.Component { 
    constructor(props){
        super(props);
        this.deliverableForm = React.createRef();
        this.state={
            show:props.show,
            rfq_number:props.rfq_number,
            data:{},
            quotationForm:{},
            quotationOptions:{}
        }

    }

    async componentDidMount(){
        //this.refreshRequirements();
        try{
            let quotationOptions = await SDK.Quotations.getQuotationOptions();
            let quotationForm = await SDK.Quotations.getQuotationForm();
            
            this.setState({
                quotationForm:quotationForm?quotationForm.formData||{}:{},
                quotationOptions:quotationOptions
            })
            // if(quotationForm){
            //     this.setState({
            //         quotationForm:quotationForm.formData
            //     })

            // }
        }catch(err){
            alert(err);
        }
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Quotation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.state.quotationOptions?
                            this.state.quotationOptions.options?
                            this.state.quotationOptions.options.manualQuotationNumber?
                            <Form.Group>
                                <Form.Label>Quotation Number</Form.Label>
                                <Form.Control name="quotationNumber" type="text" min="0" onChange={this.quotationNumberChanged}/>
                            </Form.Group>
                            :''
                            :''
                            :''

                    }
                    
                    <Form.Group>
                        <Form.Label>Total Price (Max) *</Form.Label>
                        <Form.Control name="totalPriceMax" type="number" min="0" step="0.01" onChange={this.controlChanged}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Total Price (Min) *</Form.Label>
                        <Form.Control name="totalPriceMin" type="number" min="0" step="0.01" onChange={this.controlChanged}/>
                    </Form.Group>
                    <DeliverableForm ref={this.deliverableForm} formDesign={this.state.quotationForm}/>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button> */}
                    <Button variant="primary" size="sm"onClick={this.submitQuotation}>
                        Submit Quotation
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

    submitQuotation = async ()=>{
        let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        try{
            await SDK.Quotations.submitQuotation(this.state.rfq_number, this.state.quotationNumber, this.state.data, formData);
            if(this.props.onSubmit){
                this.props.onSubmit(this.state.data, formData);
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
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        data[e.currentTarget.name] = value;
        this.setState({
            data:data
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
        

    }
    quotationNumberChanged = (e)=>{
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        this.setState({
            quotationNumber:value
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
        

    }
}

export default SubmitQuotation;