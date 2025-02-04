import React from 'react';
import {Form, Col, Card,Row} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeliverableForm from './DeliverableForm';
import DraggableList from '../DraggableList';
import auth from '../../../auth';
import moment from 'moment'


class FormField extends React.Component{

    constructor(props){
        super(props);
        this.lastKey=0;

        let data = props.data;
        if(Array.isArray(data)){
            data.forEach(x=>{
                x.key=this.lastKey++;
            })
        }

        this.state = {
            show:false,
            field:props.field||{},
            data:data,
            originalData:data,
            readOnly:props.readOnly
        }

        if(this.state.field.type === 'Date' && this.state.field.defaultToday){
            this.state.data = this.state.data || new Date();
        }
        if(this.state.field.defaultValue){
            this.state.data = this.state.data || this.state.field.defaultValue
        }
        this.props.onChange(this.state.data)


    }

    componentDidUpdate(props){
        if(props.readOnly !== this.props.readOnly){
            let updateData = this.state.data;
            if(this.props.readOnly){
                updateData = this.state.originalData;
            }
            this.setState({
                data:updateData,
                readOnly:this.props.readOnly
            })
        }
    }

    onListChanged = (list)=>{
        this.setState({
            data:list
        },()=>{
            if(this.props.onChange){
                let retData;

                if(Array.isArray(this.state.data)){
                    retData = this.state.data.slice();
                    // retData.forEach(x=>{
                    //     delete x.key;
                    // })
                }else if(typeof this.state.data === 'object'){
                    retData = Object.assign({},this.state.data)
                }else{
                    retData = this.state.data;
                }
                this.props.onChange(retData);
            }
        })
    }

    commitData = ()=>{
        this.setState({
            originalData:this.state.data
        })
    }

    handleChange = (e) =>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.value;
        switch(target.type){
            case 'checkbox':
                value = target.checked;
                break;
            case 'number':
                value = Number(value);
                break;
            case 'date':
                value = moment(value).valueOf()
                break;
            case 'datetime-local':
                value = moment(value).valueOf()
                break;
        }
        if(this.state.field.saveTimestamp){
            data = {
                value:value,
                timestamp:new Date(),
                user:auth.userInfo.email
            }
        }else{
            data = value;
        }
        
        this.setState({
            data:data
        },()=>{
            if(this.props.onChange){
                let retData;

                if(Array.isArray(this.state.data)){
                    retData = this.state.data.slice();
                    // retData.forEach(x=>{
                    //     delete x.key;
                    // })
                }else if(typeof this.state.data === 'object'){
                    retData = Object.assign({},this.state.data)
                }else{
                    retData = this.state.data;
                }
                this.props.onChange(retData);
            }
        })
        if(this.props.onModified){
            this.props.onModified();
        }
        
            
            
    }
    timestampChanged = (e) =>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.value;
        switch(target.type){
            case 'checkbox':
                value = target.checked;
                break;
            case 'number':
                value = Number(value);
                break;
            case 'date':
                value = moment(value).valueOf()
                break;
            case 'datetime-local':
                value = moment(value).valueOf()
                break;
        }
        if(this.state.field.saveTimestamp){
            if(data){
                data.timestamp = value;
            }else{
                data = {
                    value:null,
                    timestamp:value,
                    user:auth.userInfo.email
                }
            }
            
        }else{
            data = value;
        }
        
        this.setState({
            data:data
        },()=>{
            if(this.props.onChange){
                let retData;

                if(Array.isArray(this.state.data)){
                    retData = this.state.data.slice();
                    // retData.forEach(x=>{
                    //     delete x.key;
                    // })
                }else if(typeof this.state.data === 'object'){
                    retData = Object.assign({},this.state.data)
                }else{
                    retData = this.state.data;
                }
                this.props.onChange(retData);
            }
        })
        
            
            
    }

    onListFieldChanged = (formData,index)=>{
        let data = this.state.data;
        data[index] = formData;
        this.setState({
            data:data
        },()=>{
            if(this.props.onChange){
                let retData;

                if(Array.isArray(this.state.data)){
                    retData = this.state.data.slice();
                    // retData.forEach(x=>{
                    //     delete x.key;
                    // })
                }else if(typeof this.state.data === 'object'){
                    retData = Object.assign({},this.state.data)
                }else{
                    retData = this.state.data;
                }
                this.props.onChange(retData);
            }
        })
    }

    onObjectFieldChanged = (formData)=>{
        let data = this.state.data;
        data = formData;
        this.setState({
            data:data
        },()=>{
            if(this.props.onChange){
                let retData;

                if(Array.isArray(this.state.data)){
                    retData = this.state.data.slice();
                    // retData.forEach(x=>{
                    //     delete x.key;
                    // })
                }else if(typeof this.state.data === 'object'){
                    retData = Object.assign({},this.state.data)
                }else{
                    retData = this.state.data;
                }
                this.props.onChange(retData);
            }
        })
    }

    newListValue = ()=>{
        let data = this.state.data;
        if(Array.isArray(data)){
            data.push({
                key:this.lastKey++
            });
        }else{
            data = [{
                key:this.lastKey++
            }];
        }
        this.setState({
            data:data
        },()=>{
            console.log(this.state.data);
            if(this.props.onChange){
                let retData;

                if(Array.isArray(this.state.data)){
                    retData = this.state.data.slice();
                    // retData.forEach(x=>{
                    //     delete x.key;
                    // })
                }else{
                    retData = Object.assign({},this.state.data)
                }
                this.props.onChange(retData);
            }
        })
    }
    render = ()=>{
        var controlType;
        var type;
        switch(this.state.field.type){
            case 'Blank':
                controlType = "div";
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
            case 'Checkbox':
                controlType = "input";
                type = "checkbox"
                break;
            default:
                controlType = "input";
                type = "text"
                break;
        }
        
        if(this.state.field.type==='List'){
            return (
                <Col md={this.state.field.colspan}>
                    <Card>
                        <Card.Header>
                            {this.state.field.name + (this.state.field.required&&!this.state.readOnly?' *':'')}
                            <div className="header-actions">
                                <a onClick={this.newListValue}>
                                    <i class="fas fa-plus"/>
                                    {/* <FontAwesomeIcon icon="plus"/> */}
                                </a>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <DraggableList 
                                key={this.state.data} 
                                keyName={"NULL"}
                                list={this.state.data} 
                                onListChanged={this.onListChanged}
                                mapFunction={(x,index)=>{
                                    return <Card>
                                                <Card.Body>
                                                    <DeliverableForm readOnly={this.state.readOnly} key={x.key} formDesign={this.state.field.formData} formData={x} onChange={(formData)=>{this.onListFieldChanged(formData,index)}}/>
                                                </Card.Body>
                                            </Card>
                                    }
                                }
                            />
                        </Card.Body>
                    </Card>
                </Col>
            )
        }else if(this.state.field.type==='Object'){
            return (
                <Col md={this.state.field.colspan}>
                    <Card>
                        <Card.Header>
                            {this.state.field.name + (this.state.field.required?' *':'')}
                            {/* <div className="header-actions">
                                <a onClick={this.newListValue}>
                                    <FontAwesomeIcon icon="plus"/>
                                </a>
                            </div> */}
                        </Card.Header>
                        <Card.Body>
                            <Card>
                                <Card.Body>
                                    <DeliverableForm readOnly={this.state.readOnly} key={this.state.field.formData} formDesign={this.state.field.formData} formData={this.state.data} onChange={(formData)=>{this.onObjectFieldChanged(formData)}}/>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
            )
        }else{
            if(this.state.field.saveTimestamp){
                return (
                    <Col md={this.state.field.colspan}>
                        <Form.Row>
                            <Form.Group as={Col} md={4} >
                            {
                                this.state.field.type==='List'?
                                '':
                                <Form.Label>{this.state.field.name + (this.state.field.required&&!this.state.readOnly?' *':'')}</Form.Label>
                            }
                            {
                                this.state.field.type==='Blank'?
                                '':
                                this.state.field.type==='Date'?
                                <Form.Control readOnly={this.state.readOnly} size="sm"  type={type} name={this.state.field.name} value={this.state.data?moment(this.state.data.value).format('YYYY-MM-DD'):''} onChange={this.handleChange}></Form.Control>
                                :this.state.field.type==='Checkbox'?
                                <Form.Check readOnly={this.state.readOnly} size="sm"  type={type} name={this.state.field.name} value="true" onChange={this.handleChange} checked={this.state.field.data}></Form.Check>
                                :this.state.field.type==='Select'?
                                <Form.Control readOnly={this.state.readOnly} size="sm" as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
                                    <option></option>
                                    {
                                    
                                    this.state.field.selectValues?
                                    this.state.field.selectValues.map((x,index)=>{
                                        return <option key={x}>{x}</option>
                                    })
                                    :null
                                    }
                                
                                </Form.Control>
                                :
                                <Form.Control readOnly={this.state.readOnly} size="sm" as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data.value:''} >
                                </Form.Control>
                            }
                            
                            </Form.Group>
                            <Form.Group as={Col} md={4} >
                                <Form.Label>Timestamp</Form.Label>
                                <Form.Control readOnly={this.state.readOnly} size="sm" type="datetime-local" value={this.state.data?moment.utc(this.state.data.timestamp).local().format('YYYY-MM-DDTHH:mm'):''} onChange={this.timestampChanged}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} md={4} >
                                <Form.Label>User</Form.Label>
                                <Form.Control readOnly={true} size="sm" type="text" value={this.state.data?this.state.data.user:''} >
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        
                        {/* <pre>
                            {JSON.stringify(this.state.data,null,2)}
                        </pre> */}
                    </Col>
                    
                )
            }else{
                return (
                    <Form.Group as={Col} md={this.state.field.colspan} >
                        {
                            this.state.field.type==='List'?
                            '':
                            <Form.Label>{this.state.field.name + (this.state.field.required&&!this.state.readOnly?' *':'')}</Form.Label>
                        }
                        {
                            this.state.field.type==='Blank'?
                            '':
                            this.state.field.type==='Date'?
                            <Form.Control readOnly={this.state.readOnly}  type={type} name={this.state.field.name} value={this.state.data?moment.utc(this.state.data).local().format('YYYY-MM-DD'):''} onChange={this.handleChange}></Form.Control>
                            :this.state.field.type==='Checkbox'?
                            <Form.Check readOnly={this.state.readOnly}  type={type} name={this.state.field.name} value="true" onChange={this.handleChange} checked={this.state.field.data}></Form.Check>
                            :this.state.field.type==='Select'?
                            <Form.Control readOnly={this.state.readOnly} as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
                                <option></option>
                                {
                                
                                this.state.field.selectValues?
                                this.state.field.selectValues.map((x,index)=>{
                                    return <option key={x}>{x}</option>
                                })
                                :null
                                }
                            
                            </Form.Control>
                            :
                            <Form.Control readOnly={this.state.readOnly} as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
                            </Form.Control>
                        }
                    </Form.Group>
                )

            }
            // return (
            //     <Form.Group as={Col} md={this.state.field.colspan} >
            //         {
            //             this.state.field.type==='List'?
            //             '':
            //             <Form.Label>{this.state.field.name}</Form.Label>
            //         }
            //         {
            //             this.state.field.type==='Blank'?
            //             '':
            //             this.state.field.type==='Checkbox'?
            //             <Form.Check readOnly={this.state.readOnly}  type={type} name={this.state.field.name} value="true" onChange={this.handleChange} checked={this.state.field.data}></Form.Check>
            //             :this.state.field.type==='Select'?
            //             <Form.Control readOnly={this.state.readOnly} as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
            //                 <option></option>
            //                 {
                            
            //                 this.state.field.selectValues?
            //                 this.state.field.selectValues.map((x,index)=>{
            //                     return <option key={x}>{x}</option>
            //                 })
            //                 :null
            //                 }
                        
            //             </Form.Control>
            //             :
            //             <Form.Control readOnly={this.state.readOnly} as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
            //             </Form.Control>
            //         }
                    
            //     </Form.Group>
            // )
        }
        
    }
    
}

export default  FormField;