import React from 'react';

import {Card, ListGroup, Form, Dropdown} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';
import DraggableList from '../DraggableList';
import FormFields from './FormFields';

// var blankRequirement = {
//     _id:null,
//     requirement_name:null,
//     display_name:null,
//     type:null,
//     description:null,
// }

// blankRequirement = {
//     product_id:null,
//     requirement_name:'TK',
//     display_name:'Turnkey',
//     description:'Description',
//     workflow:[],
//     requirements:[{
//         _id:null,
//         name:'BOM',
//         type:'bom',
//         description:'BOM for build'
//     }],
// }

class FormField extends React.Component { 
    constructor(props){
        super(props);

        this.state={
            index:props.index,
            field:props.field || {},
            onRemove:props.onRemove
        }
        this.baseRequirement = Object.assign({},this.state.requirement);

    }

    componentDidMount(){
        SDK.Requirements.getRequirementTypes()
        .then(data=>{
            this.setState({
                requirementTypes:data
            })
        })
        .catch(err=>{
            console.error(err);
        })
    }

    newSelectValue = (event)=>{
        let value = event.currentTarget.value;
        let field = this.state.field;
        if(field.selectValues){
            if(field.selectValues.includes(value)){
                alert("Value already exists");
                return;
            }else{
                field.selectValues.push(value);
                event.currentTarget.value='';
            }
        }else{
            field.selectValues = [value];
            event.currentTarget.value='';
        }
        this.setState({
            field:field
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.field);
            }
        });

    }
    CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            // const [value, setValue] = useState('');
        
            return (
                <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
                >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Add value"
                    onKeyPress={(e)=>{if(e.key  === 'Enter')this.newSelectValue(e)}}
                    //value={value}
                />
                </div>
            );
        },
    );

    removeSelectValue = (value,index)=>{
        let field = this.state.field;
        field.selectValues.splice(index,1);
        this.setState({
            field:field
        })
    }

    onListChanged = (list)=>{
        let field = this.state.field;
        field.selectValues = list;
        this.setState({
            field:field
        }, ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.field);
            }

        })
    }
    
    deleteField = ()=>{
        if(this.props.onDeleteField){
            this.props.onDeleteField(this.state.index, this.state.field);
        }
    }

    render() {
        return (
            <Card>
                <Card.Header>
                    <div className="header-actions">
                        
                        <a onClick={this.deleteField}>
                            <i class="fas fa-times"/>
                            {/* <FontAwesomeIcon icon="times"/> */}
                        </a>
                    </div>
                </Card.Header>
                <Card.Body className="card-body-thin">
                        <Form.Row>
                            <Form.Group className="col-md-5">
                                <Form.Label>Field Name</Form.Label>
                                <Form.Control name="name" size="sm" placeholder="Field Name" value={this.state.field.name} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group  className="col-md-5">
                                <Form.Label>Field Type</Form.Label>
                                <Form.Control as="select" size="sm" onChange={this.controlChanged} value={this.state.field.type} name="type" readOnly={this.state.field._id != null}>
                                    <option value="" ></option>
                                    <option value="Blank" >Blank Space</option>
                                    <option value="Text" >Text</option>
                                    <option value="Number">Number</option>
                                    <option value="Date">Date</option>
                                    <option value="Select">Select</option>
                                    <option value="TextArea">Text Area</option>
                                    <option value="Checkbox">Checkbox</option>
                                    <option value="List">List</option>
                                    <option value="Object">Object</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-2">
                                <Form.Label>Columns</Form.Label>
                                <Form.Control  type="number" min="1" max="12" name="colspan" size="sm" value={this.state.field.colspan || 1} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-5">
                                <Form.Label>Default Value</Form.Label>
                                <Form.Control name="defaultValue" size="sm" placeholder="Default Value" value={this.state.field.defaultValue} onChange={this.controlChanged}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-2">
                                <Form.Label>Required</Form.Label>
                                <Form.Check  type="checkbox" name="required" value="true" checked={this.state.field.required} onChange={this.controlChanged}></Form.Check>
                            </Form.Group>
                            <Form.Group className="col-md-2">
                                <Form.Label>Timestamp</Form.Label>
                                <Form.Check  type="checkbox" name="saveTimestamp" value="true" checked={this.state.field.saveTimestamp} onChange={this.controlChanged}></Form.Check>
                            </Form.Group>
                            {
                                this.state.field.type === 'Date'?
                                <Form.Group className="col-md-3">
                                    <Form.Label>Default to today</Form.Label>
                                    <Form.Check  type="checkbox" name="defaultToday" value="true" checked={this.state.field.defaultToday} onChange={this.controlChanged}></Form.Check>
                                </Form.Group>
                                :''
                            }
                        </Form.Row>
                        {
                            this.state.field.type==="Select"?
                            <Card>
                                <Card.Header>
                                    Values
                                    <div className="header-actions">
                                    <Dropdown>
                                        <Dropdown.Toggle as={"a"} id="dropdown-custom-components">
                                        <i class="fas fa-plus"/>
                                        {/* <FontAwesomeIcon icon="plus"/> */}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu as={this.CustomMenu}>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                        {/* <a onClick={this.newSelectValue}>
                                            <FontAwesomeIcon icon="plus"/>
                                        </a> */}
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <DraggableList 
                                    key={this.state.field.selectValues} 
                                    keyName={"NULL"}
                                    list={this.state.field.selectValues} 
                                    onListChanged={this.onListChanged}
                                    mapFunction={(x,index)=>{
                                        return <ListGroup.Item>
                                                    {x}
                                                    <div className="header-actions">
                                                        <a onClick={()=>{this.removeSelectValue(x,index)}}>
                                                            <i class="fas fa-times"/>
                                                            {/* <FontAwesomeIcon icon="times"/> */}
                                                        </a>
                                                    </div>
                                                </ListGroup.Item>
                                        }
                                    }/>
                                </Card.Body>
                            </Card>
                            :''
                        }
                        {
                            this.state.field.type==="List" || this.state.field.type==="Object"?
                            <FormFields formData={this.state.field.formData} onFormDataChanged={this.onFormDataChanged}/>
                            :''
                        }
                </Card.Body>
                {/* <Card.Body>
                    <pre>{JSON.stringify(this.state.field,null,2)}</pre>
                </Card.Body> */}

            </Card>
        )
        
    }
    onFormDataChanged = (formData)=>{
        let field = this.state.field;
        field.formData = formData;
        this.setState({
            field:field
        }, ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.field);
            }

        })

    }
    cancelChanges = ()=>{
        var req = Object.assign({},this.baseRequirement);
        req.editing = false;
        this.setState({
            editing:false,
            requirement: req
        },()=>{
            if(this.props.onCancel){
                this.props.onCancel(this.state.requirement);
            }
        })
    
    }
    saveRequirement = ()=>{
        var requirement = this.state.requirement;
        requirement.editing = false;
        SDK.Requirements.saveRequirement(requirement)
        .then(data=>{
            requirement._id = data._id;
            
            this.setState({
                requirement:requirement
            })
        })
        
    }
    editRequirement = ()=>{
        var requirement = this.state.requirement;
        this.baseRequirement = Object.assign({},requirement);
        requirement.editing = true;

        this.setState({
            expand:true,
            requirement:requirement
        })
    }
    removeRequirement = ()=>{
        if(this.state.onRemove){
            this.state.onRemove(this.state.index, this.state.requirement);
        }
    }
    controlChanged = (e)=>{
        var field = this.state.field;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        field[e.currentTarget.name] = value;

        this.setState({
            field:field
        }, ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.field);
            }

        })
        
        

    }
}

export default FormField;