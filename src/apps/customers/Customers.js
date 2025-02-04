import React from 'react';
// with es5
import {Card, Modal, Button, Form, Col} from 'react-bootstrap';
// import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import SortButton from '../tools/ReactGrid/SortButton';
import ConfirmDialog from '../tools/ConfirmDialog';


class Customers extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            customers:[],
            showNewCustomer:false,
            newCustomerName:''
        }

        this.handleRowClick = this.handleRowClick.bind(this);

        this.customerTableRef = React.createRef();
        this.confirmDialog = React.createRef();
    }

    componentDidMount(){
        this.getCustomers();
    }
    getCustomers = async()=>{
        try{
            let match = {q:'organization_type != 0'}
            if(!this.state.showInactive){
                match.q += ',inactive_date = NULL'
            }
            let data = await SDK.Organizations.findOrganizations(match)
            this.setState({
                customers:data
            })
        }catch(err){
            alert(err);
        }
    }
    setActions = (cell, row)=>{
        return '<a className="btn btn-sm btn-secondary text-white" href="/organization/' + row.name + '"> OPEN</button>'
    }
    handleClose = ()=>{
        this.setState({
            newCustomerName:'',
            showNewCustomer:false
        })
    }
    trySaveCustomer = async()=>{
        try{
            let data = await SDK.Organizations.saveNewOrganization(this.state.newCustomerName);
            if(data){
                // let customers = await SDK.Organizations.getCustomers();
                this.setState({
                    // customers:customers,
                    showNewCustomer:false,
                    newCustomerName:''

                },()=>{
                    this.getCustomers();
                })
            }
        }catch(err){
            alert(err);
        }
    }
    customerNameChanged = (e)=>{
        let value = e.target.value;
        this.setState({
            newCustomerName:value
        })
    }
    tryDeleteCustomers = async()=>{
        let rows = this.customerTableRef.current.getSelectedRows();
        if(rows.length > 0){
            this.confirmDialog.current.showDialog('Confirm delete', 'Warning! Deleted customer data cannot be restored! Are you sure you want to proceed?', this.deleteCustomers);
        
        }
        
    }

    deleteCustomers = async()=>{
        try{
            let rows = this.customerTableRef.current.getSelectedRows();
            for(let x = 0; x < rows.length; x++){
                try{
                    await SDK.Organizations.deleteOrganization(rows[x].row.name);
                }catch(err){
                    console.error(err);
                    throw("Error deleting organization: " + rows[x].row.name);
                }
            }
            
            this.getCustomers();
        }catch(err){
            console.error(err);
            this.getCustomers();
        }
    }
    toggleShowInactive = ()=>{
        this.setState({
            showInactive: !this.state.showInactive
        },()=>{
            this.getCustomers();
        })
    }
    render = ()=>{

        let columns = [
            {key:'name', name:'Name', resizable:false, formatter:({value,row})=>{
                return <a href={'/organization/'+value} title={value}>{value}</a>
            }},
            {key:'create_date', name:'Creation Date', resizable:false},
            {key:'inactive_date', name:'Inactive Date', resizable:false},
        ]

        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Customers</h1>
                <p className="mb-4">
                    View all customers
                </p>
                <Card>
                    <Card.Header>
                        customers
                        <div className="header-actions"><button className="close" onClick={()=>{this.setState({showNewCustomer:true})}}>+</button></div>
                    </Card.Header>
                    <Card.Body>
                        
                        <ReactGrid
                            ref={this.customerTableRef}
                            resizeable={false}
                            columns={columns}
                            rowGetter={i=> this.state.customers?this.state.customers[i]:{}}
                            rowsCount={this.state.customers?this.state.customers.length:0} 
                            sortable={true}
                            buttons={[
                                <Col xs="auto" style={{display:"inline-block"}}><Form.Check label="Show Inactive" checked={this.state.showInactive} onClick={this.toggleShowInactive}></Form.Check></Col>
                            ]}
                            // buttons={[
                            //     <Button size="sm" variant="danger" onClick={()=>{this.tryDeleteCustomers()}}><i class="fas fa-trash"></i></Button>
                            // ]}
                        />
                    </Card.Body>
                </Card>
                <ConfirmDialog ref={this.confirmDialog}/>
                <Modal show={this.state.showNewCustomer} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><Form.Control type="text" placeholder="Customer Name" value={this.state.newCustomerName} onChange={this.customerNameChanged}></Form.Control></Modal.Body>
                    <Modal.Footer>
                    <Button size="sm" variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button size="sm" variant="primary" onClick={this.trySaveCustomer}>
                        Save Customer
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    handleRowClick(row){
        
    }
}

export default  Customers;