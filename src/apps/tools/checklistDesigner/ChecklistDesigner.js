import React from 'react';

import {Card, Col, Row} from 'react-bootstrap';
import ChecklistForm from '../checklist/ChecklistForm';
import ChecklistFields from './ChecklistFields';
import SDK from '../../../sdk/SDK';
import Auth from '../../../auth';

class ChecklistDesigner extends React.Component { 
    constructor(props){
        super(props);
        this.lastKey=0;

        let checklist = props.checklist || {formData:{}}
        if(checklist && checklist.formData.fields){
            checklist.formData.fields.forEach((x)=>{
                x.key = this.lastKey++;
            })

        }

        this.state={
            index:props.index,
            checklist:checklist,
            roles:[],
            updateKey:Math.random()
        }
        
    }
    componentDidMount(){
        this.updateRoles();
    }
    componentDidUpdate(props){
        if(props.checklist != this.props.checklist){
            
            this.setState({
                checklist:this.props.checklist,
                updateKey:Math.random()
            },()=>{
                this.forceUpdate();
            })
        }
    }

    updateRoles = async ()=>{
        try{
            // alert(JSON.stringify(Auth.userInfo));
            // alert(Auth.userInfo.organizationdetails.name)
            let data = await SDK.UserRoles.findUserRoles({q:`organization_name="` + Auth.userInfo.organizationdetails.name + `"`});
            this.setState({
                roles:data
            })
        }catch(err){

        }
    }

    render() {

        return (
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Card>
                                <Card.Header>Preview</Card.Header>
                            <Card.Body>
                                <ChecklistForm formDesign={this.state.checklist} formData={null} disableSave={true}/>
                                {/* {
                                    this.renderPreview()
                                } */}
                            </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <ChecklistFields formData={this.state.checklist.formData} onFormDataChanged={this.onFormDataChanged} updateKey={this.state.updateKey} roles={this.state.roles}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
        
    }
    onFormDataChanged = (formData,listMoved)=>{
        let updateKey = this.state.updateKey;
        if(listMoved){
            updateKey = Math.random();
        }
        this.setState({
            formData:formData,
            updateKey:updateKey
        },()=>{
            if(this.props.onFormDataChanged){
                this.props.onFormDataChanged(this.state.formData);
            }
            // this.forceUpdate();
        })
    }
}

export default ChecklistDesigner;