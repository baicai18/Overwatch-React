import React from 'react';

import {Card, Col, Row} from 'react-bootstrap';
import DeliverableForm from '../deliverableForm/DeliverableForm';
import FormFields from './FormFields';

class FormDesigner extends React.Component { 
    constructor(props){
        super(props);
        this.lastKey=0;

        let formData = props.formData || {}
        if(formData.fields){
            formData.fields.forEach((x)=>{
                x.key = this.lastKey++;
            })

        }

        this.state={
            index:props.index,
            formData:formData,
            updateKey:Math.random()
        }
        
    }
    componentDidMount(){
    }
    componentDidUpdate(props){
        if(props.formData != this.props.formData){
            
            this.setState({
                formData:this.props.formData,
                updateKey:Math.random()
            },()=>{
                this.forceUpdate();
            })
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
                                <DeliverableForm formDesign={this.state.formData} formData={null}/>
                                {/* {
                                    this.renderPreview()
                                } */}
                            </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <FormFields formData={this.state.formData} onFormDataChanged={this.onFormDataChanged} updateKey={this.state.updateKey}/>
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

export default FormDesigner;