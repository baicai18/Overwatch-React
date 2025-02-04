import React from 'react';
import {Form, Button} from 'react-bootstrap';
import SDK from '../../../sdk/SDK';
import ChecklistField from './ChecklistField';


class ChecklistForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            checklistId:props.checklistId,
            checklist:{items:[]},
            formDesign:props.formDesign||{formData:{}},
            formData:props.formData||{},
            originalData:props.formData||{},
            readOnly:props.readOnly,
            disableSave:props.disableSave,
            saveAll:props.saveAll,
        }

        this.fieldRefs = [];

    }
    componentDidMount(){
        this.loadChecklist();
    }

    componentDidUpdate(props){
        if(props.formDesign != this.state.formDesign || props.formData != this.props.formData || props.readOnly !== this.props.readOnly || props.disableSave !== this.props.disableSave || props.checklistId !== this.props.checklistId){
            let updateData = this.state.formData;
            if(this.props.readOnly){
                updateData = this.state.originalData;
            }
            if(props.formData !== this.props.formData){
                updateData = this.props.formData;
            }
            this.setState({
                checklistId:this.props.checklistId,
                formDesign:this.props.formDesign,
                // formData:this.props.formData || this.state.formData,
                formData:updateData,
                readOnly:this.props.readOnly,
                disableSave:this.props.disableSave
            }, ()=>{
                if(props.checklistId !== this.props.checklistId){
                    this.loadChecklist();
                }
                this.forceUpdate();
                // console.log("FORMDATA CHANGED: " + JSON.stringify(this.state.formData));
            })
        }
    }

    getFormData = ()=>{
        return this.state.formData;
    }

    loadChecklist = async ()=>{
        try{
            let checklist = await SDK.Checklists.getChecklist(this.state.checklistId);
            this.setState({
                checklist:checklist
            })
        }catch(err){
            console.error(err);
        }
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
    onRequireChecklistId = async ()=>{
        if(this.props.onRequireChecklistId){
            let checklistId = await this.props.onRequireChecklistId();
            if(this.formData){
                this.formData._id = checklistId;
            }else{
                this.formData = {_id:checklistId};
            }
            return checklistId;
        }else{
            return null;
        }
    }

    trySave = async()=>{
        try{
            
            let checklistId = this.state.checklistId;
            if(!checklistId){
                if(this.props.onRequireChecklistId){
                    checklistId = await this.props.onRequireChecklistId();
                    this.setState({
                        checklistId:checklistId
                    },()=>{
                        this.trySave();
                    })
                    return;
                }else{
                    alert("No checklist defined");
                    return;
                }
            }
            this.state.checklist._id = checklistId
            let newChecklist = await SDK.Checklists.saveChecklistComments(this.state.checklist);
            // alert(this.state.checklist?this.state.checklist.comments:'')
            for(let x = 0; x < this.fieldRefs.length; x++){
                if(this.fieldRefs[x].current.state.changed){
                    await this.fieldRefs[x].current.trySave(true);
                }
            }
            this.loadChecklist();
            alert("Saved");
        }catch(err){
            alert(err);
        }
    }
    checklistDataChanged = (e)=>{
        var checklist = this.state.checklist || {items:[]};
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        checklist[e.currentTarget.name] = value;

        this.setState({
            checklist:checklist
        }, ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.checklist);
            }

        })
        
        

    }
    onFieldSaved = (checklistItem, field)=>{
        if(this.state.checklist){
            let checklist = this.state.checklist;
            let found = false;
            for(let x = 0; x < checklist.items.length;x++){
                if(checklist.items[x].designFieldId === field._id){
                    if(checklistItem){
                        checklist.items[x] = checklistItem
                    }else{
                        checklist.items.splice(x,1);
                        checklist.completeQty = checklist.completeQty==null?0:(checklist.completeQty-1)
                    }
                    
                    found = true;
                    break;
                }
            }
            if(!found){
                if(checklistItem){
                    checklist.items.push(checklistItem);
                    checklist.completeQty = checklist.completeQty==null?1:(checklist.completeQty+1)
                }

            }
            if(!checklist.totalQty){
                checklist.totalQty = this.state.formDesign.formData.fields.length
            }

            this.setState({
                checklist:checklist
            })
        }
    }

    render = ()=>{
        this.fieldRefs = [];
        return (
            <div>
                {
                    this.props.showStatus?
                    <Form.Row>
                        Status: {this.state.checklist?
                                    this.state.checklist.complete?'Complete':this.state.checklist.complete == null?'Not Started':'In Process'
                                :''
                        } - 
                        {(this.state.checklist && this.state.checklist.completeQty)?this.state.checklist.completeQty + '/' + this.state.checklist.totalQty:''}
                    </Form.Row>
                    :''
                }
                <Form.Row>
                {
                    (this.state.formDesign && this.state.formDesign.formData && this.state.formDesign.formData.fields)?
                    this.state.formDesign.formData.fields.map((x,index)=>{
                        let ref = React.createRef();
                        this.fieldRefs.push(ref);
                        let checklistItem = this.state.checklist?this.state.checklist.items.find((row)=>{return row.designFieldId===x._id}):null;
                        // alert(JSON.stringify(checklistItem));
                        return <ChecklistField 
                                    ref={ref} 
                                    checklistId={this.state.checklistId} 
                                    checklistDesignId={this.state.formDesign._id} 
                                    readOnly={this.state.readOnly} 
                                    key={x.name + index.toString()} 
                                    field={x} 
                                    checklistItem={checklistItem} 
                                    onChange={(data)=>{this.handleFieldChange(data,x,index)}} 
                                    disableSave={this.state.disableSave} 
                                    onRequireChecklistId={this.onRequireChecklistId} 
                                    saveAll={this.props.saveAll} 
                                    onSaved={(checklistItem)=>{this.onFieldSaved(checklistItem, x)}}
                                />
                    })
                    :''
                }
                </Form.Row>
                <Form.Row>
                    <Form.Group as="Col" className="col-md-6" >
                        <Form.Label>Comments</Form.Label>
                        <Form.Control readOnly={this.state.readOnly} name="comments" rows="4" size="sm" type="text" as="textarea" onChange={this.checklistDataChanged} value={this.state.checklist?this.state.checklist.comments:''} >
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                {
                    this.props.saveAll?
                    <Button size="sm"  disabled={this.state.disableSave} onClick={this.trySave}>Save</Button>
                    :''
                }
                
                {/* <pre>{JSON.stringify(this.state.checklist,null, 
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

export default  ChecklistForm;