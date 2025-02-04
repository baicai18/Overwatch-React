import React from 'react';
import SDK from '../../../sdk/SDK';
import {Card, Col, Button, Row, Form, Modal} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AddRequirement from '../requirements/AddRequirement';
import ProductRequirement from '../requirements/ProductRequirement';
import AddProcess from '../processes/AddProcess';
import ProductProcess from '../processes/ProductProcess';

var blankProduct = {
    product_id:null,
    product_name:null,
    description:null,
    processes:[],
    requirements:[],
}

// blankProduct = {
//     product_id:null,
//     product_name:'Turnkey',
//     description:'Description',
//     workflow:[],
//     requirements:[
//         {
//             _id:1,
//             requirement_name:'BOM',
//             display_name:'BOM',
//             type:'bom',
//             description:'BOM for build'
//         },
//         {
//             _id:2,
//             requirement_name:'CAD',
//             display_name:'CAD',
//             type:'file',
//             description:'OBD++ or Gerber'
//         },
//         {
//             _id:3,
//             requirement_name:'Stackup File',
//             display_name:'Stackup File',
//             type:'file',
//             description:'Stackup file'
//         },
//         {
//             _id:4,
//             requirement_name:'Fab Drawing',
//             display_name:'Fab Drawing',
//             type:'file',
//             description:'Fab Drawing'
//         },
//         {
//             _id:5,
//             requirement_name:'Placement File',
//             display_name:'Placement File',
//             type:'file',
//             description:'XY Data'
//         },
//         {
//             _id:6,
//             requirement_name:'Panel Drawing',
//             display_name:'Panel Drawing',
//             type:'file',
//             description:'Panel Drawing'
//         }
//     ],
// }

class EditProduct extends React.Component { 
    constructor(props){
        super(props);

        // if(props.product.new){
        //     Object.assign(props.product, blankProduct);
        // }
        
        this.reqModal = React.createRef();
        this.processModal = React.createRef();

        this.state={
            index:props.index,
            expand:false,
            editing:props.editing?props.editing:false,
            data:Object.assign({}, blankProduct),


            product:props.product,
            edit_product:props.product
        }
    }

    showModal = async (productId)=>{
        try{
            let data = Object.assign({}, blankProduct);
            if(productId){
                data = await SDK.ProductTypes.getProductType(productId);
                
            }
            if(data){
                this.setState({
                    show:true,
                    data:data
                })
            }
        }catch(err){
            alert(err);
        }
    }
    closeModal = ()=>{
        this.setState({
            show:false,
            data:Object.assign({},blankProduct)
        },()=>{
            if(this.props.handleClose){
                this.props.handleClose();
            }
        })
    }
    render() {
        return (
            <div>
                <Modal 
                    dialogClassName="fullscreen"
                    show={this.state.show} 
                    onHide={this.closeModal}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label>
                                        Product Name
                                    </Form.Label>
                                    <Form.Control name="product_name" placeholder="Product Name" value={this.state.data.product_name} onChange={this.controlChanged}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        Description
                                    </Form.Label>
                                    <Form.Control as="textarea" rows="4" name="description" placeholder="Description" value={this.state.data.description} onChange={this.controlChanged}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Card>
                                    <Card.Header>
                                    Requirements
                                    {
                                        <div className="header-actions">
                                            <a onClick={this.newRequirement}>
                                                <i class="fas fa-plus" title={"Add Requirement"}/>
                                                {/* <FontAwesomeIcon icon="plus" title={"Add Requirement"}/> */}
                                            </a>
                                        </div>
                                    }
                                    
                                    </Card.Header>
                                    <Card.Body key={this.state.editing?this.state.editing:false} style={{maxHeight:"50vh", overflow:"auto"}}>
                                        {
                                            this.state.data.requirements.map((x,index)=>{
                                                if(x.requirement != null){
                                                    return <ProductRequirement key={x.requirement_id+index.toString()} index={index} editable={true} productRequirement={x} onRemove={this.removeRequirement} onDataChanged={this.productRequirementChanged}/>
                                                }else{
                                                    return '';
                                                }
                                                
                                            })
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {/* <pre>
                            {JSON.stringify(this.state.data,null,2)}
                        </pre> */}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={this.closeModal}>
                            Close
                        </Button>
                        <Button variant="primary" size="sm"  onClick={this.saveProduct}>Save</Button>
                    </Modal.Footer>
                </Modal>
                <AddRequirement ref={this.reqModal}show={false} onSelected={this.addRequirement}/>
                <AddProcess ref={this.processModal}show={false} onSelected={this.addProcess}/>
            </div>
        )
    }

    productRequirementChanged = (index, productRequirement)=>{
        var data = this.state.data;
        data.requirements[index] = productRequirement;
        this.setState({
            data:data
        }, ()=>{
            console.log(this.state.product)
        })
        
    }
    newRequirement = () =>{
        this.reqModal.current.showModal();
    }
    addRequirement=(requirement)=>{
        var data = this.state.data;
        data.requirements.push({
            requirement_id:requirement._id,
            required:false,
            requirement:requirement,
        });
        this.setState({
            data:data
        })

        
    }
    removeRequirement=(index, requirement)=>{
        var data = this.state.data;

        data.requirements.splice(index,1);
        this.setState({
            data: data
        })
    }

    
    productProcessChanged=(index, productProcess)=>{
        var data = this.state.data;
        data.processes[index] = productProcess;
        this.setState({
            data:data
        })
    }
    newProcess=()=>{
        this.processModal.current.showModal();
    }
    addProcess=(process)=>{
        var data = this.state.data;
        data.processes.push({
            process_id:process._id,
            required:false,
            process:process,
        });
        this.setState({
            data:data
        })

        
    }
    removeProcess=(index, process)=>{
        var data = this.state.data;

        data.processes.splice(index,1);
        this.setState({
            data: data
        })
    }



    saveProduct=async ()=>{
        try{
            let data = this.state.data;
            let results = await SDK.ProductTypes.saveProductType(data);
            data._id = results._id;
            this.setState({
                data:data
            },()=>{
                if(this.props.onSave){
                    this.props.onSave(data);
                }
                this.closeModal();
            })
        }catch(err){
            alert(err);
        }        
    }
    editProduct=()=>{
        var data = this.state.data;
        this.setState({
            expand:true,
            editing:true,
            data:data
        })
    }
    controlChanged=(e)=>{
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

export default EditProduct;