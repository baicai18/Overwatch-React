import React, { Component } from 'react';
import {Form, Col} from 'react-bootstrap';
import 'react-data-grid/dist/react-data-grid.css'


class QueryParamter extends Component {
    constructor(props){
        super(props)
        this.state = {
            data:props.data
        }

        this.parameters = [];


        this.operatorRef = React.createRef();
        this.valueRef = React.createRef();
        this.valueRef2 = React.createRef();
    }


    // Code is invoked after the component is mounted/inserted into the DOM tree.
    componentDidMount() {
        //this.pullBOM();
        this.forceUpdate();
    }
    componentDidUpdate(props){
        if(props.data !== this.props.data){
            this.setState({
                data:this.props.data
            })
        }
    }
   
    getOperator = ()=>{
        return this.operatorRef.current?this.operatorRef.current.value:null;
    }
    getValue = ()=>{
        return this.valueRef.current?this.valueRef.current.value:null;
    }
    getValue2 = ()=>{
        return this.valueRef2.current?this.valueRef2.current.value:null;
    }

    render() {
        this.parameters = [];
        return (
            <Col md={this.props.paramWidth||"3"}>
                <Form.Row>
                    <Form.Group as={Col} md="9">
                        <Form.Label>{this.props.param.displayParameter||this.props.param.parameter}</Form.Label>
                        {
                            this.props.param.valueSet?
                            <Form.Control size="sm" as={'select'} type={this.props.param.inputType} ref={this.valueRef} defaultValue={this.props.param.defaultValue}>
                                {
                                    this.props.param.valueSet.map((item,index)=>{
                                        return <option key={index+item.value} value={item.value}>{item.display}</option>
                                    })
                                }
                            </Form.Control>
                            :<Form.Control size="sm" type={this.props.param.inputType} ref={this.valueRef} defaultValue={this.props.param.defaultValue}></Form.Control>
                        }
                        
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control as="select" size="sm"  ref={this.operatorRef} onChange={this.operatorChanged} defaultValue={
                            this.props.param.defaultOperator?this.props.param.defaultOperator:
                            (this.props.param.inputType==="text"?'LIKE':'=')
                        }>
                            {this.props.param.inputType==="text"?<option value={'LIKE'} >like</option>:''}
                            <option value={'='} >=</option>
                            <option value={'!='}>!=</option>
                            <option value={'>'}>&gt;</option>
                            <option value={'>='}>&gt;=</option>
                            <option value={'<'}>&lt;</option>
                            <option value={'<='}>&lt;=</option>
                            {this.props.param.inputType==="text"?<option value={'IN'}>in</option>:''}
                            {this.props.param.inputType==="text"?<option value={'NOTIN'}>not in</option>:''}
                            {['number','datetime-local'].includes(this.props.param.inputType)?<option value={'BETWEEN'}>between</option>:''}
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                {
                    this.operatorRef.current && this.operatorRef.current.value === 'BETWEEN'?
                    <Form.Row>
                        <Form.Group as={Col} md="9">
                            <Form.Control size="sm" type={this.props.param.inputType} ref={this.valueRef2} defaultValue={this.props.param.defaultValue2}></Form.Control>
                        </Form.Group>
                    </Form.Row>
                    :''
                }
            </Col>
        )
    }
    

    operatorChanged = (event)=>{
        this.forceUpdate();
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


export default QueryParamter;
