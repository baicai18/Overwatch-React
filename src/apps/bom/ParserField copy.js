import React from 'react';
import {Form} from 'react-bootstrap';

class ParserField extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            index:props.index,
            fieldDefinition:{
                field_name: props.fieldDefinition.field_name,
                type: props.fieldDefinition.type,
                multiple: props.fieldDefinition.multiple,
                fields: props.fieldDefinition.fields
            },
            fieldData:{
                field_name: props.fieldDefinition.field_name,
                type: props.fieldDefinition.type,
                column_name: props.fieldData.column_name,
                multiple: props.fieldDefinition.multiple,
                multiple_in_column: props.fieldData.multiple_in_column,
                deliminator: props.fieldData.deliminator,
                multiple_columns:props.fieldData.multiple_columns,
                col_deliminator:props.fieldData.col_deliminator,
                fields:props.fieldData.fields
            },
            headers:props.headers == null ? [] : props.headers
            
        }
        this.fieldRefs = [];
        this.onChange = this.onChange.bind(this);
        this.fieldDataChanged = this.fieldDataChanged.bind(this);
    }
    componentDidMount(){

    }

    componentDidUpdate(prevProps){
        if(this.props.fieldData){
            if(this.props.fieldData.column_name !== prevProps.fieldData.column_name){
                this.setState(
                    {
                        fieldData:{
                            field_name: this.props.fieldDefinition.field_name,
                            type: this.props.fieldDefinition.type,
                            column_name: this.props.fieldData.column_name,
                            multiple: this.props.fieldDefinition.multiple,
                            multiple_in_column: this.props.fieldData.multiple_in_column,
                            deliminator: this.props.fieldData.deliminator,
                            multiple_columns: this.props.fieldData.multiple_columns,
                            col_deliminator: this.props.fieldData.col_deliminator,
                            fields: this.props.fieldData.fields
                        },
                    }
                )
            }
        }
    }
    onChange(e){
        var fieldData = this.state.fieldData;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        fieldData[e.currentTarget.name] = value;
        console.log("Udated: " + JSON.stringify(fieldData));
        this.setState({
            fieldData:fieldData
        },
        ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index, this.state.fieldData);
                
            }
        })
        
    }

    getFieldData = ()=>{
        let data = this.state.fieldData;
        this.state.fieldData.fields = this.fieldRefs.map((field)=>{
            return field.current.getFieldData();
        });
        return data;
    }
    fieldDataChanged(index, data){
        if(data){
            var fieldData = this.state.fieldData;
            var findIndex = -1;
            if(fieldData.fields == null){
                fieldData.fields = [];
            }
            findIndex = fieldData.fields.findIndex(row=>{
                return row.field_name === data.field_name && row.type === data.type
            });
            if(findIndex){
                //findIndex = data;
                fieldData.fields[findIndex] = data;
            }else{
                fieldData.fields.push(data);
            }
            //alert(findIndex);
            this.setState({
                fieldData:fieldData
            },
            ()=>{
                if(this.props.onDataChanged){
                    this.props.onDataChanged(this.state.index, this.state.fieldData);
                }
            })

        }
        
    }

    render(){
        this.fieldRefs = [];
        return (
            <div>
                <Form.Row>
                    <Form.Group className="col-auto">
                        <Form.Label>Field Name</Form.Label>
                        <Form.Control size="sm" type="text" name="field_name" value={this.state.fieldDefinition.field_name} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-auto">
                        <Form.Label>Type</Form.Label>
                        <Form.Control size="sm" type="text" name="type" value={this.state.fieldDefinition.type} readOnly={true}/>
                    </Form.Group>
                    <Form.Check type="hidden" name="multiple" value={this.state.fieldData.multiple} onChange={this.onChange}/>
                    <Form.Group className="col-auto">
                        <Form.Label>Column Name</Form.Label>
                        {
                            (this.state.headers.length > 0 && !this.state.fieldData.multiple_columns) ? 
                                <Form.Control size="sm" as="select" name="column_name"  onChange={this.onChange}>
                                    <option value=""></option>
                                    {this.state.headers.map(x=>{
                                        return <option key={x} value={x} selected={(this.state.fieldData.column_name === x)}>{x}</option>
                                    })}
                                </Form.Control>
                            :
                                <Form.Control size="sm" type="text" name="column_name" value={this.state.fieldData.column_name} onChange={this.onChange}/>
                        }
                    </Form.Group>
                    <Form.Group className="col-auto">
                        <Form.Label>Multiple</Form.Label>
                        <Form.Check type="checkbox" name="multiple_in_column" checked={this.state.fieldData.multiple_in_column} onChange={this.onChange}/>
                    </Form.Group>
                    <Form.Group className="col-auto">
                        <Form.Label>Deliminator</Form.Label>
                        <Form.Control size="sm" as="textarea" rows="1" name="deliminator" value={this.state.fieldData.deliminator} onChange={this.onChange}/>
                    </Form.Group>
                    <Form.Group className="col-auto">
                        <Form.Label>Multiple Columns</Form.Label>
                        <Form.Check type="checkbox" name="multiple_columns" checked={this.state.fieldData.multiple_columns} onChange={this.onChange}/>
                    </Form.Group>
                    <Form.Group className="col-auto">
                        <Form.Label>Column Deliminator</Form.Label>
                        <Form.Control size="sm" type="text" name="col_deliminator" value={this.state.fieldData.col_deliminator} onChange={this.onChange}/>
                    </Form.Group>
                </Form.Row>
                {
                    this.state.fieldDefinition.fields && this.state.fieldDefinition.fields.length > 0?
                        this.state.fieldDefinition.fields.map((field, index)=>{
                            let ref = React.createRef();
                            this.fieldRefs.push(ref);
                            return <ParserField 
                                ref={ref}
                                key={index} 
                                index={index} 
                                fieldDefinition={field} 
                                fieldData={
                                    this.state.fieldData.fields && field?
                                    (
                                        this.state.fieldData.fields.find((row)=>{
                                            if(row){
                                                return row.field_name === field.field_name && row.type === field.type
                                            }else{
                                                return false;
                                            }
                                        })?
                                        this.state.fieldData.fields.find((row)=>{
                                            if(row){
                                                return row.field_name === field.field_name && row.type === field.type
                                            }else{
                                                return false;
                                            }
                                        }):{}
                                    ):{}
                                } 
                                headers={this.state.headers} 
                                onDataChanged={this.fieldDataChanged}/>
                        })
                    :
                        ''
                }
            </div>
        )
        
    }
}
export default ParserField;