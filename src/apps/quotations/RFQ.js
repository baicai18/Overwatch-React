import React from 'react';
// with es5
import {Col, Card, Row, Button, Badge} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import ProjectDeliverable from '../projects/ProjectDeliverable';
import SDK from '../../sdk/SDK';
import auth from '../../auth';
import SubmitQuotation from './SubmitQuotation';
import RFQInfo from './RFQInfo';
import ConfirmDialog from '../tools/ConfirmDialog';


class RFQ extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            editing:false,
            rfq_number: props.match.params.rfq_number,
            rfqInfo:{},
            modified:false
        }
        this.quotationModal = React.createRef();
        this.rfqInfo = React.createRef();
        this.confirmDialog = React.createRef();
    }

    componentDidMount(){
        this.getRFQInfo();
    }
    getRFQInfo = async()=>{
        try{
            let data = await SDK.RFQ.getRFQ(this.state.rfq_number);
            if(data){
                //found
                let form = data.formId?await SDK.Forms.getForm(data.formId):{};
                let formDesign = form.formId?await SDK.Forms.getFormDesign(form.formId):{};
                let revision = data.project.revisions.find((x)=>{
                    return x._id == data.revision_id
                })

                this.setState({
                    formDesign:formDesign,
                    form:form,
                    rfqInfo:data,
                    revision:revision,
                    project:data.project
                });
            }else{
                alert("NOT FOUND");
            }
            
        }catch(err){
            alert(err);
        }
    }
    
    showRequestModal = ()=>{
        this.quotationModal.current.showModal();
    }

    submitQuotation = ()=>{
        this.rfqInfo.current.updateInfo();
        alert("Saved");
        this.getRFQInfo();
    }

    toggleEdit = ()=>{
        this.setState({
            editing:!this.state.editing,
            //modified:false
        },()=>{
            if(!this.state.editing){
                this.rfqInfo.current.updateInfo();
            }
            this.setModified(false);
        })
    }

    tryReject = async()=>{
        this.confirmDialog.current.showDialog('Confirm Reject', 'Are you sure you want to proceed?', this.rejectRFQ);
        
    }

    rejectRFQ = async()=>{
        try{
            await SDK.RFQ.rejectRFQ(this.state.rfqInfo.rfq_number);
            this.rfqInfo.current.updateInfo();
            this.getRFQInfo();
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    saveChanges=()=>{
        this.rfqInfo.current.trySave();
    }
    unarchiveRFQ=()=>{
        this.rfqInfo.current.unarchiveRFQ();
        this.getRFQInfo();
    }

    
    deliverableSaved = async (data)=>{
        console.log(data);
        await this.getRFQInfo(this.state.project_id);
        this.forceUpdate();
    }


    setModified  = (value)=>{
        if(value){
            window.onbeforeunload = function(event) {
                event.returnValue = "Write something clever here..";
            };
        }else{
            window.onbeforeunload = null;
            
        }
        this.setState({
            modified:value
        })
    }

    render = ()=>{
        return (
            <div className="container-fluid">
                <Card>
                    <Card.Header>
                        <h6 className="m-0 font-weight-bold text-primary">Request For Quotation  </h6>
                        <div className="header-actions">
                            {this.state.modified?<Badge><i class="fa fas fa-triangle-exclamation"></i> Warning  you have unsaved changed</Badge>:null} 
                            {
                                auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") 
                                //&& !this.state.rfqInfo.quotationNumber
                                ?
                                <button className="btn btn-primary btn-sm" onClick={this.showRequestModal}>Submit Quote</button>
                                :''
                            }
                            {/* {
                                auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") && !this.state.rfqInfo.quotationNumber?
                                <Button size="sm" variant="danger" onClick={this.tryReject}>Reject</Button>
                                :''
                            } */}
                            <button className="btn btn-primary btn-sm" onClick={this.toggleEdit}>{this.state.editing?'Cancel':'Edit'}</button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <RFQInfo readOnly={!this.state.editing} ref={this.rfqInfo} key={this.state.rfq_number} rfq_number={this.state.rfq_number} showQuote={true} onModified={()=>{this.setModified(true)}} onSaved={()=>{this.setModified(false)}}/>
                        {/* <Row>
                            <Col md={6}>
                                
                            </Col> */}
                            {/* <Col md={6}>
                                <Card>
                                    <Card.Header>
                                        Requirements
                                    </Card.Header>
                                    <Card.Body>
                                        {
                                            this.state.rfqInfo.project?
                                            this.state.rfqInfo.project.productType?
                                            this.state.rfqInfo.project.productType.requirements.map((x,index)=>{
                                                return <ProjectDeliverable 
                                                    key={index}
                                                    project={this.state.project}
                                                    revision={this.state.revision} 
                                                    requirement={x.requirement} 
                                                    deliverable={
                                                        this.state.revision.deliverables?
                                                        this.state.revision.deliverables.find((element)=>{
                                                            return element.requirement === x.requirement_id
                                                        })
                                                        :{}
                                                    }
                                                    onSaved={this.deliverableSaved}
                                                    />
                                            })
                                            :''
                                            :''
                                        }
                                    </Card.Body>
                                </Card>
                            </Col> */}
                        {/* </Row> */}
                        
                    </Card.Body>
                    {
                        this.state.editing?
                        <Card.Footer><Button size="sm" onClick={this.saveChanges}>Save</Button></Card.Footer>
                        :''
                    }
                </Card>
                <SubmitQuotation ref={this.quotationModal} rfq_number={this.state.rfq_number} onSubmit={this.submitQuotation}/>
                <ConfirmDialog ref={this.confirmDialog}/>
            </div>
        );
    }
    

}

export default  RFQ;