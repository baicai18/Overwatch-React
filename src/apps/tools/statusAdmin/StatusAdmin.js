import React from 'react';
// with es5
import ReactGrid from '../../tools/ReactGrid/ReactGrid'
import {RFQ} from '../../../sdk/SDK';
import { Card, Row, Col } from 'react-bootstrap';
import SDK from '../../../SDK/SDK';


class StatusAdmin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            mode:1,
            data:[],
        }

    }

    componentDidMount(){
        var me = this;
        this.updateData();
    }
    updateData = async ()=>{
        try{
            let data = await SDK.Statuses.findStatuses({process_type:this.props.process_type});
            this.setState({
                data:data
            })
        }catch(err){

        }
    }
    render = ()=>{
        let rfqColumns = [
            {key:"organizationInfo",name:'Customer',formatter:({value})=>{
                return <a href={'/organization/'+ value.name}>{value.name}</a>
            },exportFormatter:({value})=>{
                return value.name;
            }},
            {key:"projectInfo",name:'Itemnumber',formatter:({value})=>{
                return <a href={'/project/'+ value._id}>{value.itemnumber}</a>
            },exportFormatter:({value})=>{
                return value.itemnumber;
            }},
            {key:"revisionInfo",name:'Revision',formatter:({value,row})=>{
                return value.revision;
            }},
            {key:"rfq_number",name:'RFQ ID',formatter:({value})=>{
                return <a href={'/rfq/'+value}>{value}</a>
            },exportFormatter:({value})=>{
                return value
            }},
            {key:"data",name:'Qty',formatter:({value})=>{
                return value.quantity
            }},
            {key:"status",name:'Status',formatIfEmpty:true, formatter:({value, row})=>{
                return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?'PO Submitted':row.quotationNumber?'Quotation Submitted':'Requested';
            }},
            // {key:"requested_by",name:'Requested By'},
            {key:"request_date",name:'Request Date'},
        ]
        let quotationColumns = [
            {key:"organizationInfo",name:'Customer',formatter:({value})=>{
                return <a href={'/organization/'+ value.name}>{value.name}</a>
            },exportFormatter:({value})=>{
                return value.name;
            }},
            {key:"projectInfo",name:'Itemnumber',formatter:({value})=>{
                return <a href={'/project/'+ value._id}>{value.itemnumber}</a>
            },exportFormatter:({value})=>{
                return value.itemnumber;
            }},
            {key:"revisionInfo",name:'Revision',formatter:({value,row})=>{
                return value.revision;
            }},
            {key:"rfq_number",name:'RFQ ID',formatter:({value})=>{
                return <a href={'/rfq/'+value}>{value}</a>
            },exportFormatter:({value})=>{
                return value
            }},
            {key:"quotationNumber",name:'Quotation#',formatter:({value})=>{
                return <a href={'/quotation/'+value}>{value}</a>
            },exportFormatter:({value})=>{
                return value
            }},
            {key:"data",name:'Qty',formatter:({value})=>{
                return value.quantity
            }},
            {key:"status",name:'Status',formatIfEmpty:true, formatter:({value, row})=>{
                return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?'PO Submitted':row.quotationNumber?'Quotation Submitted':'Requested';
            }},
            // {key:"requested_by",name:'Requested By'},
            {key:"request_date",name:'Request Date'},
        ]
        let poColumns = [
            {key:"organizationInfo",name:'Customer',formatter:({value})=>{
                return <a href={'/organization/'+ value.name}>{value.name}</a>
            },exportFormatter:({value})=>{
                return value.name;
            }},
            {key:"projectInfo",name:'Itemnumber',formatter:({value})=>{
                return <a href={'/project/'+ value._id}>{value.itemnumber}</a>
            },exportFormatter:({value})=>{
                return value.itemnumber;
            }},
            {key:"revisionInfo",name:'Revision',formatter:({value,row})=>{
                return value.revision;
            }},
            {key:"rfq_number",name:'RFQ ID',formatter:({value})=>{
                return <a href={'/rfq/'+value}>{value}</a>
            },exportFormatter:({value})=>{
                return value
            }},
            {key:"quotationNumber",name:'Quotation#',formatter:({value})=>{
                return <a href={'/quotation/'+value}>{value}</a>
            },exportFormatter:({value})=>{
                return value
            }},
            {key:"quotationInfo",name:'Customer PO',formatter:({value})=>{
                    if(value.purchaseOrderNumber){
                        return <a href={'/purchaseOrder/'+value.purchaseOrderNumber}>{value.purchaseOrderInfo.data.customerPO}</a>
                    }else{
                        return '';
                    }
                
                },exportFormatter:({value})=>{
                    if(value.purchaseOrderNumber){
                        return value.purchaseOrderInfo.data.customerPO
                    }else{
                        return '';
                    }
                
                }
            },
            {key:"data",name:'Qty',formatter:({value})=>{
                return value.quantity
            }},
            {key:"status",name:'Status',formatIfEmpty:true, formatter:({value, row})=>{
                return row.quotationInfo&&row.quotationInfo.purchaseOrderNumber?
                    (row.quotationInfo.purchaseOrderInfo.checklist?
                        row.quotationInfo.purchaseOrderInfo.checklist.complete == null?'PO Submitted'
                        :row.quotationInfo.purchaseOrderInfo.checklist.complete?'Checklist Complete'
                        :'Checklist in Process'
                    :'PO Submitted')
                    :row.quotationNumber?'Quotation Submitted':'Requested';
            }},
            // {key:"requested_by",name:'Requested By'},
            {key:"request_date",name:'Request Date'},
        ]
        let requested = this.state.data.filter(x=>{
            return x.quotationNumber == null
        })
        let quotations = this.state.data.filter(x=>{
            return x.quotationInfo && x.quotationInfo.purchaseOrderNumber == null
        })
        let poSubmitted = this.state.data.filter(x=>{
            return x.quotationInfo && x.quotationInfo.purchaseOrderNumber != null
        })

        return (
            <Card>
                <Card.Header>
                    RFQs
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md="4" className={this.state.mode===1?'highlight':''}>
                            Requested
                            <h3 onClick={()=>{this.setState({mode:1})}} style={{"cursor":"pointer"}}>{requested.length}</h3>
                        </Col>
                        <Col md="4" className={this.state.mode===2?'highlight':''}>
                            Waiting for PO
                            <h3 onClick={()=>{this.setState({mode:2})}} style={{"cursor":"pointer"}}>{quotations.length}</h3>
                        </Col>
                        <Col md="4" className={this.state.mode===3?'highlight':''}>
                            PO Submitted
                            <h3 onClick={()=>{this.setState({mode:3})}} style={{"cursor":"pointer"}}>{poSubmitted.length}</h3>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Body>
                    {
                        this.state.mode === 1?
                        
                            <ReactGrid
                                columns={rfqColumns}
                                rowGetter={i=> requested[i]}
                                rowsCount={requested.length} 
                                sortable={true}
                            />
                        :this.state.mode === 2?
                            <ReactGrid
                                columns={quotationColumns}
                                rowGetter={i=> quotations[i]}
                                rowsCount={quotations.length} 
                                sortable={true}
                            />
                        :this.state.mode === 3?
                            <ReactGrid
                                columns={poColumns}
                                rowGetter={i=> poSubmitted[i]}
                                rowsCount={poSubmitted.length} 
                                sortable={true}
                            />
                        :
                        <ReactGrid
                            columns={rfqColumns}
                            rowGetter={i=> this.state.data[i]}
                            rowsCount={this.state.data.length} 
                            sortable={true}
                            
                        />

                    }
                </Card.Body>
                {/* <Card.Body>
                    <pre>
                        {
                            JSON.stringify(this.state.data, null, 2)
                        }
                    </pre>
                </Card.Body> */}
            </Card>
        );
    }

}

export default  StatusAdmin;