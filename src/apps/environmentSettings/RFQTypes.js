import React from 'react';

import {Container, Card} from 'react-bootstrap';
import RFQ from './rfqs/RFQ';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SDK from '../../sdk/SDK';
import EditRFQ from './rfqs/EditRFQ';

class RFQTypes extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            rfqs:[]
        }
        this.newRFQ = this.newRFQ.bind(this);
        this.rfqChanged = this.rfqChanged.bind(this);
        this.updateRFQs = this.updateRFQs.bind(this);
        this.editRFQ = React.createRef();
    }

    componentDidMount(){
        this.updateRFQs();
    }
    rfqSaved = (data)=>{
        this.updateRFQs();
    }
    rfqDeleted = (data)=>{
        this.updateRFQs();
    }
    render() {
        return (
            <Container fluid>
                <Card>
                    <Card.Header className="card-header-border">
                        RFQ Types
                        <div className="header-actions">
                            <a onClick={this.newRFQ}>
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                    </Card.Body>
                    <Card.Body>
                    {
                        this.state.rfqs.length > 0 ?
                            this.state.rfqs.map((x, index)=>{
                                return <RFQ key={x._id} index={index} rfq={x} onDataChanged={this.rfqChanged} onSave={this.rfqSaved} onDelete={this.rfqDeleted}/>
                            })
                        :
                        <p>No rfqs types created yet click the + to add</p>
                    }
                    </Card.Body>
                </Card>
                <EditRFQ ref={this.editRFQ} handleClose={this.rfqClosed} onSave={this.rfqSaved}/>
            </Container>
        )
    }
    updateRFQs(){
        SDK.RFQTypes.getRFQTypes()
        .then(data=>{
            this.setState({
                rfqs:data||[]
            })
        })
    }

    rfqChanged(index, rfq){
        var rfqs = this.state.rfqs;
        rfqs[index] = rfq;
        this.setState({
            rfqs:rfqs
        })
    }
    newRFQ(){
        this.editRFQ.current.showModal();
        return;
        var editing = false;
        for(var x = 0; x < this.state.rfqs.length; x++){
            if(this.state.rfqs[x].editing){
                editing = true;
            }
        }
        if(editing){
            alert("Please save changes to current open rfq");
        }else{
            var rfqs = this.state.rfqs;
            rfqs.push({
                new:true,
                editing:true,
            })
            this.setState({
                rfqs:rfqs
            });
        }
    }
    getRFQTypes(){

    }
}

export default RFQTypes;