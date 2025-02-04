import React from 'react';

import {Container, Card, Button} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../../sdk/SDK';

import BomField from './BomField';
import DraggableList from '../../tools/DraggableList';

class BomDefinition extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            BOMDefinition:{
                fields:[]
            }
        }
    }

    componentDidMount(){
        this.updateBOMDefinition();
    }
    render() {
        return (
            <Container fluid>
                <Card>
                    <Card.Header className="card-header-border">
                        Bom Definition
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
                                key={this.state.BOMDefinition.fields} 
                                keyName={"NULL"}
                                list={this.state.BOMDefinition.fields} 
                                onListChanged={this.onListChanged}
                                mapFunction={(x,index)=>{
                                    return <BomField key={index.toString() + x.key} field={x} index={index} onDataChanged={this.fieldDataChanged} onDeleteField={this.onDeleteField}/>
                                    }
                                }/>
                        }
                    </Card.Body>
                    <Card.Footer>
                        <Button size="sm" variant="primary" onClick={this.saveDefinition}>Save</Button> 
                    </Card.Footer>
                </Card>
                {/* <Card>
                    <Card.Header className="card-header-border">
                        JSON Data
                    </Card.Header>
                    <Card.Body>
                        <pre>
                            {
                                JSON.stringify(this.state.BOMDefinition, null, 2)
                            }
                        </pre>
                    </Card.Body>
                </Card> */}
            </Container>
        )
    }
    updateBOMDefinition = async ()=>{
        SDK.BOM.getBOMDefinition()
        .then(data=>{
            var bomDef = Object.assign({},data);
            for(var x = 0; x < bomDef.fields.length; x++){
                bomDef.fields[x] = this.addKey(bomDef.fields[x],x);
            }
            this.setState({
                BOMDefinition:bomDef
            })
        })
    }

    

    newField = ()=>{
        var BOMDefinition = this.state.BOMDefinition
        BOMDefinition.fields.push({
            field_name:'',
            type:'',
            multiple:false,
            locked:false,
            fields:[],
            key:BOMDefinition.fields.length
        })
        this.setState({
            BOMDefinition: BOMDefinition
        })
    }


    fieldDataChanged = (index, field)=>{
        var BOMDefinition = this.state.BOMDefinition;
        BOMDefinition.fields[index] = field;
        this.setState({
            BOMDefinition:BOMDefinition
        })
    }

    saveDefinition = async ()=>{
        try{
            let BOMDefinition = Object.assign({},this.state.BOMDefinition);
            for(var x = 0; x < BOMDefinition.fields.length; x++){
                BOMDefinition.fields[x] = this.removeKey(BOMDefinition.fields[x]);
            }
    
            let data = await SDK.BOM.saveDefinition(BOMDefinition);
            alert("Saved");
        }catch(err){
            console.error(err);
            alert(err);
        }

       

    }
    removeKey = (field)=>{
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

    addKey = (field, index)=>{
        var retField = Object.assign({},field);
        retField.key = index;
        if(retField.fields){
            for(var x = 0; x < retField.fields.length; x++){
                retField.fields[x] = this.addKey(retField.fields[x], x);
            }
        }
        return retField;
    }

    
    onDeleteField = (index, field)=>{
        var BOMDefinition = this.state.BOMDefinition;
        BOMDefinition.fields.splice(index,1);
        this.setState({
            BOMDefinition:BOMDefinition
        })
    }

    onDragStart = (event, parent, index, data)=>{
        this.setState({
            dragIndex:index
        })
        event.dataTransfer.setData("index", index);
    }

    onDragOver = (event, parent, index, data)=>{
        if(this.state.dragIndex !== index.toString()){
            //allow
            event.preventDefault();
        }
    }
    onDragEnd = (event, parent, index, data)=>{
        this.setState({
            dragIndex:null
        })
    }
    onDrop = (event, parent, index, data)=>{
        this.setState({
            dragIndex:null
        })
    }

    onListChanged = (list)=>{
        var BOMDefinition = this.state.BOMDefinition;
        BOMDefinition.fields = list;
        this.setState({
            BOMDefinition:BOMDefinition
        })
    }

}

export default BomDefinition;