import React from 'react';
import {Form, Button, Col, Card, InputGroup} from 'react-bootstrap';
import {ExportCSVButton} from 'react-bootstrap-table';
import Dialog from 'react-bootstrap-dialog'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
import ReactGrid from '../tools/ReactGrid/ReactGrid'


class Settings extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            apiKeys:[],
            passwordData: {}
        }
        this.generateKey = this.generateKey.bind(this);
    }

    componentDidMount(){
        var me = this;
        this.refreshAPIKeys();
        this.apiKeys = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.formChange = this.formChange.bind(this);
        this.setValidated = this.setValidated.bind(this);
        this.generateKey = this.generateKey.bind(this);

        this.apiKeysColumns = [
            {key:"description",name:'Description'},
            {key:"apiKey",name:'apiKey'},
            {key:"active",name:'Active'},
        ]

    }
    refreshAPIKeys = async ()=>{
        try{
            let data = await SDK.Users.getAPIKeys();
            this.setState({
                apiKeys:data
            })
        }catch(err){
            alert(err);
        }
    }
    createCustomExportCSVButton = (onClick) => {
        return (
          <ExportCSVButton
            btnText='Export CSV'/>
        );
    }
    setActions = (cell, row)=>{
        return '<a className="btn btn-sm btn-secondary text-white" href="/organization/' + row.name + '"> OPEN</button>'
    }
    render = ()=>{
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-8">

                        <div className="card position-relative">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Profile Settings</h6>
                            </div>
                            <div className="card-body">
                                <p className="mb-0"></p>
                            </div>
                        </div>
                        <div className="card position-relative">
                            <div className="card-header py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="m-0 font-weight-bold text-primary">API Key</h6>
                                </div>
                            </div>
                            <Card.Body>
                                <Form.Row>
                                    <InputGroup className=" col-md-4">
                                        <Form.Control
                                            placeholder="Description"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            name=""
                                            onChange={(e)=>{this.setState({keyDescription:e.target.value})}}
                                        />
                                        <Button className="btn btn-secondary" size="sm" id="generateKey" title="Generate Key" onClick={this.generateKey}>Generate Key</Button>
                                    </InputGroup>
                                </Form.Row>
                            </Card.Body>
                            <div className="card-body">
                                
                                <ReactGrid
                                    ref={this.apiKeys}
                                    columns={this.apiKeysColumns}
                                    rowGetter={i=> this.state.apiKeys[i]}
                                    rowsCount={this.state.apiKeys.length} 
                                    sortable={true}
                                    export={false}
                                    buttons={[
                                        <Button size="sm" variant="success" className="ml-1" onClick={(e)=>{this.tryEnableKey()}}>Restore</Button>,
                                        <Button size="sm" variant="warning" className="ml-1" onClick={(e)=>{this.tryDisableKey()}}>Disable</Button>,
                                        <Button size="sm" variant="danger" className="ml-1" onClick={(e)=>{this.tryDeleteKey()}}>Delete</Button>,
                                        // <Button size="sm" variant="danger" className="ml-1" onClick={(e)=>{this.tryPushBack(this.requestedTable)}}>Cancel</Button>
                                    ]}
                                />
                                {/* <pre>{JSON.stringify(this.state.apiKeys)}</pre> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">

                        <div className="card position-relative">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Change Password</h6>
                        </div>
                        <div className="card-body">
                        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col} md="12">
                                        <Form.Control
                                            required
                                            type="password"
                                            placeholder="Old Password"
                                            defaultValue=""
                                            value={this.state.passwordData.oldPassword}
                                            name="oldPassword"
                                            onChange={this.formChange}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12">
                                        <Form.Control
                                            required
                                            type="password"
                                            placeholder="New Password"
                                            defaultValue=""
                                            value={this.state.passwordData.password}
                                            name="password"
                                            onChange={this.formChange}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="12">
                                        <Form.Control
                                            required
                                            type="password"
                                            placeholder="Re-enter New Password"
                                            defaultValue=""
                                            value={this.state.passwordData.password2}
                                            name="password2"
                                            onChange={this.formChange}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit" className="btn-primary btn-user btn-block">Save Password</Button>

                            </Form>
                        </div>
                        </div>

                    </div>

                </div>
                <Dialog ref={(el) => { this.dialog = el }} />
            </div>
        );
    }

    generateKey = async()=>{
        try{
            if(this.state.keyDescription && this.state.keyDescription !== ''){
                let newKey = await SDK.Users.generateAPIKey(this.state.keyDescription);
                alert(JSON.stringify(newKey));
                this.refreshAPIKeys();
                
            }else{
                alert("Please enter key description");
            }
        }catch(err){
            alert(err);
        }
        // var me = this;
        // this.dialog.show({
        //     title: 'Confirm regenerate API key?',
        //     body: 'Regenerating API key will cause the previous key to become unusable? This cannot be undone.',
        //     actions: [
        //       Dialog.CancelAction(),
        //       Dialog.OKAction(()=>{
        //         Users.generateAPIKey()
        //         .then(data=>{
        //             Users.getAPIKey()
        //             .then(data=>{
        //                 me.setState({
        //                     apiKey:data.apiKey
        //                 })
        //             })
        //             .catch(err=>{
        //                 console.log(err);
        //             })
        //         })
        //         .catch(err=>{
        //             console.log(err);
        //         })
        //       })
        //     ],
        //     bsSize: 'small',
        //     onHide: (dialog) => {
        //       dialog.hide()
        //     }
        //   })

        
    }
    tryEnableKey = async()=>{
        let rows = this.apiKeys.current.getSelectedRows();
        if(rows.length > 0){
            // alert(rows[0].row._id)
            if(!rows[0].row.active){
                this.enableKey(rows[0].row._id)
            }else{
                alert("Key is already active")
            }
        }
    }
    enableKey = async(id)=>{
        // var me = this;
        this.dialog.show({
            title: 'Confirm restore API key?',
            body: 'Are you sure you want to restore API Key?',
            actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(async ()=>{
                try{
                    await SDK.Users.enableAPIKey(id);
                    this.refreshAPIKeys();

                }catch(err){
                    alert(err);
                }
              })
            ],
            bsSize: 'small',
            onHide: (dialog) => {
              dialog.hide()
            }
        })
    }
    tryDisableKey = async()=>{
        let rows = this.apiKeys.current.getSelectedRows();
        if(rows.length > 0){
            // alert(rows[0].row._id)
            if(rows[0].row.active){
                this.disableKey(rows[0].row._id)
            }else{
                alert("Key is already disabled")
            }
            
        }
    }
    disableKey = async(id)=>{
        // var me = this;
        this.dialog.show({
            title: 'Confirm disable API key?',
            body: 'Are you sure you want to disable API Key?',
            actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(async ()=>{
                try{
                    await SDK.Users.disableAPIKey(id);
                    this.refreshAPIKeys();

                }catch(err){
                    alert(err);
                }
              })
            ],
            bsSize: 'small',
            onHide: (dialog) => {
              dialog.hide()
            }
        })
    }
    tryDeleteKey = async()=>{
        let rows = this.apiKeys.current.getSelectedRows();
        if(rows.length > 0){
            // alert(rows[0].row._id)
            this.deleteKey(rows[0].row._id)
        }
    }
    deleteKey = async(id)=>{
        // var me = this;
        this.dialog.show({
            title: 'Confirm delete API key?',
            body: 'Are you sure you want to delete API Key? This cannot be undone',
            actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(async ()=>{
                try{
                    await SDK.Users.deleteAPIKey(id);
                    this.refreshAPIKeys();

                }catch(err){
                    alert(err);
                }
              })
            ],
            bsSize: 'small',
            onHide: (dialog) => {
              dialog.hide()
            }
        })
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
            SDK.Users.changePassword(this.state.passwordData)
            .then(data=>{
                alert("Saved");
                this.setState({
                    passwordData:{}
                })
            })
            .catch(err=>{
                console.log(err);
                alert(err);
            })
            
            
        }
        event.preventDefault();
        event.stopPropagation();
    };
    
    setValidated(value){
        this.setState({
            validated: value
        });
    }
    formChange = event =>{

        var item = this.state.passwordData;
        item[event.target.name] = event.target.value;
        this.setState({
            passwordData:item
        })
    }
}

export default  Settings;