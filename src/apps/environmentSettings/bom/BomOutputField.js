import React from 'react';

import {Form,Card} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';
import DraggableList from '../../tools/DraggableList';

class BomOutputField extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            index: props.index,
            field:props.field,
            fieldTypes:[]
        }
        this.getBomFieldTypes = this.getBomFieldTypes.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFieldDataChanged = this.onFieldDataChanged.bind(this);
        this.onListChanged = this.onListChanged.bind(this);
        this.newField = this.newField.bind(this);
        this.deleteField = this.deleteField.bind(this);
        this.onDeleteField = this.onDeleteField.bind(this);
    }

    componentDidMount(){
        this.getBomFieldTypes();
    }
    render() {
        return (
            <Card>
                <Card.Body className="card-body-thin">
                    <Form.Row>
                        <Form.Group className="col-auto">
                            <Form.Label>Field Name</Form.Label>
                            <Form.Control type="text" name="field_name" value={this.state.field.field_name} onChange={this.onChange} readOnly={this.state.field.locked}/>
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Type</Form.Label>
                            
                            {this.state.field.locked?
                                <Form.Control type="text" name="type" value={this.state.field.type} readOnly={this.state.field.locked}/>
                                :
                                <Form.Control as="select" name="type" onChange={this.onChange}>
                                    {this.state.fieldTypes.map(x=>{
                                        return <option key={x.field_type} value={x.field_type} selected={(this.state.field.type === x.field_type)}>{x.field_type}</option>
                                    })}
                                </Form.Control>
                            }
                            
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Multiple</Form.Label>
                            <Form.Check type="checkbox" name="multiple" value={true}checked={this.state.field.multiple} onChange={this.onChange} disabled={this.state.field.locked}/>
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Display</Form.Label>
                            <Form.Check type="checkbox" name="display" value={true}checked={this.state.field.display} onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Multiple Columns</Form.Label>
                            <Form.Check type="checkbox" name="multiple_columns" value={true}checked={this.state.field.multiple_columns} onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Deliminator</Form.Label>
                            <Form.Control as="textarea" rows="1" name="deliminator" value={this.state.field.deliminator} onChange={this.onChange}/>
                        </Form.Group>
                    </Form.Row>
                    {
                        this.state.field.fields?
                            <DraggableList 
                            key={this.state.field.fields} 
                            keyName={this.state.field.key}
                            list={this.state.field.fields} 
                            onListChanged={this.onListChanged}
                            mapFunction={(x,index)=>{
                                return <BomOutputField key={index.toString()+x.key} field={x} index={index} onDataChanged={this.onFieldDataChanged} onDeleteField={this.onDeleteField}/>
                                }
                            }/>
                        :''
                    }
                    <div className="header-actions">
                    {
                        this.state.field.type==="object"?
                        <a onClick={this.newField}>
                            <i class="fas fa-plus"/>
                            {/* <FontAwesomeIcon icon="plus"/> */}
                        </a>
                        :''
                    }
                    {
                        this.state.field.locked?
                        '':
                        <a onClick={this.deleteField}>
                        <i class="fas fa-times"/>
                            {/* <FontAwesomeIcon icon="times"/> */}
                        </a>
                    }
                    </div>
                </Card.Body>
            </Card>
        )
    }
    getBomFieldTypes(){
        SDK.BOM.getFieldTypes()
        .then(data=>{
            this.setState({
                fieldTypes:data
            })
        })
    }
    
    onChange(e){
        var field = this.state.field;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        field[e.currentTarget.name] = value;
        this.setState({
            field:field
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index, this.state.field);
        }
    }

    onListChanged(list){
        var field = this.state.field;
        field.fields = list;
        this.setState({
            field:field
        },
            ()=>{
                if(this.props.onDataChanged){
                    this.props.onDataChanged(this.state.index, this.state.field);
                }

            }
        );
    }

    onFieldDataChanged(index,field){

        var newField = this.state.field;
        newField.fields[index] = field;
        this.setState({
            field:newField
        },()=>{
            if(this.props.onDataChanged){
                 this.props.onDataChanged(this.state.index, this.state.field);
            }

        })
    }
    newField(){
        var field = this.state.field
        field.fields.push({
            field_name:'',
            type:'',
            multiple:false,
            locked:false,
            fields:[],
            key:field.fields.length
        })
        this.setState({
            field: field
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index, this.state.field);
            }

        })
    }


    deleteField(){
        if(this.props.onDeleteField){
            this.props.onDeleteField(this.state.index, this.state.field);
        }
    }

    onDeleteField(index, field){
        var newField = this.state.field;
        newField.fields.splice(index,1);
        this.setState({
            field:newField
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index, this.state.field);
            }

        })
    }
    

}

export default BomOutputField;