import React from 'react';

import {Container, Card, Button} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';

import BomOutputField from './BomOutputField';
import DraggableList from '../../tools/DraggableList';

class BomOutput extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            BomOutput:{
                fields:[]
            }
        }
        this.updateBomOutput = this.updateBomOutput.bind(this);
        this.newField = this.newField.bind(this);
        this.fieldDataChanged = this.fieldDataChanged.bind(this); 
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onListChanged = this.onListChanged.bind(this);
        this.addKey = this.addKey.bind(this);
        this.removeKey = this.removeKey.bind(this);
        this.saveOutput = this.saveOutput.bind(this);
        this.onDeleteField = this.onDeleteField.bind(this);
    }

    componentDidMount(){
        
        this.updateBomOutput();
    }
    render() {
        return (
            <Container fluid>
                <Card>
                    <Card.Header className="card-header-border">
                        Bom Ouptut Options
                        <div className="header-actions">
                            <a onClick={this.newField}>
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {
                            <DraggableList 
                                key={this.state.BomOutput.fields} 
                                keyName={"NULL"}
                                list={this.state.BomOutput.fields} 
                                onListChanged={this.onListChanged}
                                mapFunction={(x,index)=>{
                                    return <BomOutputField key={index.toString() + x.key} field={x} index={index} onDataChanged={this.fieldDataChanged} onDeleteField={this.onDeleteField}/>
                                    }
                                }/>
                        }
                    </Card.Body>
                    <Card.Footer>
                        <Button size="sm" variant="primary" onClick={this.saveOutput}>Save</Button> 
                    </Card.Footer>
                </Card>
                {/* <Card>
                    <Card.Header className="card-header-border">
                        JSON Data
                    </Card.Header>
                    <Card.Body>
                        <pre>
                            {
                                JSON.stringify(this.state.BomOutput, null, 2)
                            }
                        </pre>
                    </Card.Body>
                </Card> */}
            </Container>
        )
    }
    updateBomOutput(){
        SDK.BOM.getBOMDefinition()
        .then(data=>{
            this.setState({
                bomDefinition:data
            },()=>{
                SDK.BOM.getDefaultBOMOutput()
                .then(data=>{
                    var bomDef = Object.assign({},data);
                    bomDef.fields.forEach(field=>{
                        field.locked = false;
                    })
                    //need to check data
                    for(let x = 0; x < this.state.bomDefinition.fields.length; x++){
                        
                        var field = data.fields.find(row=>{
                            return row.type === this.state.bomDefinition.fields[x].type && row.field_name === this.state.bomDefinition.fields[x].field_name
                        })
                        if(field){
                            //found
                            this.lockField(field);
                            


                        }else{
                            bomDef.fields.push(this.copyField(this.state.bomDefinition.fields[x]));
                        }
                    }

                    for(let x = 0; x < bomDef.fields.length; x++){
                        bomDef.fields[x] = this.addKey(bomDef.fields[x],x);
                    }
                    this.setState({
                        BomOutput:bomDef
                    })
                })
            }
            )
        })
    }
    lockField(field){
        field.locked = true;
        if(field.fields){
            for(var x = 0; x < field.fields.length; x++){
                this.lockField(field.fields[x]);
            }
        }
    }
    copyField(field){
        var retField = {
            field_name:field.field_name,
            type:field.type,
            multiple:field.multiple
        }
        if(field.fields && field.fields.length > 0){
            retField.fields = [];
            for(var x = 0; x < field.fields.length; x++){
                retField.fields.push(this.copyField(field.fields[x]));
            }
        }
        return retField;
    }

    onDeleteField(index, field){
        var BomOutput = this.state.BomOutput;
        BomOutput.fields.splice(index,1);
        this.setState({
            BomOutput:BomOutput
        })
    }
    newField(){
        var BomOutput = this.state.BomOutput
        BomOutput.fields.push({
            field_name:'',
            type:'',
            multiple:false,
            locked:false,
            fields:[],
            key:BomOutput.fields.length
        })
        this.setState({
            BomOutput: BomOutput
        })
    }


    fieldDataChanged(index, field){
        var BomOutput = this.state.BomOutput;
        BomOutput.fields[index] = field;
        this.setState({
            BomOutput:BomOutput
        })
    }

    saveOutput(){
        var BomOutput = Object.assign({},this.state.BomOutput);
        for(var x = 0; x < BomOutput.fields.length; x++){
            BomOutput.fields[x] = this.removeKey(BomOutput.fields[x]);
        }

        SDK.BOM.saveOutput(BomOutput)
        .then(data=>{
            alert("saved");
        })
        .catch(err=>{
            alert(err.message);
        })  

    }
    removeKey(field){
        var retField = Object.assign({},field);
        if(retField.key != null){
            delete retField.key;
        }
        if(retField.fields){
            for(var x = 0; x < retField.fields.length; x++){
                retField.fields[x] = this.removeKey(retField.fields[x]);
            }
        }

        return retField;
    }

    addKey(field, index){
        var retField = Object.assign({},field);
        retField.key = index;
        if(retField.fields){
            for(var x = 0; x < retField.fields.length; x++){
                retField.fields[x] = this.addKey(retField.fields[x], x);
            }
        }
        return retField;
    }

    onDragStart(event, parent, index, data){
        this.setState({
            dragIndex:index
        })
        event.dataTransfer.setData("index", index);
    }

    onDragOver(event, parent, index, data){
        if(this.state.dragIndex !== index.toString()){
            //allow
            event.preventDefault();
        }
    }
    onDragEnd(event, parent, index, data){
        this.setState({
            dragIndex:null
        })
    }
    onDrop(event, parent, index, data){
        this.setState({
            dragIndex:null
        })
    }

    onListChanged(list){
        var BomOutput = this.state.BomOutput;
        BomOutput.fields = list;
        this.setState({
            BomOutput:BomOutput
        })
    }

}

export default BomOutput;