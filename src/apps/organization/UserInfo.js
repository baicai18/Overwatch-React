import React from 'react';
import {Form, Col, Button, Card, Badge, Tabs, Tab, CardGroup} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import Auth from '../../auth';
import moment from 'moment';

class UserInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            organization_name: props.organization_name,
            newUser: true,
            validated:false,
            userInfo:{organization:props.organization_name},
            permissions:[],
            assignablePermissions:[],
            userPermissions:[],
            roles:[],
            assignableRoles:[],
            userRoles:[]
        }
    }

    componentDidMount(){
        this.updatePermissions();
        this.updateRoles();
    }

    updatePermissions = async ()=>{
        try{
            let data = await SDK.Permissions.getAssignablePermissions();
            this.setState({
                permissions:data
            })
        }catch(err){

        }
    }

    updateRoles = async ()=>{
        try{
            let data = await SDK.UserRoles.findUserRoles({q:`organization_name="` + this.state.organization_name + `"`});
            this.setState({
                roles:data
            })
        }catch(err){

        }
    }

    PermissionList = (props) =>{
        return <div>
            {
                props.permissions? 
                props.permissions.map((permission)=>{
                    return <button type="button" className="list-group-item list-group-item-action" data-field={props.name} onClick={this.permissionClick} key={permission}>{permission}</button>
                    
                }):[]
            }
        </div>
    }
    
    permissionList = (permissions, name) =>{
        return <div>
            {
                permissions? 
                permissions.map((permission)=>{
                    return <button type="button" className="list-group-item list-group-item-action" data-field={name} onClick={this.permissionClick} key={permission}>{permission}</button>
                    
                }):[]
            }
        </div>
        // const listItems = (props.permissions? props.permissions.map((permission)=>{
        //     return (
        //         <button type="button" className="list-group-item list-group-item-action" data-field={props.name} onClick={this.permissionClick} key={permission}>{permission}</button>
        //     )
        // }):[]);
        // return (<div>{listItems}</div>);
    }


    permissionClick = (e) =>{
        if(e.target.classList.contains('active')){
            this.state[e.target.dataset.field].splice(this.state[e.target.dataset.field].indexOf(e.target.innerHTML),1);
            e.target.classList.remove('active');
        }else{
            
            this.state[e.target.dataset.field].push(e.target.innerHTML);
            e.target.classList.add('active');
        }

    }


    RoleList = (props) =>{
        return <div>
            {
                props.roles? 
                props.roles.map((role)=>{
                    return <button type="button" className="list-group-item list-group-item-action" data-field={props.name} onClick={this.roleClick} key={role}>{role}</button>
                    
                }):[]
            }
        </div>
    }
    
    roleList = (roles, name) =>{
        return <div>
            {
                roles? 
                roles.map((role)=>{
                    return <button type="button" className="list-group-item list-group-item-action" data-field={name} onClick={this.roleClick} key={role}>{role}</button>
                    
                }):[]
            }
        </div>
        // const listItems = (props.permissions? props.permissions.map((permission)=>{
        //     return (
        //         <button type="button" className="list-group-item list-group-item-action" data-field={props.name} onClick={this.permissionClick} key={permission}>{permission}</button>
        //     )
        // }):[]);
        // return (<div>{listItems}</div>);
    }


    roleClick = (e) =>{
        if(e.target.classList.contains('active')){
            this.state[e.target.dataset.field].splice(this.state[e.target.dataset.field].indexOf(e.target.innerHTML),1);
            e.target.classList.remove('active');
        }else{
            
            this.state[e.target.dataset.field].push(e.target.innerHTML);
            e.target.classList.add('active');
        }

    }

    
    handleSubmit = event => {
        const form = event.currentTarget;
        
        event.preventDefault();
        event.stopPropagation();

        
        if (form.checkValidity() === false) {
            this.setValidated(true);
            event.preventDefault();
            event.stopPropagation();
        }else{
            if(this.state.newUser){
                SDK.Organizations.saveUser(this.state.organization_name, this.state.userInfo)
                .then(data=>{
                    alert("Account has been created and verification email sent to the email entered");
                    SDK.Organizations.getUser(this.state.userInfo.email)
                    .then(data=>{
                        this.setState({
                            userInfo:data
                        })
                        this.setValidated(false);
                        if(this.props.onSave){
                            this.props.onSave(this.state.userInfo);
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    
                })
                .catch(err=>{
                    console.log(err);
                    alert(err);
                    // err.text().then(text=>alert(text));
                })
            }else{
                SDK.Organizations.updateUser(this.state.organization_name, this.state.userInfo.email, this.state.userInfo)
                .then(data=>{
                    alert("saved");
                    SDK.Organizations.getUser(this.state.userInfo.email)
                    //this.getUser(this.state.userInfo.email)
                    this.setState({
                        newUser:false
                    })
                    this.setValidated(false);
                    if(this.props.onSave){
                        this.props.onSave(this.state.userInfo);
                    }
                })
                .catch(err=>{
                    err.text().then(text=>alert(text));
                    console.log(err);
                })
            }
            
            
        }
        event.preventDefault();
        event.stopPropagation();
    };
    
    setValidated=(value)=>{
        this.setState({
            validated: value
        });
    }
    formChange=(event)=>{

        var item = this.state.userInfo;
        item[event.target.name] = event.target.value;
        this.setState({
            userInfo:item
        })
    }

    newUser = (event) =>{
        this.setState({
            newUser:true,
            userInfo:{
                email:'',
                first_name:'',
                last_name:'',
                phone_number:'',
                job_title:'',
                organization:this.state.organization_name
            }
        })
    }
    addPermission = (event) =>{
        var me = this;
        if(this.state.assignablePermissions.length > 0){
            //have items

            var promises = this.state.assignablePermissions.map(permission=>{
                return SDK.Users.addPermission(me.state.userInfo.email, permission)
            })

            Promise.all(promises)
            .then(data=>{
                SDK.Organizations.getUser(me.state.userInfo.email)
                .then(data=>{
                    me.setState({
                        userInfo:data,
                        assignablePermissions:[]
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
            
        }
    }

    refreshUserInfo = ()=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let userInfo = await SDK.Organizations.getUser(this.state.userInfo.email);
                this.setState({
                    userInfo:userInfo || {organization:this.props.organization_name},
                })
            }catch(err){
                alert("Unable to pull user info");
                this.setState({
                    userInfo:{organization:this.props.organization_name},
                })
            }
        })
    }

    removePermission = (event) =>{
        var me = this;
        if(this.state.userPermissions.length > 0){
            //have items

            var promises = this.state.userPermissions.map(permission=>{
                return SDK.Users.removePermission(me.state.userInfo.email, permission)
            })

            Promise.all(promises)
            .then(data=>{
                SDK.Organizations.getUser(me.state.userInfo.email)
                .then(data=>{
                    me.setState({
                        userInfo:data,
                        assignablePermissions:[]
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
            
        }
    }

    addRole = (event) =>{
        var me = this;
        if(this.state.assignableRoles.length > 0){
            //have items
            var promises = this.state.assignableRoles.map(role=>{
                return SDK.Users.addRole(me.state.userInfo.email, role)
            })

            Promise.all(promises)
            .then(data=>{
                SDK.Organizations.getUser(me.state.userInfo.email)
                .then(data=>{
                    me.setState({
                        userInfo:data,
                        assignableRoles:[]
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
            
        }
    }


    removeRole = (event) =>{
        var me = this;
        if(this.state.userRoles.length > 0){
            //have items

            var promises = this.state.userRoles.map(role=>{
                return SDK.Users.removeRole(me.state.userInfo.email, role)
            })

            Promise.all(promises)
            .then(data=>{
                SDK.Organizations.getUser(me.state.userInfo.email)
                .then(data=>{
                    me.setState({
                        userInfo:data,
                        assignableRoles:[]
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
            
        }
    }

    tryResendVerification = async ()=>{
        try{
            if(this.state.userInfo && this.state.userInfo.verified === false){
                await SDK.Organizations.resendVerification(this.state.organization_name, this.state.userInfo.email);
                alert("Verification email has been resent");
            }else{
                alert("User is already validated");
            }
        }catch(err){
            alert(err);
        }
    }

    tryDeleteUser = async ()=>{
        try{
            if(this.state.userInfo && this.state.userInfo.verified === false){
                await SDK.Organizations.deleteUser(this.state.organization_name, this.state.userInfo.email);
                alert("User has been deleted");
                if(this.props.onDeleted){
                    this.props.onDeleted();
                }
                this.setState({
                    newUser:true,
                    userInfo:{organization:this.props.organization_name},
                })
            }else{
                alert("User is already validated and cannot be deleted");
            }
        }catch(err){
            alert(err);
        }
    }

    tryInactivateUser = async ()=>{
        try{
            if(this.state.userInfo && !this.state.userInfo.inactivated){
                await SDK.Organizations.inactivateUser(this.state.organization_name, this.state.userInfo.email);
                alert("User has been inactivated");
                if(this.props.onInactivate){
                    this.props.onInactivate();
                }
                this.refreshUserInfo();
            }else{
                alert("User is already inactivated");
            }
        }catch(err){
            alert(err);
        }
    }
    
    tryReactivateUser = async ()=>{
        try{
            if(this.state.userInfo && this.state.userInfo.inactivated){
                await SDK.Organizations.reactivateUser(this.state.organization_name, this.state.userInfo.email);
                alert("User has been reactivated");
                if(this.props.onReactivate){
                    this.props.onReactivate();
                }
                this.refreshUserInfo();
            }else{
                alert("User is not inactive");
            }
        }catch(err){
            alert(err);
        }
    }

    tryLockUser = async ()=>{
        try{
            if(this.state.userInfo && !this.state.userInfo.locked){
                await SDK.Organizations.lockUser(this.state.organization_name, this.state.userInfo.email);
                alert("User has been locked");
                if(this.props.onInactivate){
                    this.props.onInactivate();
                }
                this.refreshUserInfo();
            }else{
                alert("User is already locked");
            }
        }catch(err){
            alert(err);
        }
    }
    
    tryUnlockUser = async ()=>{
        try{
            if(this.state.userInfo && this.state.userInfo.locked){
                await SDK.Organizations.unlockUser(this.state.organization_name, this.state.userInfo.email);
                alert("User has been reactivated");
                if(this.props.onReactivate){
                    this.props.onReactivate();
                }
                this.refreshUserInfo();
            }else{
                alert("User is not locked");
            }
        }catch(err){
            alert(err);
        }
    }

    render = ()=>{
        return (
            // <div className="card-deck">
                <Form.Row>
                    <Col md="3">
                        <Card>
                            <Card.Header>
                                User Info
                                {
                                    this.state.userInfo && this.state.userInfo.inactivated && !this.state.userInfo.locked?
                                    <Badge variant="danger" className="ml-1"><i className="fa-solid fa-ban"></i> Inactivated - {moment(this.state.userInfo.inactive_date).format('YYYY-MM-DD hh:mm:ss a') + ' by ' + this.state.userInfo.inactivated_by}</Badge>
                                    :''
                                }
                                {
                                    this.state.userInfo && this.state.userInfo.locked?
                                    <Badge variant="danger" className="ml-1"><i className="fa-solid fa-lock"></i> Locked - {moment(this.state.userInfo.locked_date).format('YYYY-MM-DD hh:mm:ss a') + ' by ' + this.state.userInfo.locked_by}</Badge>
                                    :''
                                }
                                <div className="header-actions">
                                <button className="close" id="newUser" title="New User" onClick={this.newUser}>+</button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                placeholder="Email"
                                                defaultValue=""
                                                value={this.state.userInfo.email||''}
                                                name="email"
                                                onChange={this.formChange}
                                                readOnly={!this.state.newUser}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid email format.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="6" controlId="validationCustom01">
                                            <Form.Label>First name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="First name"
                                                defaultValue=""
                                                name="first_name"
                                                value={this.state.userInfo.first_name||''}
                                                onChange={this.formChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="validationCustom02">
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Last name"
                                                defaultValue=""
                                                name="last_name"
                                                value={this.state.userInfo.last_name||''}
                                                onChange={this.formChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                required
                                                type="phone"
                                                placeholder="Phone number (xxx)xxx-xxxx"
                                                defaultValue=""
                                                name="phone_number"
                                                value={this.state.userInfo.phone_number||''}
                                                onChange={this.formChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid phone format.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Job Title</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Job Title"
                                                defaultValue=""
                                                name="job_title"
                                                value={this.state.userInfo.job_title||''}
                                                onChange={this.formChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    <Button type="submit" size="sm" className="btn-primary">Save</Button>
                                    {this.state.userInfo.verified === false?<Button className="ml-1" size="sm" variant="info" onClick={this.tryResendVerification}>Resend verification</Button>:null}
                                    {this.state.userInfo.verified === false?<Button className="ml-1" size="sm" variant="danger" onClick={this.tryDeleteUser}>Delete User</Button>:null}
                                    {(this.state.userInfo.verified === true && (!this.state.userInfo.inactivated && !this.state.userInfo.locked && this.state.userInfo.email !== Auth.userInfo.email))?<Button className="ml-1" size="sm" variant="danger" onClick={this.tryInactivateUser}><i className="fa-solid fa-ban"></i> Inactivate User</Button>:null}
                                    {this.state.userInfo && this.state.userInfo.inactivated && !this.state.userInfo.locked?<Button className="ml-1" size="sm" variant="success" onClick={this.tryReactivateUser}><i className="fa-solid fa-check"></i> Reactivate User</Button>:null}
                                    {(this.state.userInfo.verified === true && (!this.state.userInfo.locked && this.state.userInfo.email !== Auth.userInfo.email && Auth.userInfo.permissions.includes('EMPLOYEE_CUSTOMER_ADMIN')))?<Button className="ml-1" size="sm" variant="danger" onClick={this.tryLockUser}><i className="fa-solid fa-lock"></i> Lock User</Button>:null}
                                    {this.state.userInfo && this.state.userInfo.locked  && Auth.userInfo.permissions.includes('EMPLOYEE_CUSTOMER_ADMIN')?<Button className="ml-1" size="sm" variant="success" onClick={this.tryUnlockUser}><i className="fa-solid fa-lock-open"></i> Unlock User</Button>:null}
                                </Form>
                            </Card.Body>
                        </Card>

                    </Col>
                    <Col md="9">
                        <Tabs
                            defaultActiveKey="Roles"
                            className="mb-3"
                            >
                            <Tab eventKey="Roles" title="Roles">
                                <CardGroup>
                                        <Card>
                                            <Card.Header>
                                                Current Roles
                                            </Card.Header>
                                            <Card.Body className="d-flex flex-column">
                                                <div className="list-group" id="userRoles">
                                                    {
                                                        this.roleList(this.state.userInfo.roles,'userRoles')
                                                    }
                                                </div>
                                                <Button size="sm" className="mt-auto" id="removeRole" onClick={this.removeRole}>Remove Role</Button>
                                            </Card.Body>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                Assignable Roles
                                            </Card.Header>
                                            <Card.Body className="d-flex flex-column">
                                                <div className="list-group" id="assignableRoles">
                                                    {
                                                        this.roleList(this.state.newUser?[]:
                                                            this.state.roles.filter(x=>{
                                                                return (this.state.userInfo.roles ? !this.state.userInfo.roles.includes(x.role_code): true)
                                                                }).map(x=>x.role_code), 'assignableRoles')
                                                    }
                                                </div>
                                                <Button size="sm" className="mt-auto" id="addRole" onClick={this.addRole}>Add Role</Button>
                                            </Card.Body>
                                        </Card>
                                </CardGroup>
                            </Tab>
                            <Tab eventKey="Permissions" title="Permissions">
                                <CardGroup>
                                    <Card>
                                            <Card.Header>
                                                Current Permissions
                                            </Card.Header>
                                            <Card.Body className="d-flex flex-column">
                                                <div className="list-group" id="userPermissions">
                                                    {
                                                        this.permissionList(this.state.userInfo.permissions,'userPermissions')
                                                    }
                                                    {/* <this.PermissionList  permissions={this.state.userInfo.permissions} name="userPermissions"/> */}
                                                </div>
                                                <Button size="sm" className="mt-auto" id="removePermission" onClick={this.removePermission}>Remove Permission</Button>
                                            </Card.Body>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                Assignable Permissions
                                            </Card.Header>
                                            <Card.Body className="d-flex flex-column">
                                                <div className="list-group" id="assignablePermissions">
                                                    {
                                                        this.permissionList(this.state.newUser?[]:
                                                            this.state.permissions.filter(x=>{
                                                                return (this.state.userInfo.permissions ? !this.state.userInfo.permissions.includes(x.permission): true)
                                                                }).map(x=>x.permission), 'assignablePermissions')
                                                    }
                                                    {/* <this.PermissionList permissions=
                                                        {
                                                            this.state.newUser?[]:
                                                            this.state.permissions.filter(x=>{
                                                                return (this.state.userInfo.permissions ? !this.state.userInfo.permissions.includes(x.permission): true)
                                                                }).map(x=>x.permission)
                                                        } name="assignablePermissions"/> */}
                                                </div>
                                                <Button size="sm" className="mt-auto" id="addPermission" onClick={this.addPermission}>Add Permission</Button>
                                            </Card.Body>
                                        </Card>
                                </CardGroup>
                                {/* <Form.Row>
                                    <Col md="6">
                                        
                                    </Col>
                                    <Col md="6">
                                        
                                    </Col>
                                </Form.Row> */}
                            </Tab>
                        </Tabs>
                        
                        
                    </Col>
                    
                </Form.Row>
                    
            // </div>
        );
    }

}

export default UserInfo;