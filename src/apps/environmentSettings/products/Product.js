import React from 'react';
import SDK from '../../../sdk/SDK';
import {Card, Col, Button, Row, Form, Modal} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AddRequirement from '../requirements/AddRequirement';
import ProductRequirement from '../requirements/ProductRequirement';
import AddProcess from '../processes/AddProcess';
import ProductProcess from '../processes/ProductProcess';
import EditProduct from './EditProduct';

var blankProduct = {
    product_id:null,
    product_name:null,
    description:null,
    processes:[],
    requirements:[],
}

class Product extends React.Component { 
    constructor(props){
        super(props);

        if(props.product.new){
            Object.assign(props.product, blankProduct);
        }
        this.reqModal = React.createRef();
        this.processModal = React.createRef();
        this.editModal = React.createRef();

        this.state={
            index:props.index,
            expand:false,
            editing:props.editing?props.editing:false,
            showDeleteDialog:false,
            product:props.product,
            edit_product:props.product
        }
    }
    componentDidUpdate(props){
        if(props.product !== this.props.product){
            this.setState({
                product:this.props.product
            })
        }
    }
    productSaved = (data)=>{
        this.setState({
            product:data
        },()=>{
            if(this.props.onSave){
                this.props.onSave(data);
            }
        })
    }

    tryDeleteProduct = ()=>{
        this.setState({
            showDeleteDialog:true
        })
    }
    handleClose = ()=>{
        this.setState({
            showDeleteDialog:false
        })
    }

    deleteProduct = async()=>{
        try{
            let data = await SDK.ProductTypes.deleteProductType(this.state.product._id);
            this.setState({
                showDeleteDialog:false
            },()=>{
                if(this.props.onDelete){
                    this.props.onDelete();
                }
            })
        }catch(err){
            this.setState({
                showDeleteDialog:false
            })
            alert(err);
        }
    }

    render() {
        return (
            <div>
                <Card className="mb-2">
                    <Card.Header className="card-header-border">
                            {this.state.editing?
                                <Form.Control name="product_name" placeholder="Product Name" value={this.state.product.product_name} onChange={this.controlChanged}></Form.Control>
                                :<h4>{this.state.product.product_name}</h4>
                            }
                            {!this.state.editing?
                                <div className="header-actions">
                                    <a onClick={this.tryDeleteProduct}>
                                        <i class="fas fa-times"/>
                                    {/* <FontAwesomeIcon icon="times"/> */}
                                    </a>
                                </div>
                                :''
                            }
                    </Card.Header>
                        <Card.Body>
                            {this.state.editing?
                                <Form.Control as="textarea" rows="4" name="description" placeholder="Description" value={this.state.product.description} onChange={this.controlChanged}></Form.Control>
                                :
                                <pre>{this.state.product.description}</pre>
                            }
                            <Row>
                                {/* <Col md={6}>
                                    <Card>
                                        <Card.Header>
                                            Process
                                            {this.state.editing?
                                            <div className="header-actions">
                                                <a onClick={this.newProcess}>
                                                    <FontAwesomeIcon icon="plus" title={"Add Process"}/>
                                                </a>
                                            </div>:''
                                            }
                                        </Card.Header>
                                        <Card.Body key={this.state.editing?this.state.editing:false} style={{maxHeight:"50vh", overflow:"auto"}}>
                                            {
                                                this.state.product.processes.map((x,index)=>{
                                                    if(x.process != null){
                                                        return <ProductProcess key={x.process_id+index.toString()} index={index} editable={this.state.editing} productProcess={x} onRemove={this.removeProcess} onDataChanged={this.productProcessChanged}/>
                                                    }else{
                                                        return '';
                                                    }
                                                    
                                                })
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col> */}
                                <Col md={12}>
                                    <Card>
                                        <Card.Header>
                                        Requirements
                                        {
                                            this.state.editing?
                                            <div className="header-actions">
                                                <a onClick={this.newRequirement}>
                                                    <i class="fas fa-plus" title={"Add Requirement"}/>
                                                    {/* <FontAwesomeIcon icon="plus" title={"Add Requirement"}/> */}
                                                </a>
                                            </div>
                                            :''
                                        }
                                        
                                        </Card.Header>
                                        <Card.Body key={this.state.editing?this.state.editing:false} style={{maxHeight:"50vh", overflow:"auto"}}>
                                            {
                                                this.state.product.requirements.map((x,index)=>{
                                                    if(x.requirement != null){
                                                        return <ProductRequirement key={x} index={index} editable={this.state.editing} productRequirement={x} onRemove={this.removeRequirement} onDataChanged={this.productRequirementChanged}/>
                                                    }else{
                                                        return '';
                                                    }
                                                    
                                                })
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                        </Card.Body>
                    <Card.Footer>
                        {
                            this.state.editing?
                                <Button variant="primary" size="sm"  onClick={this.saveProduct}>Save</Button>
                            :
                            <Button variant="primary" size="sm"  onClick={this.editProduct}>Edit</Button>
                        }
                    </Card.Footer>
                    <AddRequirement ref={this.reqModal}show={false} onSelected={this.addRequirement}/>
                    <AddProcess ref={this.processModal}show={false} onSelected={this.addProcess}/>
                    <EditProduct ref={this.editModal} onSave={this.productSaved}/>
                </Card>
                    <Modal
                        show={this.state.showDeleteDialog}
                        backdrop={'static'}
                        onHide={this.handleClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Warning! Deleting product will also delete any projects create of this type.  Are you sure you wish to continue?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                            <Button variant="primary" onClick={this.deleteProduct}>Confirm</Button>
                        </Modal.Footer>
                    </Modal>
            </div>
            
        )
    }

    productRequirementChanged = (index, productRequirement)=>{
        var product = this.state.product;
        product.requirements[index] = productRequirement;
        this.setState({
            product:product
        }, ()=>{
            console.log(this.state.product)
        })
        
    }
    newRequirement = () =>{
        this.reqModal.current.showModal();
    }
    addRequirement=(requirement)=>{
        var product = this.state.product;
        product.requirements.push({
            requirement_id:requirement._id,
            required:false,
            requirement:requirement,
        });
        this.setState({
            product:product
        })

        
    }
    removeRequirement=(index, requirement)=>{
        var product = this.state.product;

        product.requirements.splice(index,1);
        this.setState({
            product: product
        })
    }

    
    productProcessChanged=(index, productProcess)=>{
        var product = this.state.product;
        product.processes[index] = productProcess;
        this.setState({
            product:product
        })
    }
    newProcess=()=>{
        this.processModal.current.showModal();
    }
    addProcess=(process)=>{
        var product = this.state.product;
        product.processes.push({
            process_id:process._id,
            required:false,
            process:process,
        });
        this.setState({
            product:product
        })

        
    }
    removeProcess=(index, process)=>{
        var product = this.state.product;

        product.processes.splice(index,1);
        this.setState({
            product: product
        })
    }



    saveProduct=()=>{

        console.log(this.state.product);
        SDK.ProductTypes.saveProductType(this.state.product)
        .then(data=>{
            var product = this.state.product;
            product._id = data._id;
            this.setState({
                editing:false,
                product:product
            })
        })
        .catch(err=>{
            console.log(err);
            alert(err);
        })

        
    }
    editProduct=()=>{
        // alert(JSON.stringify(this.state.product));
        this.editModal.current.showModal(this.state.product._id);
        // var product = this.state.product;
        // this.setState({
        //     expand:true,
        //     editing:true,
        //     product:product
        // })
    }
    controlChanged=(e)=>{
        var product = this.state.product;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        product[e.currentTarget.name] = value;
        this.setState({
            product:product
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.product);
        }
        

    }
}

export default Product;