import React from 'react';
// with es5
import ReactGrid from '../../tools/ReactGrid/ReactGrid'
import SDK from '../../../sdk/SDK';
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import moment from 'moment';
import ConfirmDialog from '../../tools/ConfirmDialog';
import QueryGenerator from '../../tools/queryGenerator/QueryGenerator';

class DashRFQ extends React.Component{

    constructor(props){
        super(props);

        this.requestedTable = React.createRef();
        this.waitingPOTable = React.createRef();
        this.poSubmittedTable = React.createRef();
        this.poApprovedTable = React.createRef();
        this.confirmDialog = React.createRef();
        this.changeDateControl = React.createRef();
        
        
        this.reasonRef = React.createRef();
        this.notesRef = React.createRef();

        this.state = {
            mode:1,
            data:[],
            showRequestDate:false,
            archiveReasons:[]
        }

        let start = new Date();
        start.setHours(-start.getTimezoneOffset()/60,0,0,0);
        this.apiData =  {
            endpoint:'Find RFQ',
            method:'GET',
            queryParams:[
                { parameter:'request_date', displayParameter:'Request Date', inputType:'datetime-local'},
                { parameter:'requested_by', displayParameter:'Requested By', inputType:'text'},
                { parameter:'data.pm', displayParameter:'PM', inputType:'text'},
                { parameter:'organizationInfo.name', displayParameter:'Customer', inputType:'text'},
                { parameter:'projectInfo.itemnumber', displayParameter:'Assembly Number', inputType:'text'},
                { parameter:'revisionInfo.revision', displayParameter:'Revision', inputType:'text'},
                { parameter:'rfq_number', displayParameter:'RFQ Number', inputType:'text'},
                { parameter:'quotationNumber', displayParameter:'Quoation Number', inputType:'text'},
                { parameter:'quotationInfo.purchaseOrderInfo.data.customerPO', displayParameter:'Customer PO', inputType:'text'},
                { parameter:'productType.name', displayParameter:'Product Type', inputType:'text'},
                { parameter:'data.itar', displayParameter:'Product Type', inputType:'text'},
                { parameter:'status', displayParameter:'Status', inputType:'text'},
                { parameter:'archived', displayParameter:'Archived', inputType:'text', defaultOperator:'=', defaultValue:'NULL'},
                { parameter:'reason', displayParameter:'Reason', inputType:'text'},
                { parameter:'notes', displayParameter:'Notes', inputType:'text'},
                
            ],
            allowedPermission:[]
        }

    }

    componentDidMount(){
        var me = this;
        // this.updateData();
        this.updateArchiveReasons();
    }
    updateData = async ()=>{
        try{
            let data = await SDK.RFQ.getCustomerRFQs({q:`archived=NULL`,flatten:true});
            this.setState({
                data:data
            })
        }catch(err){

        }
    }
    updateArchiveReasons = async ()=>{
        try{
            let archiveReasons = await SDK.Lookups.findLookups({q:`process_type="Archive Reasons`});
            this.setState({
                archiveReasons:archiveReasons
            })
        }catch(err){

        }
    }
    searchWOs = async (q)=>{
        try{
            let data = await SDK.RFQ.getCustomerRFQs({q:q,flatten:true});
            this.setState({
                data:data
            })
        }catch(err){

        }
    }

    tryCancel = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){
                    
                    this.confirmDialog.current.showDialog('Confirm Cancel', 
                        <div>
                            <p>Are you sure you want to cancel {selectedRows[0].row.rfq_number}?</p><p>This cannot be undone</p>
                        </div>, 
                        async ()=>{
                            try{
                                let data = await SDK.RFQ.cancelRFQ(selectedRows[0].row.rfq_number)
                                this.updateData();

                            }catch(err){
                                alert(err)
                            }
                        }
                    );
                    // alert(JSON.stringify(data));
                    // alert(JSON.stringify(selectedRows[0].row))
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }
    tryArchive = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){
                    
                    this.confirmDialog.current.showDialog('Confirm Archive', 
                        <div>
                            <p>Are you sure you want to archive {selectedRows[0].row.rfq_number}?</p><p>This will archive the entire RFQ</p>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Reason</Form.Label>
                                    <Form.Control as="select" ref={this.reasonRef}>
                                        <option></option>
                                        {
                                            this.state.archiveReasons.map((row)=>{
                                                return <option value={row.lookup_name}>{row.lookup_name}</option>
                                            })
                                        }
                                        
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control as="textarea" type="text" placeholder="Notes" rows="4"  ref={this.notesRef}/>
                                </Form.Group>
                            </Form>
                        </div>, 
                        async ()=>{
                            try{


                                
                                let reason = '';
                                let notes = '';

                                if(this.reasonRef.current){
                                    reason = this.reasonRef.current.value;
                                }

                                if(this.notesRef.current){
                                    notes = this.notesRef.current.value;
                                }

                                let data = await SDK.RFQ.archiveRFQ(selectedRows[0].row.rfq_number, reason, notes)
                                this.updateData();

                            }catch(err){
                                alert(err)
                            }
                        }
                    );
                    // alert(JSON.stringify(data));
                    // alert(JSON.stringify(selectedRows[0].row))
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }

    unarchiveRFQ = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){
                    
                    let data = await SDK.RFQ.unarchiveRFQ(selectedRows[0].row.rfq_number)
                    this.updateData();
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }
    tryPushBack = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){

                    this.confirmDialog.current.showDialog('Confirm Pushback', 
                        <div>
                            <p>Are you sure you want to push back {selectedRows[0].row.rfq_number}?</p><p>This cannot be undone</p>
                        </div>, 
                        async ()=>{
                            try{
                                let data = await SDK.RFQ.pushBackRFQ(selectedRows[0].row.rfq_number, true)
                                this.updateData();

                            }catch(err){
                                alert(err)
                            }
                        }
                    );
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }
    tryPushBackQuotation = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){

                    this.confirmDialog.current.showDialog('Confirm Pushback', 
                        <div>
                            <p>Are you sure you want to push back {selectedRows[0].row.quotationInfo.quotationNumber}?</p><p>This cannot be undone</p>
                        </div>, 
                        async ()=>{
                            try{
                                let data = await SDK.Quotations.pushBackQuotation(selectedRows[0].row.quotationInfo.quotationNumber, true)
                                this.updateData();

                            }catch(err){
                                alert(err)
                            }
                        }
                    );
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }
    tryPushBackPurchaseOrder = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){

                    this.confirmDialog.current.showDialog('Confirm Pushback', 
                        <div>
                            <p>Are you sure you want to push back {selectedRows[0].row.quotationInfo.purchaseOrderInfo.purchaseOrderNumber}?</p><p>This cannot be undone</p>
                        </div>, 
                        async ()=>{
                            try{
                                let data = await SDK.PurchaseOrders.pushBackPurchaseOrder(selectedRows[0].row.quotationInfo.purchaseOrderInfo.purchaseOrderNumber, true)
                                this.updateData();

                            }catch(err){
                                alert(err)
                            }
                        }
                    );
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }
    tryChangeRequestDate = async(tableRef)=>{
        try{
            if(tableRef.current){
                let selectedRows = tableRef.current.getSelectedRows();
                if(selectedRows.length > 0){
                    //alert( JSON.stringify(selectedRows[0].request_date));
                    this.setState({
                        changeDateRow:selectedRows[0].row,
                        showRequestDate:true,
                    },()=>{
                        // alert(moment(selectedRows[0].row.request_date).local().format('YYYY-MM-DDTHH:mm'))
                        this.changeDateControl.current.value = moment(selectedRows[0].row.request_date).local().format('YYYY-MM-DDTHH:mm')
                        // moment(selectedRows[0].row.request_date).local().format('YY-MM-DDTHH:MM')
                        // this.changeDateControl.current.value = new Date(selectedRows[0].row.request_date).toISOString().slice(0, 16);
                    })
                    
                    // this.confirmDialog.current.showDialog('Confirm Archive', 
                    //     <div>
                    //         <p>Are you sure you want to archive {selectedRows[0].row.rfq_number}?</p><p>This will archive the entire RFQ</p>
                    //     </div>, 
                    //     async ()=>{
                    //         try{
                    //             let data = await SDK.RFQ.archiveRFQ(selectedRows[0].row.rfq_number)
                    //             this.updateData();

                    //         }catch(err){
                    //             alert(err)
                    //         }
                    //     }
                    // );
                    // alert(JSON.stringify(data));
                    // alert(JSON.stringify(selectedRows[0].row))
                }else{
                    alert("Nothing selected");
                }
            }
        }catch(err){
            alert(err);
        }
    }
    closeRequestModal = ()=>{
        this.setState({
            showRequestDate:false
        })
    }

    updateRequestDate = async ()=>{
        try{
            let value = this.changeDateControl.current.value;
            let rfq_number = this.state.changeDateRow.rfq_number;

            let sendData = JSON.parse(JSON.stringify(this.state.changeDateRow));
            sendData.request_date = value;
            let data = await SDK.RFQ.updateRFQInfo(sendData)
            this.state.changeDateRow.request_date = value;
            this.setState({
                showRequestDate:false
            })
        }catch(err){
            alert("Unable to update request date");
            console.error(err);
        }
    }


    render = ()=>{

        let checklistColumns = [
            { key: "request_date", name: "Request Date", resizable: true, formatter:({value})=>{
                return moment(value).local().format('MM/DD/YYYY hh:mma')
            }, exportFormatter:({value})=>{
                return (value?new Date(value):null);
            }},
            {key:"requested_by",name:'Requested By', formatter:({value})=>{
                return value?value.split('@')[0]:''
            }, exportFormatter:({value})=>{
                return value?value.split('@')[0]:''
            }},
            { key: "quotation_date", name: "Submitted Date", resizable: true, formatter:({value,row})=>{
                if(row.quotationInfo){
                    return row.quotationInfo.request_date?moment(row.quotationInfo.request_date).local().format('MM/DD/YYYY hh:mma'):''
                }else{
                    return '';
                }
                // return moment(value).local().format('MM/DD/YYYY hh:mma')
            }, exportFormatter:({value,row})=>{
                if(row.quotationInfo){
                    return row.quotationInfo.request_date?new Date(row.quotationInfo.request_date):null;
                }else{
                    return '';
                }
            },formatIfEmpty:true},
            {key:"quotation_user",name:'Submitted By', formatter:({value, row})=>{
                if(row.quotationInfo){
                    return row.quotationInfo.requested_by?row.quotationInfo.requested_by.split('@')[0]:''
                }else{
                    return '';
                }
            }, exportFormatter:({value,row})=>{
                if(row.quotationInfo){
                    return row.quotationInfo.requested_by?row.quotationInfo.requested_by.split('@')[0]:''
                }else{
                    return '';
                }
            },formatIfEmpty:true},
            {key:"PM",name:'PM', formatter:({value, row})=>{
                return row.data?row.data.pm:''
            }, exportFormatter:({value, row})=>{
                return row.data?row.data.pm:''
            }, sortValue:({value, row})=>{
                return row.data?row.data.pm:''
            },formatIfEmpty:true},
            {key:"organizationInfo",name:'Customer',formatter:({value})=>{
                return <a href={'/organization/'+ value.name}>{value.name}</a>
            },exportFormatter:({value})=>{
                return value.name;
            },
            sortValue:({value,row})=>{
                return value.name;
            }},
            {key:"projectInfo",name:'Assembly Number',formatter:({value})=>{
                return <a href={'/project/'+ value._id}>{value.itemnumber}</a>
            },exportFormatter:({value})=>{
                return value.itemnumber;
            },
            sortValue:({value,row})=>{
                return value.itemnumber;
            }},
            {key:"revisionInfo",name:'Revision',formatter:({value,row})=>{
                return value.revision;
            },
            sortValue:({value,row})=>{
                return value.revision;
            }},
            {key:"rfq_number",name:'RFQ ID',formatter:({value})=>{
                return <a href={'/rfq/'+value}>{value}</a>
            },exportFormatter:({value})=>{
                return value
            }},
            {key:"quotationNumber",name:'Quotation#',formatter:({value, row})=>{
                if(row.quotationInfo){
                    return <a href={'/quotation/'+row.quotationInfo.quotationNumber}>{row.quotationInfo.quotationNumber}</a>
                }else{
                    return null;
                }
                
            },exportFormatter:({value, row})=>{
                if(row.quotationInfo){
                    return row.quotationInfo.quotationNumber
                }else{
                    return null;
                }
                return value
            }, formatIfEmpty:true},
            {key:"Customer PO",name:'Customer PO',formatter:({value,row})=>{
                    if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo){
                        return <a href={'/purchaseOrder/'+row.quotationInfo.purchaseOrderInfo.purchaseOrderNumber}>{row.quotationInfo.purchaseOrderInfo?row.quotationInfo.purchaseOrderInfo.data.customerPO:''}</a>
                    }else{
                        return '';
                    }
                
                },exportFormatter:({value,row})=>{
                    if(row.quotationInfo && row.quotationInfo.purchaseOrderNumber){
                        return row.quotationInfo.purchaseOrderInfo.data.customerPO
                    }else{
                        return '';
                    }
                
                },
                sortValue:({value,row})=>{
                    return value.purchaseOrderInfo?value.purchaseOrderInfo.data.customerPO:'';
                },
                formatIfEmpty:true
            },
            // {key:"orderType",name:'Order Type',formatter:({value,row})=>{
            //     return value?value.order_type:null;
            // },
            // sortValue:({value,row})=>{
            //     return value?value.order_type:null;
            // }},
            {key:"productType",name:'Product Type',formatter:({value,row})=>{
                return value?value.product_name:null;
            },
            sortValue:({value,row})=>{
                return value?value.product_name:null;
            }},
            {key:"itar",name:'ITAR',formatter:({value,row})=>{
                return row.data.itar === 'yes'?'Yes':row.data.itar==='no'?'No':row.data.itar?'Yes':'No';
            },formatIfEmpty:true,
                sortValue:({value,row})=>{
                    return row.data.itar === 'yes'?'Yes':row.data.itar==='no'?'No':row.data.itar?'Yes':'No';
                }
            },
            {key:"Qty",name:'Qty',formatter:({value, row})=>{
                return Array.isArray(row.data.quantity)?
                row.data.quantity.map((item)=>{return item.quantity}).join(','):
                row.data.quantity
            }, formatIfEmpty:true,
            sortValue:({value,row})=>{
                return Array.isArray(row.data.quantity)?row.data.quantity[0].quantity:row.data.quantity
            }},
            {key:"LeadTime",name:'Lead Time',formatter:({value, row})=>{
                return Array.isArray(row.data.quantity)?
                row.data.quantity.map((item)=>{return item.leadTime}).join(','):
                null
            }, formatIfEmpty:true,
            sortValue:({value,row})=>{
                return Array.isArray(row.data.quantity)?row.data.quantity[0].leadTime:null
            }},
            // {key:"status",name:'Status_code',formatIfEmpty:true, formatter:({value, row})=>{
            //     return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?'PO Submitted':row.quotationNumber?'Quotation Submitted':'Requested';
            // }},
            // {key:"status_name",name:'Status', formatter:({value, row})=>{
            //     if(row.quotationInfo){
            //         if(row.quotationInfo.purchaseOrderInfo){
            //             return row.quotationInfo.purchaseOrderInfo.status_name
            //         }else{
            //             return row.quotationInfo.status;
            //         }
            //     }else{
            //         return row.status_name;
            //     }
            //     // return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?'PO Submitted':row.quotationNumber?'Quotation Submitted':'Requested';
            // },
            // sortValue:({value,row})=>{
            //     if(row.quotationInfo){
            //         if(row.quotationInfo.purchaseOrderInfo){
            //             return row.quotationInfo.purchaseOrderInfo.status_name
            //         }else{
            //             return row.quotationInfo.status;
            //         }
            //     }else{
            //         return row.status_name;
            //     }
            // }},
            
            {key:"checklistStatus",name:'Checklist Status',formatIfEmpty:true, formatter:({value, row})=>{
                return (row.quotationInfo&&row.quotationInfo.purchaseOrderInfo&&row.quotationInfo.purchaseOrderInfo.checklist&&row.quotationInfo.purchaseOrderInfo.checklist.completeQty)?
                    (row.quotationInfo.purchaseOrderInfo.checklist.complete?'Complete':
                    ((row.quotationInfo.purchaseOrderInfo.checklist.completeQty||0) + '/' + row.quotationInfo.purchaseOrderInfo.checklist.totalQty))
                    :'Not Started';
            },
            sortValue:({value,row})=>{
                return (row.quotationInfo&&row.quotationInfo.purchaseOrderInfo&&row.quotationInfo.purchaseOrderInfo.checklist&&row.quotationInfo.purchaseOrderInfo.checklist.completeQty)?
                    (row.quotationInfo.purchaseOrderInfo.checklist.complete?'Complete':
                    ((row.quotationInfo.purchaseOrderInfo.checklist.completeQty||0) + '/' + row.quotationInfo.purchaseOrderInfo.checklist.totalQty))
                    :'Not Started';
            }},
            { key: "lastUpdate_date", name: "Modified Date", resizable: true, formatter:({value,row})=>{
                if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo){
                    return row.quotationInfo.purchaseOrderInfo.lastUpdate_date?moment(row.quotationInfo.purchaseOrderInfo.lastUpdate_date).local().format('MM/DD/YYYY hh:mma'):''
                }else{
                    return '';
                }
                // return moment(value).local().format('MM/DD/YYYY hh:mma')
            }, exportFormatter:({value,row})=>{
                if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo){
                    return row.quotationInfo.purchaseOrderInfo.lastUpdate_date?new Date(row.quotationInfo.purchaseOrderInfo.lastUpdate_date):null;
                }else{
                    return '';
                }
            },formatIfEmpty:true},
            {key:"lastUpdate_by",name:'Modified By', formatter:({value, row})=>{
                if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo){
                    return row.quotationInfo.purchaseOrderInfo.lastUpdate_by?row.quotationInfo.purchaseOrderInfo.lastUpdate_by.split('@')[0]:''
                }else{
                    return 'TEST';
                }
            }, exportFormatter:({value,row})=>{
                if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo){
                    return row.quotationInfo.purchaseOrderInfo.lastUpdate_by?row.quotationInfo.purchaseOrderInfo.lastUpdate_by.split('@')[0]:''
                }else{
                    return '';
                }
            },formatIfEmpty:true},
            {key:"archived",name:'Archived',formatter:({value,row})=>{
                return value?'Yes':'No';
            },formatIfEmpty:true,
                sortValue:({value,row})=>{
                    return value?'Yes':'No';
                }
            },
            {key:"reason",name:'Reason'},
            {key:"notes",name:'Notes'},
            {key:"status_name",name:'Status', formatter:({value, row})=>{
                if(row.quotationInfo){
                    if(row.quotationInfo.purchaseOrderInfo){
                        return row.quotationInfo.purchaseOrderInfo.status_name
                    }else{
                        return row.quotationInfo.status_name;
                    }
                }else{
                    return row.status_name;
                }
                // return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?'PO Submitted':row.quotationNumber?'Quotation Submitted':'Requested';
            },
            sortValue:({value, row})=>{
                if(row.quotationInfo){
                    if(row.quotationInfo.purchaseOrderInfo){
                        return row.quotationInfo.purchaseOrderInfo.status_name
                    }else{
                        return row.quotationInfo.status_name;
                    }
                }else{
                    return row.status_name;
                }
                // return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?'PO Submitted':row.quotationNumber?'Quotation Submitted':'Requested';
            }},
        ]
        let requested = this.state.data.filter(x=>{
            return x.status === 'Requested'
        })
        let quotations = this.state.data.filter(x=>{
            return x.status === 'Quotation Submitted' && x.quotationInfo && x.quotationInfo.status !== 'PO Submitted'
            //return x.quotationInfo && x.quotationInfo.purchaseOrderNumber == null
        })
        let poSubmitted = this.state.data.filter(x=>{
            return true;
            return x.status === 'Quotation Submitted' && x.quotationInfo && x.quotationInfo.status === 'PO Submitted' && x.quotationInfo && x.quotationInfo.purchaseOrderInfo && x.quotationInfo.purchaseOrderInfo.status !== 'PO Approved'
            // return x.quotationInfo && x.quotationInfo.purchaseOrderNumber != null && x.quotationInfo.purchaseOrderInfo.status !== 'PO Approved'
        })
        let checklist = this.state.data.filter(x=>{
            return true;
            return x.quotationInfo && x.quotationInfo.purchaseOrderNumber != null && x.quotationInfo.purchaseOrderInfo.status === 'PO Approved'
        })

        return (
            <>
                <Form.Row>
                    <Col md={3}>
                        
                        <QueryGenerator data={this.apiData} paramWidth={12} onQueryGenerated={(data)=>{this.searchWOs(data)}}/>
                    </Col>
                    <Col md="9">
                        <Card>
                            <Card.Header>
                                RFQs
                            </Card.Header>
                            {/* <Card.Body>
                                <Row>
                                    <Col md="3" className={this.state.mode===1?'highlight':''}>
                                        Requested
                                        <h3 onClick={()=>{this.setState({mode:1})}} style={{"cursor":"pointer"}}>{requested.length}</h3>
                                    </Col>
                                    <Col md="3" className={this.state.mode===2?'highlight':''}>
                                        Waiting for PO
                                        <h3 onClick={()=>{this.setState({mode:2})}} style={{"cursor":"pointer"}}>{quotations.length}</h3>
                                    </Col>
                                    <Col md="3" className={this.state.mode===3?'highlight':''}>
                                        PO Submitted
                                        <h3 onClick={()=>{this.setState({mode:3})}} style={{"cursor":"pointer"}}>{poSubmitted.length}</h3>
                                    </Col>
                                    <Col md="3" className={this.state.mode===4?'highlight':''}>
                                        PO Approved
                                        <h3 onClick={()=>{this.setState({mode:4})}} style={{"cursor":"pointer"}}>{checklist.length}</h3>
                                    </Col>
                                </Row>
                            </Card.Body> */}
                            <Card.Body>
                                        <ReactGrid
                                            ref={this.poApprovedTable}
                                            columns={checklistColumns}
                                            rowGetter={i=> checklist[i]}
                                            rowsCount={checklist.length} 
                                            sortable={true}
                                            buttons={[
                                                <Button size="sm" variant="danger" className="ml-1" onClick={(e)=>{this.tryCancel(this.poApprovedTable)}}>Cancel</Button>,
                                                <Button size="sm" variant="info" className="ml-1" onClick={(e)=>{this.tryPushBackPurchaseOrder(this.poApprovedTable)}}>Push Back</Button>,
                                                <Button size="sm" variant="warning" className="ml-1" onClick={(e)=>{this.tryArchive(this.poApprovedTable)}}>Archive</Button>,
                                                <Button size="sm" variant="success" className="ml-1" onClick={(e)=>{this.unarchiveRFQ(this.poApprovedTable)}}>Unarchive</Button>,
                                                <Button size="sm" variant="info" className="ml-1" onClick={(e)=>{this.tryChangeRequestDate(this.poApprovedTable)}}>Change Request Date</Button>,
                                            ]}
                                        />
                            </Card.Body>
                            <ConfirmDialog ref={this.confirmDialog}/>
                            {/* <Card.Body>
                                <pre>
                                    {
                                        JSON.stringify(this.state.data, null, 2)
                                    }
                                </pre>
                            </Card.Body> */}
                            <Modal show={this.state.showRequestDate} onHide={this.closeRequestModal}>
                                <Modal.Header closeButton>
                                <Modal.Title>Change Request Date for {this.state.changeDateRow?this.state.changeDateRow.rfq_number:''}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Control ref={this.changeDateControl} type="datetime-local"></Form.Control>
                                    {/* <pre>{JSON.stringify(this.state.changeDateRow,null,2)}</pre> */}
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={this.closeRequestModal}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={this.updateRequestDate}>
                                    Save Changes
                                </Button>
                                </Modal.Footer>
                            </Modal>
                        </Card>
                    </Col>
                </Form.Row>
            </>
            
        );
    }

}

export default  DashRFQ;