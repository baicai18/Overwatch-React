import React from 'react';
import UserInfo from './UserInfo';
import Addresses from './Addresses';
import SDK from '../../sdk/SDK';
import {Card, Container, Nav, Tab,Row, Col, Button, Form, Dropdown, Badge, Table} from 'react-bootstrap';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import Projects from './Projects';
import auth from '../../auth';
import { Redirect } from 'react-router-dom';
import ConfirmDialog from '../tools/ConfirmDialog';
import moment from 'moment'

import RoleInfo from './RoleInfo';

class Organization extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            organization_name: props.match.params.organization_name,
            editOrgName:false,
            organization:{},
            users:[],
            seletedUser: {}
        }
        this.userInfo = React.createRef();
        this.roleInfo = React.createRef();
        this.addresses = React.createRef();
        this.handleSaveUser = this.handleSaveUser.bind(this);
        this.handleDeletedUser = this.handleDeletedUser.bind(this);
        this.handleInactivateUser = this.handleInactivateUser.bind(this);
        this.handleReactivateUser = this.handleReactivateUser.bind(this);
        this.confirmDialog = React.createRef();

        this.userColumns = [
            {key:'first_name', name:'First Name', resizable:false},
            {key:'email', name:'Email', resizable:false},
            {key:'phone_number', name:'Phone Number', resizable:false},
            {key:'job_title', name:'Job Title', resizable:false},
            {key:'verified', name:'Verified', resizable:false},
            {key:'inactivated', name:'Inactivated', resizable:false},
            {key:'locked', name:'Locked', resizable:false},
        ]
        this.roleColumns = [
            {key:'role_code', name:'Role Code', resizable:false},
            {key:'description', name:'Description', resizable:false},
            {key:'inactivated', name:'Inactivated', resizable:false},
            {key:'locked', name:'Locked', resizable:false},
        ]
    }

    componentDidMount(){
        this.getOrganizationInfo(); 
        this.getOrganizationUsers();
        this.getOrganizationRoles();
    }
    onSelect(e){
        
    }

    getOrganizationUsers = async()=>{
        try{
            let users = await SDK.Organizations.getOrganizationUsers(this.state.organization_name);
            this.setState({
                users:users
            })
        }catch(err){
            console.error(err);
        }
    }
    getOrganizationRoles = async()=>{
        try{
            let userRoles = await SDK.UserRoles.findUserRoles({q:`organization_name="` + this.state.organization_name + `"`});
            this.setState({
                roles:userRoles
            })
        }catch(err){
            console.error(err);
        }
    }

    getOrganizationInfo = async()=>{
        try{
            let organization = await SDK.Organizations.getOrganizationInfo(this.state.organization_name);
            this.setState({
                organization:organization
            })
        }catch(err){
            console.error(err);
        }
    }

    tryDeleteCustomer = async()=>{
        let data = await SDK.Organizations.checkDeleteOrganization(this.state.organization._id);
        console.log(JSON.stringify(data));
        if(data){
            this.confirmDialog.current.showDialog('Confirm delete', 
            <div>
                <p>Warning! Deleted organization data cannot be restored! Are you sure you want to proceed?</p>
                <Table>
                    <tr><th>Users</th><td>{data.users||0}</td></tr>
                    <tr><th>Organizations</th><td>{data.organizations||0}</td></tr>
                    <tr><th>Projects</th><td>{data.projects||0}</td></tr>
                    <tr><th>RFQs</th><td>{data.rfqs||0}</td></tr>
                    <tr><th>Quotations</th><td>{data.quotations||0}</td></tr>
                    <tr><th>POs</th><td>{data.pos||0}</td></tr>
                </Table>
            </div>, 
            this.deleteCustomer);
        }
        // this.confirmDialog.current.showDialog('Confirm delete', 'Warning! Deleted customer data cannot be restored! Are you sure you want to proceed?', this.deleteCustomer);
    }

    deleteCustomer = async()=>{
        try{
            await SDK.Organizations.deleteOrganization(this.state.organization._id);
            this.confirmDialog.current.showDialog('Success', 'Organization: ' + this.state.organization_name + ' has been deleted.  You will be redirect to Manage Customers page?', ()=>{window.location.href = '/customers';}, ()=>{window.location.href = '/customers';}, ()=>{window.location.href = '/customers';}, null, null, null, true );
            // alert("Organization deleted, you will be redirected to customers page");
            // window.location.href = '/customers';
        }catch(err){
            alert(err);
        }
    }

    toggleEdit = ()=>{
        this.setState({
            editOrgName:!this.state.editOrgName,
            editName:this.state.organization_name
        })
    }

    editNameChanged = (e)=>{
        this.setState({
            editName:e.target.value
        })
    }

    trySave = async ()=>{
        try{

            if(this.state.editName === this.state.organization_name){
                alert("Unchanged");
            }else{
                await SDK.Organizations.updateOrganization(this.state.organization_name, {name:this.state.editName});
                alert("Saved");
                window.location = '/organization/' + this.state.editName
    
            }
        }catch(err){
            alert(err);
        }
    }

    tryDeactivate = async()=>{
        this.confirmDialog.current.showDialog('Confirm Deactivate', 'Are you sure you want to proceed?', this.deactivateOrganization);
    }

    deactivateOrganization = async()=>{
        try{
            await SDK.Organizations.deactivateOrganization(this.state.organization._id);
            this.confirmDialog.current.showDialog('Success', 'Organization: ' + this.state.organization_name + ' has been deactivated.  You will be redirect to customers page.', ()=>{window.location.href = '/customers';}, ()=>{window.location.href = '/customers';}, ()=>{window.location.href = '/customers';}, null, null, null, true );
            // alert("Organization deleted, you will be redirected to customers page");
            // window.location.href = '/customers';
        }catch(err){
            alert(err);
        }
    }
    
    
    tryReactivate = async()=>{
        this.confirmDialog.current.showDialog('Confirm Reactivate', 'Are you sure you want to proceed?', this.reactivateOrganization);
    }

    reactivateOrganization = async()=>{
        try{
            await SDK.Organizations.reactivateOrganization(this.state.organization._id);
            this.confirmDialog.current.showDialog('Success', 'Organization: ' + this.state.organization_name + ' has been reactivated.  You will be redirect to customers page.', ()=>{window.location.href = '/customers';}, ()=>{window.location.href = '/customers';}, ()=>{window.location.href = '/customers';}, null, null, null, true );
            // alert("Organization deleted, you will be redirected to customers page");
            // window.location.href = '/customers';
        }catch(err){
            alert(err);
        }
    }

    render = ()=>{

        // let userColumns = [
        //     {key:'first_name', name:'First Name', resizable:false},
        //     {key:'email', name:'Email', resizable:false},
        //     {key:'phone_number', name:'Phone Number', resizable:false},
        //     {key:'job_title', name:'Job Title', resizable:false},
        //     {key:'verified', name:'Verified', resizable:false},
        //     {key:'inactivated', name:'Inactivated', resizable:false},
        //     {key:'locked', name:'Locked', resizable:false},
        // ]

        return (
            <Container fluid>
                <Row>
                    <Col className="col-auto">
                        <h1 className="h3 mb-2 text-gray-800">{this.state.organization_name}</h1>
                        <p className="mb-4">
                            Manage oganization details
                        </p>
                    </Col>
                    {
                        (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_CUSTOMER_INFO') && this.state.editOrgName)?
                        <Col className="col-auto">
                            <Form.Control size="sm" type={'text'} value={this.state.editName}  onChange={this.editNameChanged}/>
                        </Col>
                        :null
                    }
                    {
                        (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_CUSTOMER_INFO') && !this.state.editOrgName)?
                        <div><Button size="sm" onClick={this.toggleEdit}><i className="fa fa-pen-to-square"></i></Button></div>
                        :null
                    }
                    {
                        (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_CUSTOMER_INFO') && this.state.editOrgName)?
                        <div>
                            <Button size="sm" variant="success" ><i className="fa fa-floppy-disk" onClick={this.trySave}></i></Button>
                            <Button size="sm" variant="danger" onClick={this.toggleEdit}><i className="fa fa-xmark"></i></Button>
                        </div>
                        :null
                    }
                    {
                        (this.state.organization && this.state.organization.inactive_date)?
                        <Col className="mt-2">
                            <Badge variant="danger">Deactivated - {moment(this.state.organization.inactive_date).format('YYYY-MM-DD hh:mm:ss a') + ' by ' + this.state.organization.inactivated_by}</Badge>
                        </Col>
                        :null
                    }
                    {/* <Col className="d-flex flex-column align-items-end">
                        {
                            auth.userInfo.permissions.includes("EMPLOYEE_CUSTOMER_ADMIN")?
                            <Button size="sm" variant="danger" onClick={()=>{this.tryDeleteCustomer()}}><i class="fas fa-trash"></i></Button>
                            :''
                        }
                        
                    </Col> */}
                    {
                        (auth.userInfo.organization === this.state.organization || auth.userInfo.permissions.includes("EMPLOYEE_DEACTIVATE_ORGANIZATION"))?
                        <Col  className="flex-grow-1 d-flex justify-content-end bg-light mb-03">
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" size="sm">
                                    <i className="fa-solid fa-bars"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        auth.userInfo.permissions.includes("EMPLOYEE_DEACTIVATE_ORGANIZATION")?
                                            (this.state.organization && !this.state.organization.inactive_date)?
                                                <Dropdown.Item onClick={this.tryDeactivate}>Deactivate</Dropdown.Item>
                                            :(this.state.organization && this.state.organization.inactive_date)?
                                            <Dropdown.Item onClick={this.tryReactivate}>Reactivate</Dropdown.Item>
                                            :null
                                        :null
                                    }
                                    {
                                        auth.userInfo.permissions.includes("EMPLOYEE_DELETE_ORGANIZATION")?
                                            <Dropdown.Item onClick={this.tryDeleteCustomer}>Delete</Dropdown.Item>
                                        :null
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        :''
                    }
                </Row>
                <Card>
                <Tab.Container id="left-tabs-example" defaultActiveKey="projects">
                    <Card.Header>
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="projects">Projects</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="users">Users</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="roles">Roles</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="addresses">Addresses</Nav.Link>
                            </Nav.Item>
                        </Nav>

                    </Card.Header>
                    <Card.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey="projects">
                                <Projects organization_name={this.state.organization_name}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="users">
                                <ReactGrid
                                    resizeable={false}
                                    columns={this.userColumns}
                                    rowGetter={i=> this.state.users?this.state.users[i]:{}}
                                    rowsCount={this.state.users?this.state.users.length:0} 
                                    onRowClicked={this.handleRowClick}
                                    sortable={true}
                                    
                                />
                                <br/>
                                <UserInfo 
                                    ref={this.userInfo} 
                                    organization_name={this.state.organization_name} 
                                    userInfo={this.state.selectedUser} 
                                    onSave={this.handleSaveUser} 
                                    onDeleted={this.handleDeletedUser}
                                    onInactivate={this.handleInactivateUser}
                                    onReactivate={this.handleReactivateUser}
                                    />
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="roles">
                                <ReactGrid
                                    resizeable={false}
                                    columns={this.roleColumns}
                                    rowGetter={i=> this.state.roles?this.state.roles[i]:{}}
                                    rowsCount={this.state.roles?this.state.roles.length:0} 
                                    onRowClicked={this.handleRoleRowClick}
                                    sortable={true}
                                    
                                />
                                <br/>
                                <RoleInfo 
                                    ref={this.roleInfo} 
                                    organization_name={this.state.organization_name} 
                                    userInfo={this.state.selectedRole} 
                                    onSave={this.handleSaveRole} 
                                    onDeleted={this.handleDeletedRole}
                                    onInactivate={this.handleInactivateRole}
                                    onReactivate={this.handleReactivateRole}
                                    />
                            </Tab.Pane>
                            <Tab.Pane eventKey="addresses">
                                <Addresses ref={this.addresses} organization_name={this.state.organization_name} adddresses = {this.state.addresses}/>
                            </Tab.Pane>
                        </Tab.Content>

                    </Card.Body>
                    </Tab.Container>
                </Card>
                
                
                <ConfirmDialog ref={this.confirmDialog}/>
            </Container>
        );
    }
    handleRowClick = async(index,row)=>{
        try{
            let data = await SDK.Organizations.getUser(row.email);
            this.userInfo.current.setState({
                newUser:false,
                userInfo:data
            })
        }catch(err){
            alert(err);
        }
    }

    handleSaveUser = async (userInfo)=>{
        var me = this;
        SDK.Organizations.getOrganizationUsers(this.state.organization_name)
        .then(function(data){
            me.setState({
                users:data
            })
        })
    }
    handleDeletedUser = async (userInfo)=>{
        var me = this;
        SDK.Organizations.getOrganizationUsers(this.state.organization_name)
        .then(function(data){
            me.setState({
                users:data
            })
        })
    }
    handleInactivateUser = async (userInfo)=>{
        var me = this;
        SDK.Organizations.getOrganizationUsers(this.state.organization_name)
        .then(function(data){
            me.setState({
                users:data
            })
        })
    }
    handleReactivateUser = async (userInfo)=>{
        var me = this;
        SDK.Organizations.getOrganizationUsers(this.state.organization_name)
        .then(function(data){
            me.setState({
                users:data
            })
        })
    }

    handleRoleRowClick = async(index,row)=>{
        try{
            let data = await SDK.UserRoles.getUserRole(row._id);
            this.roleInfo.current.setState({
                newRole:false,
                roleInfo:data
            })
        }catch(err){
            alert(err);
        }
    }

    handleSaveRole = async (roleInfo)=>{
        var me = this;
        this.getOrganizationRoles();
    }
    handleDeletedRole = async (userInfo)=>{
        this.getOrganizationRoles();
    }
    handleInactivateRole = async (userInfo)=>{
        this.getOrganizationRoles();
    }
    handleReactivateRole = async (userInfo)=>{
        this.getOrganizationRoles();
    }

}

export default  Organization;