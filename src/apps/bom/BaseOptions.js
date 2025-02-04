import React from 'react';
import {Form} from 'react-bootstrap';
class BaseOptions extends React.Component{
    constructor(props){
        super(props);
        if(props.baseOptions){
            this.state = {
                topLevel: props.baseOptions.topLevel,
                headerIndex: props.baseOptions.headerIndex,
                dataIndex: props.baseOptions.dataIndex,
                parserName: props.baseOptions.parserName
            }
        }else{
            this.state = {
                topLevel: false,
                headerIndex: 1,
                dataIndex: 2
            }
        }
        this.onChange = this.onChange.bind(this);
    }
    componentDidUpdate(prevProps){
        if(this.props.baseOptions !== prevProps.baseOptions){
            if(this.props.baseOptions){
                this.setState({
                    topLevel: this.props.baseOptions.topLevel,
                    headerIndex: this.props.baseOptions.headerIndex,
                    dataIndex: this.props.baseOptions.dataIndex,
                    parserName: this.props.baseOptions.parserName
                })

            }else{
                this.setState({
                    topLevel: false,
                    topLevel:false,
                    headerIndex: 1,
                    dataIndex: 2,
                    parserName:''
                })
            }
        }
        // if(this.props.baseOptions){
        //     if(this.props.baseOptions.parserName !== prevProps.baseOptions.parserName){
        //         this.setState(
        //             {
        //                 topLevel: this.props.baseOptions.topLevel,
        //                 headerIndex: this.props.baseOptions.headerIndex,
        //                 dataIndex: this.props.baseOptions.dataIndex,
        //                 parserName: this.props.baseOptions.parserName
        //             }
        //         )
        //     }
            

        // }
    }
    componentDidMount(){

    }
    onChange(e){
        this.setState({
            [e.currentTarget.name]:e.currentTarget.value
        },()=>{
            this.props.onDataChanged(this.state);
        })
        
    }
    getBaseOptionsData = ()=>{
        let data = {
            parserName: this.state.parserName,
            topLevel: this.state.topLevel,
            headerIndex: this.state.headerIndex,
            dataIndex: this.state.dataIndex
        }
        return data;
    }
    render(){
        return (
            <Form.Row>
                <Form.Group className="col-auto">
                    <label htmlFor="multple">Parser Name</label>
                    <Form.Control size="sm" className="form-control-sm" type="text"  name="parserName" value={this.state.parserName||''} onChange={this.onChange}/>
                </Form.Group>
                <Form.Group className="col-auto">
                    <label htmlFor="multple">Contains Top Level</label>
                    <Form.Check type="checkbox" name="topLevel"  onChange={this.onChange} checked={this.state.topLevel||false}/>
                </Form.Group>
                <Form.Group className="col-auto">
                    <label htmlFor="multple">Header Index</label>
                    <Form.Control size="sm" className="form-control-sm" type="number"  name="headerIndex" min="1" value={this.state.headerIndex||1} onChange={this.onChange}/>
                </Form.Group>
                <Form.Group className="col-auto">
                    <label htmlFor="multple">Data Index</label>
                    <Form.Control size="sm" className="form-control-sm" type="number"  name="dataIndex" min="1" value={this.state.dataIndex||2} onChange={this.onChange}/>
                </Form.Group>
            </Form.Row>
        )
        
    }
}
export default BaseOptions;