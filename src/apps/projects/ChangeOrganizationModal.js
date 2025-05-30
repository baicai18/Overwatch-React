import React from 'react';

import {Button, Modal, Form} from 'react-bootstrap';
import SDK from '../../sdk/SDK';


class ChangeOrganizationModal extends React.Component { 
    constructor(props){
        super(props);
        this.deliverableForm = React.createRef();
        this.state={
            show:props.show,
            organizations:[],
            organization:props.organization
            // quotationForm:{}
        }

    }

    async componentDidMount(){
        //this.refreshRequirements();
        try{
            let organizations = await SDK.Organizations.findOrganizations({q:`inactive_date=NULL`});
            this.setState({
                organizations:organizations
            })

        }catch(err){
            alert("Unable to retreive organization list");
            this.setState({
                organizations:[]
            })
        }
    }


    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Organization</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Form.Group>
                        <Form.Label>Organization</Form.Label>
                        <Form.Control as="select" name="organization"  onChange={this.controlChanged} value={this.state.organization}>
                            {
                                this.state.organizations.map((row)=>{
                                    return <option value={row.name}>{row.name}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Check name="overwriteRFQ" onChange={this.controlChanged} checked={this.state.overwriteRFQ} label="Overwrite RFQ"></Form.Check>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button> */}
                    <Button variant="primary" size="sm"onClick={this.updateOrganization}>
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
    showModal = (project_id, organization)=>{
        this.setState({
            show:true,
            project_id:project_id,
            organization:organization
        })
        
    }

    updateOrganization = async ()=>{
        // let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        try{
            let data = await SDK.Projects.updateOrganization(this.state.project_id, this.state.organization, this.state.overwriteRFQ);
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

export default ChangeOrganizationModal;