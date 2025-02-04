import React from 'react';
import {Form} from 'react-bootstrap';
import FormField from './FormField';


class DeliverableForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            formDesign:props.formDesign||{},
            formData:props.formData||{},
            originalData:props.formData||{},
            readOnly:props.readOnly
        }

        this.fieldRefs = [];

    }

    componentDidUpdate(props){
        if(props.formDesign != this.state.formDesign || props.formData != this.props.formData || props.readOnly !== this.props.readOnly){
            let updateData = this.state.formData;
            if(this.props.readOnly){
                updateData = this.state.originalData;
            }
            if(props.formData !== this.props.formData){
                updateData = this.props.formData;
            }
            this.setState({
                formDesign:this.props.formDesign,
                // formData:this.props.formData || this.state.formData,
                formData:updateData,
                readOnly:this.props.readOnly
            }, ()=>{
                this.forceUpdate();
                // console.log("FORMDATA CHANGED: " + JSON.stringify(this.state.formData));
            })
        }
    }

    getFormData = ()=>{
        return this.state.formData;
    }

    commitData = ()=>{
        this.fieldRefs.forEach((ref)=>{
            ref.current.commitData();
        })
    }

    handleFieldChange = (data, field, index) =>{
        let formData = this.state.formData || {};
        switch(field.type){
            case "Text":
                formData[field.name] = data;
                break;
            case "Number":
                formData[field.name] = parseFloat(data);
                break;
            case "Date":
                formData[field.name] = new Date(data);
                break;
            case "Select":
                formData[field.name] = data;
                break;
            case "TextArea":
                formData[field.name] = data;
                break;
            case "Checkbox":
                formData[field.name] = data;
                break;
            case "List":
                formData[field.name] = data;
                break;
            case "Object":
                formData[field.name] = data;
                break;
            default:
                break;
        }
        //formData[field.name] = data;
        this.setState({
            formData:formData
        },()=>{
            console.log(":FORM:" + JSON.stringify(this.state.formData));
            if(this.props.onChange){
                this.props.onChange(this.state.formData);
            }
        })
        
            
    }

    render = ()=>{
        this.fieldRefs = [];
        return (
            <div>
                <Form.Row>
                {
                    this.state.formDesign?
                    this.state.formDesign.fields?
                    this.state.formDesign.fields.map((x,index)=>{
                        let ref = React.createRef();
                        this.fieldRefs.push(ref);
                        return <FormField ref={ref} readOnly={this.state.readOnly} key={x.name + index.toString()} field={x} data={this.state.formData?this.state.formData[x.name]:''} onChange={(data)=>{this.handleFieldChange(data,x,index)}} onModified={()=>{if(this.props.onModified)this.props.onModified()}}/>
                    })
                    :''
                    :''
                }
                </Form.Row>
                {/* <pre>{JSON.stringify(this.state.formDesign,null, 
                                    2)}</pre> */}
                                    
                {/* <pre>{JSON.stringify(this.state.deliverable,function (key, value) {
                                        if (key == "parentNode") {
                                            return undefined;
                                        }
                                        return value;
                                    }, 
                                    2)}</pre> */}
            </div>
        )
    }
    
}

export default  DeliverableForm;