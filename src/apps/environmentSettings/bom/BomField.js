import React from 'react';

import {Form,Container, Card} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';
import KeywordSearchField from './KeywordSearchField';
import DraggableList from '../../tools/DraggableList';

class BomField extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            index: props.index,
            field:props.field,
            fieldTypes:[]
        }
    }

    componentDidMount(){
        this.getBomFieldTypes();
    }

    newSearchValue = ()=>{
        let field = this.state.field;
        if(field.searchValues){
            field.searchValues.push({})
        }else{
            field.searchValues = [{}];
        }
        this.setState({
            field:field
        })
    }

    onSearchFieldDataChanged = (index,searchField)=>{
        var newField = this.state.field;
        newField.searchValues[index] = searchField;
        this.setState({
            field:newField
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index, this.state.field);
            }

        })
    }
    render() {
        return (
            <Card>
                <Card.Body className="card-body-thin">
                    <Form.Row>
                        <Form.Group className="col-auto">
                            <Form.Label>Field Name</Form.Label>
                            <Form.Control type="text" name="field_name" value={this.state.field.field_name} onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Type</Form.Label>
                            {
                                this.state.field.locked?
                                <Form.Control type="text" name="type" value={this.state.field.type} readOnly={this.state.field.locked}/>
                                :
                                <Form.Control as="select" name="type" onChange={this.onChange}>
                                    <option key={''} value={''}></option>
                                    {this.state.fieldTypes.map(x=>{
                                        return <option key={x.field_type} value={x.field_type} selected={(this.state.field.type == x.field_type)}>{x.field_type}</option>
                                    })}
                                </Form.Control>
                            }
                            
                            
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Multiple</Form.Label>
                            <Form.Check type="checkbox" name="multiple" value={true}checked={this.state.field.multiple} onChange={this.onChange} disabled={this.state.field.locked}/>
                        </Form.Group>
                        {
                            this.state.field.type==="keyword_search"?
                            <Form.Group className="col-auto">
                                <Form.Label>Default Value</Form.Label>
                                <Form.Control type="text" name="default_value" value={this.state.field.default_value} onChange={this.onChange}/>
                            </Form.Group>
                            :''
                        }
                    </Form.Row>
                    {
                        this.state.field.fields?
                            <DraggableList 
                            key={this.state.field.fields} 
                            keyName={this.state.field.key}
                            list={this.state.field.fields} 
                            onListChanged={this.onListChanged}
                            mapFunction={(x,index)=>{
                                return <BomField key={index.toString()+x.key} field={x} index={index} onDataChanged={this.onFieldDataChanged} onDeleteField={this.onDeleteField}/>
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
                    {
                        this.state.field.type==="keyword_search"?
                        <Card>
                            <Card.Header>
                                Search Values
                                <div className="header-actions">
                                    <a onClick={this.newSearchValue}>
                                        <i class="fas fa-plus"/>
                                        {/* <FontAwesomeIcon icon="plus"/> */}
                                    </a>
                                </div>
                            </Card.Header>
                            <Card.Body className="card-body-thin">
                            {
                                this.state.field.searchValues?
                                    <DraggableList 
                                    key={this.state.field.searchValues} 
                                    keyName={this.state.field.key}
                                    list={this.state.field.searchValues} 
                                    onListChanged={this.onSearchListChanged}
                                    mapFunction={(x,index)=>{
                                        return <KeywordSearchField key={index.toString()+x.key} searchField={x} index={index} onDataChanged={this.onSearchFieldDataChanged} onDeleteField={this.onDeleteField}/>
                                        }
                                    }/>
                                :''
                            }
                            </Card.Body>
                        </Card>
                        :''
                    }
                </Card.Body>
            </Card>
        )
    }
    getBomFieldTypes = ()=>{
        SDK.BOM.getFieldTypes()
        .then(data=>{
            this.setState({
                fieldTypes:data
            })
        })
    }
    
    onChange = (e)=>{
        var field = this.state.field;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        field[e.currentTarget.name] = value;
        this.setState({
            field:field
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index, this.state.field);
            }

        })
    }

    onListChanged = (list)=>{
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

    onFieldDataChanged = (index,field)=>{
        alert(field);
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

    newField = ()=>{
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


    deleteField = ()=>{
        if(this.props.onDeleteField){
            this.props.onDeleteField(this.state.index, this.state.field);
        }
    }

    onDeleteField = (index, field)=>{
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

export default BomField;