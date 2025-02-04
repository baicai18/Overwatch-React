import React from 'react';
import {Form, Col, Card,Row, Button, Badge} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ChecklistForm from './ChecklistForm';
import DraggableList from '../DraggableList';
import auth from '../../../auth';
import moment from 'moment'
import SDK from '../../../sdk/SDK';


class ChecklistField extends React.Component{

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
            checklistId:props.checklistId,
            checklistDesignId:props.checklistDesignId,
            checklistItem:props.checklistItem,
            field:props.field||{},
            data:data,
            originalData:data,
            readOnly:props.readOnly,
            disableSave:props.disableSave,
            changed:false,
        }

        if(this.state.field.type === 'Date'){
            this.state.data = this.state.data || new Date();
        }
        if(this.state.field.defaultValue){
            this.state.data = this.state.data || this.state.field.defaultValue
        }


    }

    componentDidUpdate(props){
        if(props.readOnly !== this.props.readOnly || props.disableSave !== this.props.disableSave){
            let updateData = this.state.data;
            if(this.props.readOnly){
                updateData = this.state.originalData;
            }
            this.setState({
                data:updateData,
                readOnly:this.props.readOnly,
                disableSave:this.props.disableSave
            })
        }else if(props.checklistItem !== this.props.checklistItem){
            this.setState({
                checklistItem:this.props.checklistItem,
                data:this.props.checklistItem?this.props.checklistItem.data:null
            })
        }
    }

    onListChanged = (list)=>{
        this.setState({
            data:list,
            changed:true
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
    setData = (data)=>{
        this.setState({
            data:data,
            originalData:data,
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
            case 'date':
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
            data:data,
            changed:true
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
    timestampChanged = (e) =>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.value;
        switch(target.type){
            case 'checkbox':
                value = target.checked;
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
            data:data,
            changed:true
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
            data:data,
            changed:true
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
            data:data,
            changed:true
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
            data:data,
            changed:true
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

    trySave = async(ignoreAlert)=>{
        return new Promise(async (resolve, reject)=>{
            let checklistId = this.state.checklistId;
            if(!checklistId){
                if(this.props.onRequireChecklistId){
                    checklistId = this.props.onRequireChecklistId.constructor.name ==="AsyncFunction"? await this.props.onRequireChecklistId(): this.props.onRequireChecklistId();
                }else{
                    alert("No checklist defined");
                    reject("No checklist defined");
                }
            }
    
            if(!checklistId){
                alert("No checklist defined");
                reject("No checklist defined");
            }
            let data = {
                _id:this.state.checklistItem?this.state.checklistItem._id:null,
                checklistId:checklistId,
                checklistDesignId:this.state.field.checklistId,
                designFieldId:this.state.field._id,
                data:this.state.data
            }
            let retData = await SDK.Checklists.saveChecklistItem(data);
            
            this.setState({
                changed:false,
                checklistItem:retData,
                data:retData.data
            },()=>{
                if(this.props.onSaved){
                    this.props.onSaved(this.state.checklistItem);
                }
            })
            if(!ignoreAlert){
                alert('Saved');
            }
            resolve(true);
        })
        
    }

    tryUndo = async(ignoreAlert)=>{
        return new Promise(async (resolve, reject)=>{
            let checklistId = this.state.checklistId;
    
            if(!checklistId){
                alert("No checklist defined");
                reject("No checklist defined");
            }
            let data = {
                _id:this.state.checklistItem?this.state.checklistItem._id:null,
                checklistId:checklistId,
                checklistDesignId:this.state.field.checklistId,
                designFieldId:this.state.field._id,
                data:this.state.data
            }
            await SDK.Checklists.undoChecklistItem(data);
            this.setState({
                changed:false,
                checklistItem:null,
                data:null
            },()=>{
                if(this.props.onSaved){
                    this.props.onSaved(this.state.checklistItem);
                }
            })
            if(!ignoreAlert){
                alert('Saved');
            }
            resolve(true);
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
                                                    <ChecklistForm readOnly={this.state.readOnly} key={x.key} formDesign={this.state.field.formData} formData={x} onChange={(formData)=>{this.onListFieldChanged(formData,index)}}/>
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
                                    <ChecklistForm readOnly={this.state.readOnly} key={this.state.field.formData} formDesign={this.state.field.formData} formData={this.state.data} onChange={(formData)=>{this.onObjectFieldChanged(formData)}}/>
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
                            
                            <Col md="10">
                                <Form.Row>
                                    <Form.Group as={Col} md={4} >
                                    {
                                        this.state.field.type==='List'?
                                        '':
                                        <Form.Label>{this.state.field.name + (this.state.field.required&&!this.state.readOnly?' *':'')} {this.state.field.requiredRole?<Badge size="xs" variant="secondary">{this.state.field.requiredRole}</Badge>:null}</Form.Label>
                                    }
                                    {
                                        this.state.field.type==='Blank'?
                                        '':
                                        this.state.field.type==='Date'?
                                        <Form.Control readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm"  type={type} name={this.state.field.name} value={this.state.data?moment(this.state.data.value).format('YYYY-MM-DD'):''} onChange={this.handleChange}></Form.Control>
                                        :this.state.field.type==='Checkbox'?
                                        <Form.Check readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))}  size="sm" type={type} name={this.state.field.name} value="true" onChange={this.handleChange} checked={this.state.data?this.state.data.value:false}></Form.Check>
                                        :this.state.field.type==='Select'?
                                        <Form.Control readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm" as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data.value:''} >
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
                                        <Form.Control readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm" as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data.value:''} >
                                        </Form.Control>
                                    }
                                    
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} >
                                        <Form.Label>Timestamp</Form.Label>
                                        <Form.Control readOnly={this.state.readOnly || true} size="sm" type="datetime-local" value={this.state.data?moment.utc(this.state.data.timestamp).local().format('YYYY-MM-DDTHH:mm'):''} onChange={this.timestampChanged}>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} >
                                        <Form.Label>User</Form.Label>
                                        <Form.Control readOnly={true} size="sm" type="text" value={this.state.data?this.state.data.user:''} >
                                        </Form.Control>
                                    </Form.Group>

                                </Form.Row>
                            </Col>
                            <Col md="2">
                                <Form.Group style={{marginTop:"2rem"}}>
                                    {this.state.changed?<Button size="sm" onClick={this.trySave} disabled={this.state.disableSave}>Save</Button>:null}
                                    {
                                        this.state.data&&this.state.data.value?
                                        <Button className="ml-1" variant="warning" size="sm" onClick={this.tryUndo} disabled={this.state.disableSave}><i class="fa-solid fa-rotate-left"></i></Button>
                                        :null
                                    }
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        
                        {/* <pre>
                        {JSON.stringify(this.state.checklistItem,null,2)}
                        </pre> */}
                    </Col>
                    
                )
            }else{
                return (
                    <Col md={this.state.field.colspan}>
                        <Form.Row>
                            <Col md="10">
                                <Form.Row>
                                    <Form.Group as={Col} md={this.state.field.colspan} >
                                    {
                                        this.state.field.type==='List'?
                                        '':
                                        <Form.Label>{this.state.field.name + (this.state.field.required&&!this.state.readOnly?' *':'')} {this.state.field.requiredRole?<Badge size="xs" variant="secondary">{this.state.field.requiredRole}</Badge>:null}</Form.Label>
                                    }
                                    {
                                        this.state.field.type==='Blank'?
                                        '':
                                        this.state.field.type==='Date'?
                                        <Form.Control readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm"  type={type} name={this.state.field.name} value={this.state.data?moment.utc(this.state.data).local().format('YYYY-MM-DD'):''} onChange={this.handleChange}></Form.Control>
                                        :this.state.field.type==='Checkbox'?
                                        <Form.Check readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm"  type={type} name={this.state.field.name} value="true" onChange={this.handleChange} checked={this.state.data}></Form.Check>
                                        :this.state.field.type==='Select'?
                                        <Form.Control readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm" as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
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
                                        <Form.Control readOnly={this.state.readOnly || (this.state.field.requiredRole && !(auth.userInfo.roles.includes(this.state.field.requiredRole)))} size="sm" as={controlType} type={type} name={this.state.field.name} onChange={this.handleChange} value={this.state.data?this.state.data:''} >
                                        </Form.Control>
                                    }
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                            {
                                this.props.saveAll?
                                '':
                                <Col md="2">
                                    <Form.Group style={{marginTop:"2rem"}}>
                                        <Button size="sm"  onClick={this.trySave} disabled={this.state.disableSave}>Save</Button>
                                    {
                                        this.state.data&&this.state.data.value?
                                        <Button className="ml-1" variant="warning" size="sm" onClick={this.tryUndo} disabled={this.state.disableSave}><i class="fa-solid fa-rotate-left"></i></Button>
                                        :null
                                    }
                                    </Form.Group>
                                </Col>
                            }
                            
                        </Form.Row>
                        {/* <pre>
                            {JSON.stringify(this.state.checklistItem,null,2)}
                        </pre> */}
                        {/* {
                            this.state.changed?
                            <div>Changed</div>:''
                        } */}
                    </Col>
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

export default  ChecklistField;