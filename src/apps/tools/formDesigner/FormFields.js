import React from 'react';

import {Card,Form} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormField from './FormField';
import { text } from '@fortawesome/fontawesome-svg-core';
import DraggableList from '../DraggableList';

class FormFields extends React.Component { 
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
        }
        
    }
    componentDidUpdate(props){
        if(props.formData !== this.props.formData && this.props.updateKey !== props.updateKey){
            let formData = this.props.formData || {}
            if(formData.fields){
                formData.fields.forEach((x)=>{
                    if(!x.key){
                        x.key = this.lastKey++;
                    }
                    
                })
            }
            // alert(JSON.stringify(formData.fields))
            this.setState({
                formData:this.props.formData
            })
        }
    }

    renderPreview = ()=>{
        if(this.state.formData.display){
            
        }else if(this.state.formData.fields){
            return (
                <Form.Row>
                {
                    this.state.formData.fields.map((x,index)=>{
                        var controlType;
                        var type;
                        switch(x.type){
                            case 'NewLine':
                                controlType = "textarea";
                                type = ""
                                break;
                            case 'Text':
                                controlType = "input";
                                type = "text"
                                break;
                            case 'Date':
                                controlType = "input";
                                type = "date"
                                break;
                            case 'Number':
                                controlType = "input";
                                type = "number"
                                break;
                            case 'Select':
                                controlType = "select";
                                type = ""
                                break;
                            case 'TextArea':
                                controlType = "textarea";
                                type = ""
                                break;
                            default:
                                controlType = "input";
                                type = "text"
                                break;
                        }
                        return (
                            <Form.Group className="col-auto">
                                <Form.Label>{x.name}</Form.Label>
                                <Form.Control as={controlType} type={type} name={x.name} ></Form.Control>
                            </Form.Group>
                        )
                    })
                }
                </Form.Row>
            )
        }else{
            return '';
        }
    }

    onListChanged = (list)=>{
        let formData = this.state.formData;
        formData.fields = list;
        this.setState({
            formData:formData
        },()=>{
            // alert(JSON.stringify(this.state.formData.fields))
            if(this.props.onFormDataChanged){

                let returnForm = Object.assign({},this.state.formData);
                returnForm.fields.forEach((x)=>{
                    delete x.key;
                })
                this.props.onFormDataChanged(returnForm,true)
            }
            this.forceUpdate()
        })
    }
    
    
    onDeleteField=(index, field)=>{
        var formData = this.state.formData;
        formData.fields.splice(index,1);
        this.setState({
            formData:formData
        },()=>{
            if(this.props.onFormDataChanged){

                let returnForm = Object.assign({},this.state.formData);
                returnForm.fields.forEach((x)=>{
                    delete x.key;
                })
                this.props.onFormDataChanged(returnForm)
            }
            this.forceUpdate()
        })
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    Fields
                    <div className="header-actions">
                        <a onClick={this.newField}>
                            <i class="fas fa-plus"/>
                            {/* <FontAwesomeIcon icon="plus"/> */}
                        </a>
                    </div>
                </Card.Header>
                <Card.Body>
                <DraggableList 
                    key={this.state.formData?this.state.formData.fields:null} 
                    keyName={"NULL"}
                    list={this.state.formData?this.state.formData.fields:[]} 
                    onListChanged={this.onListChanged}
                    mapFunction={(x,index)=>{
                        return <FormField key={index.toString() + x.key} index={index} field={x} onDataChanged={this.onFieldDataChanged} onDeleteField={this.onDeleteField}/>
                        }
                    }/>
                </Card.Body>
                {/* <Card.Body>
                    <pre>
                        {JSON.stringify(this.state.formData,null,2)}
                    </pre>
                </Card.Body> */}
            </Card>
        )
        
    }

    newField = ()=>{
        var formData = this.state.formData;
        if(formData == null){
            formData = {}
        }
        if(formData.fields == null){
            formData.fields = [];
        }
        formData.fields.push({
            key:this.lastKey++,
            type:text,
            colspan:12
        })
        this.setState({
            formData:formData
        },()=>{
            if(this.props.onFormDataChanged){

                let returnForm = Object.assign({},this.state.formData);
                returnForm.fields.forEach((x)=>{
                    delete x.key;
                })
                this.props.onFormDataChanged(returnForm)
            }
        });
    }

    onFieldDataChanged = (index, field)=>{
        var formData = this.state.formData;
        formData.fields[index] = field;
        this.setState({
            formData: formData
        },()=>{
            if(this.props.onFormDataChanged){
                let returnForm = Object.assign({},this.state.formData);
                returnForm.fields.forEach((x)=>{
                    delete x.key;
                })
                this.props.onFormDataChanged(returnForm)
            }
        })
        
    }
}

export default FormFields;