import React from 'react';

import {Button, Modal, Form} from 'react-bootstrap';
import SDK from '../../sdk/SDK';


class ChangeProductTypeModal extends React.Component { 
    constructor(props){
        super(props);
        this.deliverableForm = React.createRef();
        this.state={
            show:props.show,
            productTypes:[],
            productType:props.productType
            // quotationForm:{}
        }

    }

    async componentDidMount(){
        //this.refreshRequirements();
        try{
            let productTypes = await SDK.ProductTypes.getProductTypes();
            this.setState({
                productTypes:productTypes
            })

        }catch(err){
            alert("Unable to retreive product type list");
            this.setState({
                productTypes:[]
            })
        }
    }


    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Product Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Form.Group>
                        <Form.Label>Product Type</Form.Label>
                        <Form.Control as="select" name="productType"  onChange={this.controlChanged} value={this.state.productType}>
                            {
                                this.state.productTypes.map((row)=>{
                                    return <option value={row._id}>{row.product_name}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button> */}
                    <Button variant="primary" size="sm"onClick={this.updateProductType}>
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
    showModal = (project_id, productType)=>{
        this.setState({
            show:true,
            project_id:project_id,
            productType:productType
        })
        
    }

    updateProductType = async ()=>{
        // let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        try{
            let data = await SDK.Projects.updateProductType(this.state.project_id, this.state.productType);
            if(this.props.onSubmit){
                this.props.onSubmit(data);
            }
            this.closeModal();
        }catch(err){
            alert('Error:' + err);
        }
    }

    controlChanged = (e)=>{
        // var data = this.state.data;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let state = {
        }
        state[e.currentTarget.name] = value;
        this.setState(state)
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
        

    }
}

export default ChangeProductTypeModal;