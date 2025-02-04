import React from 'react';

import {Form} from 'react-bootstrap';

class FileRequirements extends React.Component { 
    constructor(props){
        super(props);
        this.lastKey=0;

        this.state={
            index:props.index,
            fileData:props.fileData || {},
        }
        this.controlChanged = this.controlChanged.bind(this);
    }

    render() {
        return (
            <Form>
                <Form.Row>
                    <Form.Group>
                        <Form.Label>Allowed Extensions</Form.Label>
                        <Form.Control name="allowedExtensions" as="textarea" rows="4" value={this.state.fileData.allowedExtensions} onChange={this.controlChanged}/>
                    </Form.Group>
                </Form.Row>
            </Form>
        )
        
    }
    controlChanged(e){
        var fileData = this.state.fileData;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        fileData[e.currentTarget.name] = value;

        this.setState({
            fileData:fileData
        }, ()=>{
            if(this.props.onFileDataChanged){
                this.props.onFileDataChanged(this.state.fileData);
            }

        })
        
        

    }
}

export default FileRequirements;