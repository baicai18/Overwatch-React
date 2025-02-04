import React from 'react';
import {Form, Col, Button, Card, Badge} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import Auth from '../../auth';
import moment from 'moment';

class RoleInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            organization_name: props.organization_name,
            newRole: true,
            validated:false,
            roleInfo:{organization:props.organization_name},
            permissions:[],
            assignablePermissions:[],
            userPermissions:[]
        }
    }

    componentDidMount(){
        this.updatePermissions();
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

    PermissionList = (props) =>{
        return <div>
            {
                props.permissions? 
                props.permissions.map((permission)=>{
                    return <button type="button" className="list-group-item list-group-item-action" data-field={props.name} onClick={this.permissionClick} key={permission}>{permission}</button>
                    
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

    
    handleSubmit = async (event) => {
        try{
            
            event.preventDefault();
            event.stopPropagation();
            if(this.state.newRole){
                let data = await SDK.Organizations.saveRole(this.state.organization_name, this.state.roleInfo);

                
                this.setState({
                    newRole:false,
                    roleInfo:data
                },()=>{
                    if(this.props.onSave){
                        this.props.onSave(this.state.roleInfo);
                    }
                })
                // if(this.props.onSave){
                //     this.props.onSave(this.state.roleInfo);
                // }
            }else{
                let data = await SDK.UserRoles.updateRole(this.state.organization_name, this.state.roleInfo);
                this.setState({
                    roleInfo:data
                },()=>{
                    if(this.props.onSave){
                        this.props.onSave(this.state.roleInfo);
                    }
                })
                // if(this.props.onSave){
                //     this.props.onSave(this.state.roleInfo);
                // }
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
        const form = event.currentTarget;
        

        
        // if (form.checkValidity() === false) {
        //     this.setValidated(true);
        //     event.preventDefault();
        //     event.stopPropagation();
        // }else{
            
            
            
        // }
        // event.preventDefault();
        // event.stopPropagation();
    };
    
    setValidated=(value)=>{
        this.setState({
            validated: value
        });
    }
    formChange=(event)=>{

        var item = this.state.roleInfo;
        item[event.target.name] = event.target.value;
        this.setState({
            roleInfo:item
        })
    }

    newUser = (event) =>{
        this.setState({
            newRole:true,
            roleInfo:{
                role_code:'',
                description:'',
                organization:this.state.organization_name
            }
        })
    }
    addPermission = (event) =>{
        var me = this;
        if(this.state.assignablePermissions.length > 0){
            //have items

            var promises = this.state.assignablePermissions.map(permission=>{
                return SDK.UserRoles.addPermission(me.state.roleInfo._id, permission)
            })

            Promise.all(promises)
            .then(data=>{
                SDK.UserRoles.getUserRole(me.state.roleInfo._id)
                .then(data=>{
                    me.setState({
                        roleInfo:data,
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
    
    removePermission = (event) =>{
        var me = this;
        if(this.state.userPermissions.length > 0){
            //have items

            var promises = this.state.userPermissions.map(permission=>{
                return SDK.UserRoles.removePermission(me.state.roleInfo._id, permission)
            })

            Promise.all(promises)
            .then(data=>{
                SDK.UserRoles.getUserRole(me.state.roleInfo._id)
                .then(data=>{
                    me.setState({
                        roleInfo:data,
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
    refreshroleInfo = ()=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let roleInfo = await SDK.Organizations.getUser(this.state.roleInfo.role_code);
                this.setState({
                    roleInfo:roleInfo || {organization:this.props.organization_name},
                })
            }catch(err){
                alert("Unable to pull user info");
                this.setState({
                    roleInfo:{organization:this.props.organization_name},
                })
            }
        })
    }



    tryDeleteRole = async ()=>{
        try{
            if(this.state.roleInfo && this.state.roleInfo._id){
                await SDK.UserRoles.deleteRole(this.state.organization_name, this.state.roleInfo.role_code);
                alert("Role has been deleted");
                if(this.props.onDeleted){
                    this.props.onDeleted();
                }
                this.setState({
                    newRole:true,
                    roleInfo:{organization:this.props.organization_name},
                })
            }else{
                alert("No Role selected");
            }
        }catch(err){
            alert(err);
        }
    }

    tryInactivateRole = async ()=>{
        try{
            if(this.state.roleInfo && !this.state.roleInfo.inactivated){
                await SDK.UserRoles.inactivateRole(this.state.organization_name, this.state.roleInfo.role_code);
                alert("Role has been inactivated");
                if(this.props.onInactivate){
                    this.props.onInactivate();
                }
                this.refreshroleInfo();
            }else{
                alert("Role is already inactivated");
            }
        }catch(err){
            alert(err);
        }
    }
    
    tryReactivateRole = async ()=>{
        try{
            if(this.state.roleInfo && this.state.roleInfo.inactivated){
                await SDK.UserRoles.reactivateRole(this.state.organization_name, this.state.roleInfo.role_code);
                alert("User has been reactivated");
                if(this.props.onReactivate){
                    this.props.onReactivate();
                }
                this.refreshroleInfo();
            }else{
                alert("Role is not inactive");
            }
        }catch(err){
            alert(err);
        }
    }

    tryLockUser = async ()=>{
        try{
            if(this.state.roleInfo && !this.state.roleInfo.locked){
                await SDK.Organizations.lockUser(this.state.organization_name, this.state.roleInfo.role_code);
                alert("User has been locked");
                if(this.props.onInactivate){
                    this.props.onInactivate();
                }
                this.refreshroleInfo();
            }else{
                alert("User is already locked");
            }
        }catch(err){
            alert(err);
        }
    }
    
    tryUnlockUser = async ()=>{
        try{
            if(this.state.roleInfo && this.state.roleInfo.locked){
                await SDK.Organizations.unlockUser(this.state.organization_name, this.state.roleInfo.role_code);
                alert("User has been reactivated");
                if(this.props.onReactivate){
                    this.props.onReactivate();
                }
                this.refreshroleInfo();
            }else{
                alert("User is not locked");
            }
        }catch(err){
            alert(err);
        }
    }

    render = ()=>{
        return (
            <div className="card-deck">
                    <Card>
                        <Card.Header>
                            User Info
                            {/* {
                                this.state.roleInfo && this.state.roleInfo.inactivated && !this.state.roleInfo.locked?
                                <Badge variant="danger" className="ml-1"><i className="fa-solid fa-ban"></i> Inactivated - {moment(this.state.roleInfo.inactive_date).format('YYYY-MM-DD hh:mm:ss a') + ' by ' + this.state.roleInfo.inactivated_by}</Badge>
                                :''
                            } */}
                            {
                                this.state.roleInfo && this.state.roleInfo.locked?
                                <Badge variant="danger" className="ml-1"><i className="fa-solid fa-lock"></i> Locked - {moment(this.state.roleInfo.locked_date).format('YYYY-MM-DD hh:mm:ss a') + ' by ' + this.state.roleInfo.locked_by}</Badge>
                                :''
                            }
                            <div className="header-actions">
                            <button className="close" id="newUser" title="New Role" onClick={this.newUser}>+</button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                        <Form.Label>role_code</Form.Label>
                                        <Form.Control
                                            required
                                            type="role_code"
                                            placeholder="role_code"
                                            defaultValue=""
                                            value={this.state.roleInfo.role_code||''}
                                            name="role_code"
                                            onChange={this.formChange}
                                            readOnly={!this.state.newRole}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Please enter a valid role_code format.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Description"
                                            defaultValue=""
                                            name="description"
                                            value={this.state.roleInfo.description||''}
                                            onChange={this.formChange}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit" size="sm" className="btn-primary">Save</Button>
                                {(this.state.roleInfo.role_code && !this.state.newRole)?<Button className="ml-1" size="sm" variant="danger" onClick={this.tryDeleteRole}>Delete Role</Button>:null}
                                {(this.state.roleInfo.verified === true && (!this.state.roleInfo.inactivated && !this.state.roleInfo.locked && this.state.roleInfo.role_code !== Auth.roleInfo.role_code))?<Button className="ml-1" size="sm" variant="danger" onClick={this.tryInactivateUser}><i className="fa-solid fa-ban"></i> Inactivate User</Button>:null}
                                {this.state.roleInfo && this.state.roleInfo.inactivated && !this.state.roleInfo.locked?<Button className="ml-1" size="sm" variant="success" onClick={this.tryReactivateUser}><i className="fa-solid fa-check"></i> Reactivate User</Button>:null}
                                {(this.state.roleInfo.verified === true && (!this.state.roleInfo.locked && this.state.roleInfo.role_code !== Auth.roleInfo.role_code && Auth.roleInfo.permissions.includes('EMPLOYEE_CUSTOMER_ADMIN')))?<Button className="ml-1" size="sm" variant="danger" onClick={this.tryLockUser}><i className="fa-solid fa-lock"></i> Lock User</Button>:null}
                                {this.state.roleInfo && this.state.roleInfo.locked  && Auth.roleInfo.permissions.includes('EMPLOYEE_CUSTOMER_ADMIN')?<Button className="ml-1" size="sm" variant="success" onClick={this.tryUnlockUser}><i className="fa-solid fa-lock-open"></i> Unlock User</Button>:null}
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            Current Permissions
                        </Card.Header>
                        <Card.Body className="d-flex flex-column">
                            <div className="list-group" id="userPermissions">
                                {
                                    this.permissionList(this.state.roleInfo.permissions,'userPermissions')
                                }
                                {/* <this.PermissionList  permissions={this.state.roleInfo.permissions} name="userPermissions"/> */}
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
                                    this.permissionList(this.state.newRole?[]:
                                        this.state.permissions.filter(x=>{
                                            return (this.state.roleInfo.permissions ? !this.state.roleInfo.permissions.includes(x.permission): true)
                                            }).map(x=>x.permission), 'assignablePermissions')
                                }
                                {/* <this.PermissionList permissions=
                                    {
                                        this.state.newRole?[]:
                                        this.state.permissions.filter(x=>{
                                            return (this.state.roleInfo.permissions ? !this.state.roleInfo.permissions.includes(x.permission): true)
                                            }).map(x=>x.permission)
                                    } name="assignablePermissions"/> */}
                            </div>
                            <Button size="sm" className="mt-auto" id="addPermission" onClick={this.addPermission}>Add Permission</Button>
                        </Card.Body>
                    </Card>
            </div>
        );
    }

}

export default RoleInfo;