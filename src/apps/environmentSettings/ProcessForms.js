import React from 'react';
import {Redirect} from 'react-router-dom';
import SDK from '../../sdk/SDK';
import Dialog from 'react-bootstrap-dialog'
import FormDesigner from '../tools/formDesigner/FormDesigner';

class ProcessForms extends React.Component{

    constructor(props){
        super(props);
        this.state = {
        }
    }

    render = ()=>{
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }else{
            return (
                <div className="container-fluid">
                    <h1 className="h3 mb-2 text-gray-800">Process Forms</h1>
                    <p className="mb-4">Setup fields for processes</p>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">RFQ</h6>
                        </div>
                        <div className="card-body">
                        </div>
                    </div>
                    <Dialog ref={(el) => { this.dialog = el }} />
                </div>
            );
        }
        
    }    

}

export default ProcessForms;