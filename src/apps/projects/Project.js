import React from 'react';
import {Card, Form, Row, Col, Button, Dropdown, Badge, Table, FormControl} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import ProjectDeliverable from './ProjectDeliverable';
import RequestQuotation from '../quotations/RequestQuotation';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import auth from '../../auth';
import NewRevisionModal from './NewRevisionModal';
import ChangeOrganizationModal from './ChangeOrganizationModal';
import ChangeProductTypeModal from './ChangeProductTypeModal';
import ConfirmDialog from '../tools/ConfirmDialog';
import moment from 'moment';


class Projects extends React.Component{
    constructor(props){
        super(props);

        this.quotationModal = React.createRef();
        this.newRevisionModal = React.createRef();
        this.confirmDialog = React.createRef();
        this.changeOrganizationModal = React.createRef();
        this.changeProductTypeModal = React.createRef();
        this.state = {
            project_id:props.match.params.id,
            project:{},
            productType:null,
            product_type:null
        }

        this.columns = [
            { key: "request_date", name: "Request Date", resizable: true, formatter:({value})=>{
                return moment(value).local().format('MM/DD/YYYY hh:mma')
            }, exportFormatter:({value})=>{
                return (value?new Date(value):null);
            }, sortValue:({value})=>{
                return moment(value).local().format('MM/DD/YYYY hh:mma')
            }},
            {key:"requested_by",name:'Requested By', formatter:({value})=>{
                return value?value.split('@')[0]:''
            }, exportFormatter:({value})=>{
                return value?value.split('@')[0]:''
            }, sortValue:({value})=>{
                return value?value.split('@')[0]:''
            }},
            { key: "quotation_date", name: "Submitted Date", resizable: true, formatter:({value,row})=>{
                if(row.quotation_date){
                    return row.quotation_date?moment(row.quotation_date).local().format('MM/DD/YYYY hh:mma'):''
                }else{
                    return '';
                }
                // return moment(value).local().format('MM/DD/YYYY hh:mma')
            }, exportFormatter:({value,row})=>{
                if(row.quotation_date){
                    return row.quotation_date?new Date(row.quotation_date):null;
                }else{
                    return '';
                }
            },formatIfEmpty:true},
            {key:"quotation_user",name:'Submitted By', formatter:({value, row})=>{
                if(row.quotation_user){
                    return row.quotation_user?row.quotation_user.split('@')[0]:''
                }else{
                    return '';
                }
            }, exportFormatter:({value,row})=>{
                if(row.quotationInfo){
                    return row.quotation_user?row.quotation_user.split('@')[0]:''
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
            // {key:"_id",name:'ID',formatter:({value})=>{
            //     return <a href={'/rfq/'+value}>{value}</a>
            // }},
            {key:"rfq_number",name:'RFQ ID',formatter:({value})=>{
                return <a href={'/rfq/'+value}>{value}</a>
            }},
            {key:"quotationInfo",name:'Quotation#',formatter:({value})=>{
                return <a href={'/quotation/'+value.quotationNumber}>{value.quotationNumber}</a>
            },exportFormatter:({value})=>{
                return value.quotationNumber
            },sortValue:({value})=>{
                if(value){
                    return value.quotationNumber
                }else{
                    return '';
                }
            }},
            {key:"customerPO",name:'Customer PO',formatter:({value,row})=>{
                if(row.quotationInfo){
                    if(row.quotationInfo.purchaseOrderNumber){
                        return <a href={'/purchaseOrder/'+row.quotationInfo.purchaseOrderNumber}>{row.quotationInfo.purchaseOrderInfo?row.quotationInfo.purchaseOrderInfo.data.customerPO:''}</a>
                    }else{
                        return '';
                    }
                }else{
                    return '';
                }
                
                },exportFormatter:({value,row})=>{
                    if(row.quotationInfo){
                        if(row.quotationInfo.purchaseOrderNumber){
                            return row.quotationInfo.purchaseOrderInfo.data.customerPO
                        }else{
                            return '';
                        }
                    }else{
                        return '';
                    }
                
                },sortValue:({value,row})=>{
                    if(row.quotationInfo){
                        if(row.quotationInfo.purchaseOrderNumber){
                            return row.quotationInfo.purchaseOrderInfo.data.customerPO
                        }else{
                            return '';
                        }

                    }else{
                        return '';
                    }
                
                },formatIfEmpty:true
            },
            // {key:"orderType",name:'Order Type',formatter:({value})=>{
            //     return value.order_type
            // }},
            {key:"productType",name:'Product Type',formatter:({value})=>{
                return value.product_name
            },sortValue:({value})=>{
                return value.product_name
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
            // {key:"data",name:'Quantity Requested',formatter:({value})=>{
            //     return Array.isArray(value.quantity)?
            //     value.quantity.join(','):
            //     value.quantity
            // }},
            // {key:"rfq_number",name:'Status',formatter:({value, row})=>{
            //     return row.quotationNumber?'Quotation Submitted':'Requested';
            // }},
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
            // { key: "lastUpdate_date", name: "Modified Date", resizable: true, formatter:({value, row})=>{
            //     let maxDate = row.lastUpdate_date;
            //     if(row.quotationInfo && (row.quotationInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.lastUpdate_date
            //     }
            //     if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo && (row.quotationInfo.purchaseOrderInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.purchaseOrderInfo.lastUpdate_date
            //     }
            //     return maxDate?moment(maxDate).local().format('MM/DD/YYYY hh:mma'):null
            //     // return moment(value).local().format('MM/DD/YYYY hh:mma')
            // }, exportFormatter:({value, row})=>{
            //     let maxDate = row.lastUpdate_date;
            //     if(row.quotationInfo && (row.quotationInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.lastUpdate_date
            //     }
            //     if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo && (row.quotationInfo.purchaseOrderInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.purchaseOrderInfo.lastUpdate_date
            //     }
            //     console.log(row.rfq_number + ' 3  ' + maxDate)
            //     return (maxDate?new Date(maxDate):null);
            // }, sortValue:({value, row})=>{
            //     let maxDate = row.lastUpdate_date;
            //     if(row.quotationInfo && (row.quotationInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.lastUpdate_date
            //     }
            //     if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo && (row.quotationInfo.purchaseOrderInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.purchaseOrderInfo.lastUpdate_date
            //     }
            //     return moment(maxDate).local().format('MM/DD/YYYY hh:mma')
            // }, formatIfEmpty:true},
            // {key:"lastUpdate_by",name:'Modified By', formatter:({value,row})=>{
            //     let maxDate = row.lastUpdate_date;
            //     let maxUser = row.lastUpdate_by
            //     if(row.quotationInfo && (row.quotationInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.lastUpdate_date
            //         maxUser = row.quotationInfo.lastUpdate_by
            //     }
            //     if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo && (row.quotationInfo.purchaseOrderInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.purchaseOrderInfo.lastUpdate_date
            //         maxUser = row.quotationInfo.purchaseOrderInfo.lastUpdate_by
            //     }
            //     return maxUser?maxUser.split('@')[0]:''
            // }, exportFormatter:({value, row})=>{
            //     let maxDate = row.lastUpdate_date;
            //     let maxUser = row.lastUpdate_by
            //     if(row.quotationInfo && (row.quotationInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.lastUpdate_date
            //         maxUser = row.quotationInfo.lastUpdate_by
            //     }
            //     if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo && (row.quotationInfo.purchaseOrderInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.purchaseOrderInfo.lastUpdate_date
            //         maxUser = row.quotationInfo.purchaseOrderInfo.lastUpdate_by
            //     }
            //     return maxUser?maxUser.split('@')[0]:''
            // }, sortValue:({value, row})=>{
            //     let maxDate = row.lastUpdate_date;
            //     let maxUser = row.lastUpdate_by
            //     if(row.quotationInfo && (row.quotationInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.lastUpdate_date
            //         maxUser = row.quotationInfo.lastUpdate_by
            //     }
            //     if(row.quotationInfo && row.quotationInfo.purchaseOrderInfo && (row.quotationInfo.purchaseOrderInfo.lastUpdate_date > maxDate || maxDate == null)){
            //         maxDate = row.quotationInfo.purchaseOrderInfo.lastUpdate_date
            //         maxUser = row.quotationInfo.purchaseOrderInfo.lastUpdate_by
            //     }
            //     return maxUser?maxUser.split('@')[0]:''
            // },formatIfEmpty:true},
        ]
    }

    componentDidMount = () =>{
        this.loadProductTypes();
        this.loadProject(this.state.project_id);
    }
    loadProductTypes = async ()=>{
        try{
            let productTypes = await SDK.ProductTypes.getProductTypes();
            this.setState({
                productTypes:productTypes
            })
    
        }catch(err){
            alert("Unable to retreive product type list");
            this.setState({
                productTypes:[]
            })
        }
    }
    

    loadProject = async (_id)=>{
        try{
            let data = await SDK.Projects.getProject(_id);
            let revision = data.revisions[0];
            if(this.state.revision){
                for(let x = 0; x < data.revisions.length; x++){
                    if(data.revisions[x]._id == this.state.revision._id){
                        revision = data.revisions[x];
                    }
                }

            }
            let productType = this.state.productType;
            let product_type = this.state.product_type;
            if(!productType){
                productType = data.productType;
                product_type = data.productType._id
            }
            this.setState({
                project:data,
                revision:revision,
                productType:productType,
                product_type:product_type
                //quotations:quotations
            },()=>{
                //alert(JSON.stringify(this.state.revision));
                this.updateQuotations();
            })
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    updateQuotations = async()=>{
        try{
            let quotations = await SDK.Projects.getProjectQuotations(this.state.project_id, this.state.revision._id)
            this.setState({
                quotations:quotations
            })
        }catch(err){

        }
    }

    setActions = (cell, row)=>{
        return '<a className="btn btn-sm btn-secondary text-white" href="/organization/' + row.name + '"> OPEN</button>'
    }
    
    setShow = (value)=> this.setState({show:value});

    newProjectFieldChanged = (e) =>{
        var newProject = this.state.newProject;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        newProject[e.currentTarget.name] = value;

        this.setState({
            newProject:newProject
        })
            
            
    }
    trySave = ()=>{
        SDK.Projects.saveNewProject(this.state.newProject)
        .then(data=>{
            this.refreshProjects();
            this.setState({
                show:false
            })
        })
        .catch(err=>{
            alert(err);
        })

    }

    handleSubmit = (event)=>{
        const form = event.currentTarget;
        if (form.checkValidity() === false) {

        }else{
            this.trySave();
        }
        this.setState({
            validated:true
        })
        event.preventDefault();
        event.stopPropagation();
    }

    revisionChanged = (e)=>{
        let revision = e.target.value;
        for(var x = 0; x < this.state.project.revisions.length; x++){
            if(this.state.project.revisions[x].revision === revision){
                this.setState({
                    revision:this.state.project.revisions[x]
                },()=>{
                    //alert(JSON.stringify(this.state.revision));
                    this.updateQuotations();
                })
                break;
            }
        }
        
    }

    revisionInfoChanged = async (e)=>{
        var revision = this.state.revision;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        revision[e.currentTarget.name] = value;

        // var project = this.state.project;
        // for(var x = 0; x < project.revisions.length; x++){
        //     if(project.revisions[x].revision === revision.revision){
        //         project.revisions[x] = revision;
        //     }
        // }
    
        this.setState({
            //project:project,
            revision:revision,
        }, ()=>{
            console.log(JSON.stringify(this.state.project, null, 2));
            // if(this.props.onFileDataChanged){
            //     this.props.onFileDataChanged(this.state.fileData);
            // }

        })
    }

    showRequestModal = ()=>{
        this.quotationModal.current.showModal();
    }
    requestQuotation = (data, formData)=>{
        this.updateQuotations();
        // SDK.Projects.requestQuotation(this.state.project_id, this.state.revision._id, data, formData)
        // .then(data =>{
        //     //alert('success:' + JSON.stringify(data));
        //     this.updateQuotations();
        // })
        // .catch(err =>{
        //     alert('Error:' + err);
        // })
    }
    showRevisionModal = ()=>{
        this.newRevisionModal.current.showModal();
    }

    newRevision = ()=>{
        this.loadProject(this.state.project_id);
    }

    
    showUpdateOrganization = ()=>{
        this.changeOrganizationModal.current.showModal(this.state.project_id, this.state.project.organizationInfo?this.state.project.organizationInfo.name:null);
    }
    changeOrganization = ()=>{
        this.loadProject(this.state.project_id);
    }

    
    showUpdateProductType = ()=>{
        this.changeProductTypeModal.current.showModal(this.state.project_id, this.state.project.product_type);
    }
    changeProductType = ()=>{
        this.loadProject(this.state.project_id);
    }

    deliverableSaved = async (data)=>{
        console.log(data);
        await this.loadProject(this.state.project_id);
        this.forceUpdate();
    }

    toggleEditItemnumber = ()=>{
        this.setState({
            editingItemnumber:!this.state.editingItemnumber,
            editItemnumber:this.state.project.itemnumber
        })
    }

    editItemnumberChanged = (e)=>{
        this.setState({
            editItemnumber:e.target.value
        })
    }
    

    trySaveItemnumber = async ()=>{
        try{

            if(this.state.editItemnumber === this.state.project.itemnumber){
                alert("Unchanged");
            }else{
                await SDK.Projects.updateItemnumber(this.state.revision.project_id, {itemnumber:this.state.editItemnumber});
                alert("Saved");
                this.loadProject(this.state.project_id);
    
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }


    toggleEditRevision = ()=>{
        this.setState({
            editRevision:!this.state.editRevision,
            editRevisionNumber:this.state.revision.revision
        })
    }

    editRevisionChanged = (e)=>{
        this.setState({
            editRevisionNumber:e.target.value
        })
    }
    

    trySaveRevisionNumber = async ()=>{
        try{

            if(this.state.editRevisionNumber === this.state.revision.revision){
                alert("Unchanged");
            }else{
                await SDK.Projects.updateRevisionNumber(this.state.revision.project_id,this.state.revision._id, {revision:this.state.editRevisionNumber});
                alert("Saved");
                let rev = this.state.revision;
                rev.revision = this.state.editRevisionNumber;
                this.setState({
                    editRevision:false,
                    revision:rev
                })
                this.loadProject(this.state.project_id);
    
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    
    tryDelete = async()=>{
        try{
            let data = await SDK.Projects.checkDeleteProject(this.state.project_id);
            if(data){
                this.confirmDialog.current.showDialog('Confirm delete', 
                <div>
                    <p>Warning! Deleted project data cannot be restored! Are you sure you want to proceed?</p>
                    <Table>
                        <tr><th>Projects</th><td>{data.projects||0}</td></tr>
                        <tr><th>RFQs</th><td>{data.rfqs||0}</td></tr>
                        <tr><th>Quotations</th><td>{data.quotations||0}</td></tr>
                        <tr><th>POs</th><td>{data.pos||0}</td></tr>
                    </Table>
                </div>, 
                this.deleteProject);
            }
            //this.confirmDialog.current.showDialog('Confirm delete', 'Warning! Deleted project data cannot be restored! Are you sure you want to proceed?', this.deleteProject);
        }catch(err){
            console.error(err);
        }
        
    }

    deleteProject = async()=>{
        try{
            await SDK.Projects.deleteProject(this.state.project_id);
            this.confirmDialog.current.showDialog('Success', 'Project: ' + this.state.project.itemnumber + ' has been deleted.  You will be redirect to projects page.', ()=>{window.location.href = '/projects';}, ()=>{window.location.href = '/projects';}, ()=>{window.location.href = '/customers';}, null, null, null, true );
            // alert("Organization deleted, you will be redirected to customers page");
            // window.location.href = '/customers';
        }catch(err){
            alert(err);
        }
    }
    
    tryDeactivate = async()=>{
        this.confirmDialog.current.showDialog('Confirm Deactivate', 'Are you sure you want to proceed?', this.deactivateProject);
    }

    deactivateProject = async()=>{
        try{
            await SDK.Projects.deactivateProject(this.state.project_id);
            this.confirmDialog.current.showDialog('Success', 'Project: ' + this.state.project.itemnumber + ' has been deactivated.  You will be redirect to projects page.', ()=>{window.location.href = '/projects';}, ()=>{window.location.href = '/projects';}, ()=>{window.location.href = '/customers';}, null, null, null, true );
            // alert("Organization deleted, you will be redirected to customers page");
            // window.location.href = '/customers';
        }catch(err){
            alert(err);
        }
    }
    
    
    tryReactivate = async()=>{
        this.confirmDialog.current.showDialog('Confirm Reactivate', 'Are you sure you want to proceed?', this.reactivateProject);
    }

    reactivateProject = async()=>{
        try{
            await SDK.Projects.reactivateProject(this.state.project_id);
            this.confirmDialog.current.showDialog('Success', 'Project: ' + this.state.project.itemnumber + ' has been reactivated.  You will be redirect to projects page.', ()=>{window.location.href = '/projects';}, ()=>{window.location.href = '/projects';}, ()=>{window.location.href = '/customers';}, null, null, null, true );
            // alert("Organization deleted, you will be redirected to customers page");
            // window.location.href = '/customers';
        }catch(err){
            alert(err);
        }
    }

    
    trySaveRevisionInfo = async ()=>{
        try{
                let data = {
                    description:this.state.revision.description
                }
                await SDK.Projects.updateRevisionInfo(this.state.revision.project_id,this.state.revision._id, data);
                alert("Saved");
                // // let rev = this.state.revision;
                // // rev.revision = this.state.editRevisionNumber;
                // // this.setState({
                // //     editRevision:false,
                // //     revision:rev
                // // })
                // this.loadProject(this.state.project_id);

        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    tryUpdateOrganization = ()=>{

    }

    onOrganizationChanged = (value)=>{
        if(value){
            alert("Organization has been updated");
            this.loadProject(this.state.project_id);
        }
    }

    onProductTypeChanged = (value)=>{
        if(value){
            alert("Product Type has been updated");
            this.loadProject(this.state.project_id);
        }
    }

    changeProductType = (e)=>{
        let value = e.target.value;
        let productType = this.state.productTypes.find((row)=>{
            if(row._id === value){
                return true;
            }
        })
        this.setState({
            product_type:value,
            productType:productType
        })
    }
    render = ()=>{
         

        return (
            <div className="container-fluid">
                <Row>
                    <Col className="col-auto"><h1 className="h3 mb-2 text-gray-800">{this.state.project.itemnumber}</h1></Col>
                    {
                        (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_PROJECT_NUMBER') && this.state.editingItemnumber)?
                        <Col className="col-auto">
                            <Form.Control size="sm" type={'text'} className="mt-1" value={this.state.editItemnumber}  onChange={this.editItemnumberChanged}/>
                        </Col>
                        :null
                    }
                    {
                        ((auth.userInfo.permissions.includes('EMPLOYEE_EDIT_PROJECT_NUMBER') && !this.state.editingItemnumber) && this.state.project)?
                        <Form.Group  as={Col} className="col-auto">
                            <Button size="sm" className="mt-1" onClick={this.toggleEditItemnumber}><i className="fa fa-pen-to-square"></i></Button>
                        </Form.Group>
                        :null
                    }
                    {
                        (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_PROJECT_NUMBER') && this.state.editingItemnumber)?
                        <div>
                            <Button size="sm" className="mt-1"  variant="success" onClick={this.trySaveItemnumber}><i className="fa fa-floppy-disk"></i></Button>
                            <Button size="sm" className="mt-1"  variant="danger" onClick={this.toggleEditItemnumber}><i className="fa fa-xmark"></i></Button>
                        </div>
                        :null
                    }
                    {
                        (this.state.project && this.state.project.inactive_date)?
                        <Col className="mt-2">
                            <Badge variant="danger">Deactivated - {moment(this.state.project.inactive_date).format('YYYY-MM-DD hh:mm:ss a') + ' by ' + this.state.project.inactivated_by}</Badge>
                        </Col>
                        :null
                    }
                    {
                        (auth.userInfo.organization === this.state.project.organization || auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") || auth.userInfo.permissions.includes("EMPLOYEE_PROJECT_ADMIN"))?
                        <Col  className="flex-grow-1 d-flex justify-content-end bg-light mb-03">
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" size="sm">
                                    <i className="fa-solid fa-bars"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        auth.userInfo.permissions.includes("EMPLOYEE_PROJECT_ADMIN")?
                                            <Dropdown.Item variant="danger" onClick={this.showUpdateOrganization}>Update Organization</Dropdown.Item>
                                        :null
                                    }
                                    {
                                        auth.userInfo.permissions.includes("EMPLOYEE_PROJECT_ADMIN")?
                                            <Dropdown.Item variant="danger" onClick={this.showUpdateProductType}>Update Product Type</Dropdown.Item>
                                        :null
                                    }
                                    {
                                        auth.userInfo.permissions.includes("EMPLOYEE_DEACTIVATE_PROJECT")?
                                            (this.state.project && !this.state.project.inactive_date)?
                                                <Dropdown.Item onClick={this.tryDeactivate}>Deactivate</Dropdown.Item>
                                            :(this.state.project && this.state.project.inactive_date)?
                                            <Dropdown.Item onClick={this.tryReactivate}>Reactivate</Dropdown.Item>
                                            :null
                                        :null
                                    }
                                    {
                                        auth.userInfo.permissions.includes("EMPLOYEE_DELETE_PROJECT")?
                                            <Dropdown.Item variant="danger" onClick={this.tryDelete}>Delete</Dropdown.Item>
                                        :null
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        :''
                    }
                </Row>
                <h2 className="h3 mb-2 text-gray-800">{this.state.project.productType?this.state.project.productType.product_name:''}</h2>
                <Card>
                    <Card.Header className="card-header-border">
                        <Row className="form-row">
                            <Form.Group  as={Col} className="col-auto">

                                <Form.Label>Revision</Form.Label>
                                <Form.Control as="select" size="sm" value={this.state.revision?this.state.revision.revision:null} onChange={this.revisionChanged}>{
                                    this.state.project.revisions?
                                        this.state.project.revisions.map((x,index)=>{
                                            return <option value={x.revision}
                                            key={x.revision} 
                                            >{x.revision}</option>
                                        })
                                    :''
                                }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group  as={Col} className="col-auto">
                                <br/>
                                {
                                    (this.state.project && !this.state.project.inactive_date)?
                                    <Button variant="primary" size="sm" className="mt-2" onClick={this.showRevisionModal}>
                                        New Revision
                                    </Button>
                                    :null

                                }
                            </Form.Group>
                            {
                                (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_PROJECT_REVISION') && this.state.editRevision)?
                                <Col className="col-auto">
                                    <br/>
                                    <Form.Control size="sm" type={'text'} className="mt-2" value={this.state.editRevisionNumber}  onChange={this.editRevisionChanged}/>
                                </Col>
                                :null
                            }
                            {
                                (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_PROJECT_REVISION') && !this.state.editRevision && this.state.project && !this.state.project.inactive_date)?
                                <Form.Group  as={Col} className="col-auto">
                                    <br/>
                                    <Button size="sm" className="mt-2" onClick={this.toggleEditRevision}><i className="fa fa-pen-to-square"></i></Button>
                                </Form.Group>
                                :null
                            }
                            {
                                (auth.userInfo.permissions.includes('EMPLOYEE_EDIT_PROJECT_REVISION') && this.state.editRevision)?
                                <div>
                                    <br/>
                                    <Button size="sm" className="mt-2"  variant="success" onClick={this.trySaveRevisionNumber}><i className="fa fa-floppy-disk"></i></Button>
                                    <Button size="sm" className="mt-2"  variant="danger" onClick={this.toggleEditRevision}><i className="fa fa-xmark"></i></Button>
                                </div>
                                :null
                            }

                        </Row>
                        {
                            ((auth.userInfo.organization === this.state.project.organization || auth.userInfo.permissions.includes("EMPLOYEE_ADMIN"))  && this.state.project && !this.state.project.inactive_date)?
                            <div className="header-actions"><button className="btn btn-primary btn-sm" onClick={this.showRequestModal}>Request Quotation</button></div>
                            :''
                        }
                        
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col className="md-6">
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control name="description" value={this.state.revision?this.state.revision.description:''} onChange={this.revisionInfoChanged} disabled={!auth.userInfo.permissions.includes("EMPLOYEE_EDIT_PROJECT_INFO")}/>
                                </Form.Group>
                            </Col>
                            <Col className="md-6">
                                <Card>
                                    <Card.Header>
                                        Requirements
                                        <FormControl as={'select'} value={this.state.product_type} onChange={this.changeProductType}>
                                            <option value={null}></option>
                                            {
                                                this.state.productTypes?this.state.productTypes.map((row)=>{
                                                    return <option value={row._id}>{row.product_name}</option>
                                                })
                                                :null
                                            }
                                        </FormControl>
                                    </Card.Header>
                                    <Card.Body>
                                        {/* {this.state.revision?this.state.revision._id:''} */}
                                        {
                                            this.state.productType && this.state.productType.requirements?
                                            this.state.productType.requirements.map((x,index)=>{
                                                return <ProjectDeliverable 
                                                    // key={x+this.state.revision}
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
                                        }

                                        {/* <pre>{this.state.productType?JSON.stringify(this.state.productType,null,2):null}</pre> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                    </Card.Body>
                    {
                        auth.userInfo.permissions.includes("EMPLOYEE_EDIT_PROJECT_INFO")?
                        <Card.Footer>
                            <Button size="sm" onClick={this.trySaveRevisionInfo}>Update Info</Button>
                        </Card.Footer>
                        :null

                    }
                </Card>
                <br/>
                <Card>
                    <Card.Header>
                        Quotations
                    </Card.Header>
                    <Card.Body>
                        
                        <ReactGrid
                                columns={this.columns}
                            // columns={this.state.quotations?this.state.quotations.map(row=>{
                            //     return {key:row, name:row, resizable:true}
                            // }):[]}
                            rowGetter={i=> this.state.quotations?this.state.quotations[i]:{}}
                            rowsCount={this.state.quotations?this.state.quotations.length:0} 
                            sortable={true}
                            
                        />
                    </Card.Body>
                </Card>
                <RequestQuotation ref={this.quotationModal} project_id={this.state.project_id} revision_id={this.state.revision?this.state.revision._id:''} productType={this.state.productType} onSubmit={this.requestQuotation}/>
                {/* <Card>
                    <Card.Header className="card-header-border">
                        JSON Data
                    </Card.Header>
                    <Card.Body>
                        <pre>
                            {
                                auth.userInfo?
                                JSON.stringify(auth.userInfo, null, 2):''
                            }
                        </pre>
                    </Card.Body>
                </Card> */}
                <NewRevisionModal ref={this.newRevisionModal} project_id={this.state.project_id} onSubmit={this.newRevision}/>
                <ConfirmDialog ref={this.confirmDialog}/>
                <ChangeOrganizationModal ref={this.changeOrganizationModal} onSubmit={this.onOrganizationChanged}/>
                <ChangeProductTypeModal ref={this.changeProductTypeModal} onSubmit={this.onProductTypeChanged}/>
            </div>
        );
    }
    
    handleRowClick = ()=>{

    }
}

export default  Projects;