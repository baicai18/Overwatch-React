import React from 'react';

import {Container, Card} from 'react-bootstrap';
import Product from './products/Product';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../sdk/SDK';
import EditProduct from './products/EditProduct';

class ProductTypes extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            products:[]
        }
        this.newProduct = this.newProduct.bind(this);
        this.productChanged = this.productChanged.bind(this);
        this.updateProducts = this.updateProducts.bind(this);
        this.editProduct = React.createRef();
    }

    componentDidMount(){
        this.updateProducts();
    }
    productSaved = (data)=>{
        this.updateProducts();
    }
    productDeleted = (data)=>{
        this.updateProducts();
    }
    render() {
        return (
            <Container fluid>
                <Card>
                    <Card.Header className="card-header-border">
                        Products
                        <div className="header-actions">
                            <a onClick={this.newProduct}>
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                    </Card.Body>
                    <Card.Body>
                    {
                        this.state.products.length > 0 ?
                            this.state.products.map((x, index)=>{
                                return <Product key={x._id} index={index} product={x} onDataChanged={this.productChanged} onSave={this.productSaved} onDelete={this.productDeleted}/>
                            })
                        :
                        <p>No products created yet click the + to add</p>
                    }
                    </Card.Body>
                </Card>
                <EditProduct ref={this.editProduct} onSave={this.productSaved}/>
            </Container>
        )
    }
    updateProducts(){
        SDK.ProductTypes.getProductTypes()
        .then(data=>{
            this.setState({
                products:data||[]
            })
        })
    }

    productChanged(index, product){
        var products = this.state.products;
        products[index] = product;
        this.setState({
            products:products
        })
    }
    newProduct(){
        this.editProduct.current.showModal();
        return;
        var editing = false;
        for(var x = 0; x < this.state.products.length; x++){
            if(this.state.products[x].editing){
                editing = true;
            }
        }
        if(editing){
            alert("Please save changes to current open product");
        }else{
            var products = this.state.products;
            products.push({
                new:true,
                editing:true,
            })
            this.setState({
                products:products
            });
        }
    }
    getProductTypes(){

    }
}

export default ProductTypes;