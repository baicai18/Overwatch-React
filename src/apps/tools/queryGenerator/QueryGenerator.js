import React, { Component } from 'react';
import {Card, Button, Form} from 'react-bootstrap';
import QueryParameter from './QueryParameter';

class QueryGenerator extends Component {
    constructor(props){
        super(props)
        this.state = {
            data:props.data
        }

        this.parameters = [];
    }


    // Code is invoked after the component is mounted/inserted into the DOM tree.
    componentDidMount() {
        //this.pullBOM();
    }
    componentDidUpdate(props){
        if(props.data !== this.props.data){
            this.setState({
                data:this.props.data
            })
        }
    }
    createQuery = ()=>{
        let queryParam = "";
        for( let x = 0; x < this.parameters.length; x++){
            let value = null;
            let value2 = null;
            let operator = null;

            console.log(this.parameters[x].parameter.parameter)
            if(this.parameters[x].ref.current && this.parameters[x].ref.current.getValue()){
                operator = this.parameters[x].ref.current.getOperator();
                value = this.parameters[x].ref.current.getValue();
                value2 = this.parameters[x].ref.current.getValue2();

                if(operator === 'IN' || operator === 'NOTIN'){
                    if(this.parameters[x].parameter.inputType === 'text' || this.parameters[x].parameter.inputType === 'datetime-local'){
                        value = `(` + value.split(`,`).map((value,index)=>{return `"` + value.trim() + `"`}).join(`;`) + `)`;
                    }else{
                        value = `(` + value.split(`,`).map((value,index)=>{return value.trim() }).join(`;`) + `)`;
                    }
                }else if(operator === 'LIKE' ){
                    value = `"%` + value + `%"`;
                }else if(this.parameters[x].parameter.inputType === 'text' || this.parameters[x].parameter.inputType === 'datetime-local'){
                    value = `"` + value + `"`;
                }
                
                if(value2){
                    //value2 = this.parameters[x].dataRef2.current.value;
                    if(operator === 'IN' || operator === 'NOTIN'){
                        if(this.parameters[x].parameter.inputType === 'text' || this.parameters[x].parameter.inputType === 'datetime-local'){
                            value2 = `(` + value2.split(`,`).map((value,index)=>{return `"` + value.trim() + `"`}).join(`;`) + `)`;
                        }else{
                            value2 = `(` + value2.split(`,`).map((value,index)=>{return value.trim() }).join(`;`) + `)`;
                        }
                    }else if(operator === 'LIKE' ){
                        value2 = `"%` + value2 + `%"`;
                    }else if(this.parameters[x].parameter.inputType === 'text' || this.parameters[x].parameter.inputType === 'datetime-local'){
                        value2 = `"` + value2 + `"`;
                    }
                }

                if(queryParam !== ""){
                    queryParam+= ',';
                }

                if(operator === 'BETWEEN'){
                    queryParam += this.parameters[x].parameter.parameter + ' >= ' + value + ', ' + this.parameters[x].parameter.parameter + ' <= ' + value2;
                }else{
                    queryParam += this.parameters[x].parameter.parameter + ' ' + operator + ' ' + value;
                }
                
            }
        }
        if(this.props.onQueryGenerated){
            this.props.onQueryGenerated(queryParam);
        }
    }
    render() {
        this.parameters = [];
        return (
            <Card>
                <Card.Header>
                    {this.state.data?this.state.data.endpoint:''}
                </Card.Header>
                <Card.Body>
                    <Form.Row>
                        {
                            this.state.data?this.state.data.queryParams.map((param,index)=>{
                                let ref = React.createRef();
                                let data = React.createRef();
                                let data2 = React.createRef();
                                let operator = React.createRef();
                                let saveData = {
                                    ref:ref,
                                    parameter:param,
                                    dataRef:data,
                                    dataRef2:data2,
                                    operatorRef:operator
                                }
                                this.parameters.push(saveData);

                                return <QueryParameter key={'param' + param.parameter} paramWidth={this.props.paramWidth} ref={ref} param={param} dataRef={data} operatorRef={operator} dataRef2={data2}/>
                            })
                            :''
                        }
                    </Form.Row>
                </Card.Body>
                <Card.Footer>
                    <Button size="sm" onClick={this.createQuery}>Query </Button>
                </Card.Footer>
            </Card>
        )
    }
    

    handleChange = (event)=>{
        var target = event.target;
        var name = target.name;
        var value = target.value;

        var state = this.state;
        state[name] = value;
        this.setState(state)


    }

  
}


export default QueryGenerator;
