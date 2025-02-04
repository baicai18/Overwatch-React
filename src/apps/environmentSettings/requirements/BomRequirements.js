import React from 'react';

import {Form} from 'react-bootstrap';

class BomRequirements extends React.Component { 
    constructor(props){
        super(props);
        this.lastKey=0;

        this.state={
            index:props.index,
            bomData:props.bomData || {},
        }
        this.controlChanged = this.controlChanged.bind(this);
    }

    render() {
        return (
            <Form>
                <Form.Row>
                    <Form.Group>
                        <Form.Label>Allowed File Upload Only</Form.Label>
                        <Form.Check name="allowFileOnly" value={true} checked={this.state.bomData.allowFileOnly} onChange={this.controlChanged}/>
                    </Form.Group>
                </Form.Row>
            </Form>
        )
        
    }
    controlChanged(e){
        var bomData = this.state.bomData;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        bomData[e.currentTarget.name] = value;

        this.setState({
            bomData:bomData
        }, ()=>{
            if(this.props.onBomDataChanged){
                this.props.onBomDataChanged(this.state.bomData);
            }

        })
        
        

    }
}

export default BomRequirements;