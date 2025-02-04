import React from 'react';
// with es5
import {Form, Nav, Card, Button} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import QuotationInfo from './QuotationInfo';
import SubmitPurchaseOrder from './SubmitPurchaseOrder';
import auth from '../../auth';
import moment from 'moment';
import ChecklistForm from '../tools/checklist/ChecklistForm';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import DragAndDrop from '../tools/DragAndDrop';

class PurchaseOrder extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            readOnly:this.props.readOnly,
            purchaseOrderNumber: props.purchaseOrderNumber,
            purchaseOrderInfo:{},
            statuses:[],
            progressInfos:[]
        }
        this.fileInput = React.createRef();
        this.poModal = React.createRef();
        this.formData = React.createRef();

        this.fileColumns = [
            {key:"filename",name:'Filename',formatter:({value,row})=>{
                return <Nav.Link pill variant="primary" onClick={()=>{this.getFile(row.file)}}>{value}</Nav.Link>
                //return <a href={'/organization/'+ value.name}>{value.name}</a>
            },exportFormatter:({value})=>{
                return value;
            }},
            { key: "create_date", name: "Create Date", resizable: true, formatter:({value})=>{
                return moment(value).format('MM/DD/YYYY hh:mma ZZ')
            }, exportFormatter:({value})=>{
                return (value?new Date(value):null);
            }},
            {key:"created_by",name:'Created By'},
            {key:"actions", name:"actions", formatter:({value,row, index})=>{
                return <Button variant="danger" size="sm" onClick={()=>{this.deleteFile(row.file, index)}}>X</Button>
            },exportFormatter:({value})=>{
                return null;
            },formatIfEmpty:true},
        ]

    }

    async componentDidMount(){
        try{
            this.updateStatuses();
            this.updateInfo();
            let purchaseOrderChecklist = await SDK.PurchaseOrders.getPurchaseOrderChecklist();
            this.setState({
                purchaseOrderChecklist:purchaseOrderChecklist
            })
        }catch(err){
            
        }
        
    }
    componentDidUpdate(props){
        if(props.purchaseOrderNumber !== this.props.purchaseOrderNumber){
            alert(JSON.stringify(this.props));
            // alert(this.props.purchaseOrderNumber);
            this.setState({
                purchaseOrderNumber:this.props.purchaseOrderNumber
            },()=>{
                // alert(this.state.purchaseOrderNumber)
                this.updateInfo();
            })
            // alert('updated');
        }
        
        if(props.readOnly !== this.props.readOnly){
            this.setState({
                readOnly:this.props.readOnly
            })
        }
    }

    deleteFile = async (file, index)=>{
        try{
            let data = await SDK.PurchaseOrders.deleteFile(this.state.purchaseOrderNumber, file);
            let purchaseOrderInfo = this.state.purchaseOrderInfo;
            purchaseOrderInfo.files.splice(index, 1);
            if(purchaseOrderInfo.files.length === 0){
                purchaseOrderInfo._id = null
            }
            this.setState({
                purchaseOrderInfo:purchaseOrderInfo
            });
            
            if(this.props.onSaved){
                this.props.onSaved(data);
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    getFile = (file)=>{
        SDK.Vault.getFile(file);
    }
    updateStatuses = async ()=>{
        try{
            let statuses = await SDK.Statuses.findStatuses({q:`process_type="Purchase Order"`})
            this.setState({
                statuses:statuses
            })
        }catch(err){
            console.error(err);
            alert(err);
        }
    }
    updateInfo = async()=>{
        try{
            // alert(this.state.purchaseOrderNumber)
            let data = await SDK.PurchaseOrders.getPurchaseOrder(this.state.purchaseOrderNumber);
            if(data){
                let form = data.formId?await SDK.Forms.getForm(data.formId):null;
                let formDesign = data.formId?await SDK.Forms.getFormDesign(form.formId):null;
                this.setState({
                    formDesign:formDesign,
                    form:form,
                    purchaseOrderInfo:data
                });
            }else{
                alert("NOT FOUND");
            }
            
        }catch(err){
            alert('ERR:' + err);
        }
    }
    showRequestModal = ()=>{
        this.poModal.current.showModal();
    }
    submitPurchaseOrder = ()=>{
        alert("Saved");
    }
    getFile = (file)=>{
        SDK.Vault.getFile(file);
    }

    approvePurchaseOrder = async ()=>{
        try{
            await SDK.PurchaseOrders.approvePurchaseOrder(this.state.purchaseOrderNumber);
            this.loadPurchaseOrder(this.state.purchaseOrderNumber);
        }catch(err){
            console.error(err);
            alert(err);
        }

    }
    
    purchaseOrderInfoChanged = (e)=>{
        var purchaseOrderInfo = this.state.purchaseOrderInfo;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                            target.checked :
                        target.type==='number'?
                            Number(target.value):
                            target.value;
        purchaseOrderInfo[e.currentTarget.name] = value;
        this.setState({
            purchaseOrderInfo:purchaseOrderInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.purchaseOrderInfo);
        }
        if(this.props.onModified)this.props.onModified()
        

    }
    dataChanged = (e)=>{
        var purchaseOrderInfo = this.state.purchaseOrderInfo;
        if(!purchaseOrderInfo.data){
            purchaseOrderInfo.data={};
        }
        let target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                            target.checked :
                        target.type==='number'?
                            Number(target.value):
                            target.value;
        purchaseOrderInfo.data[e.currentTarget.name] = value;
        this.setState({
            purchaseOrderInfo:purchaseOrderInfo
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.purchaseOrderInfo);
        }
        if(this.props.onModified)this.props.onModified()

    }
    trySave = async ()=>{
        try{
            let purchaseOrderInfo = this.state.purchaseOrderInfo;
            purchaseOrderInfo.formData = this.formData.current.getFormData();
            let data = await SDK.PurchaseOrders.updatePurchaseOrderInfo(purchaseOrderInfo);
            this.formData.current.commitData();
            if(this.props.onSaved){
                this.props.onSaved();
            }
            alert("Saved");
        }catch(err){
            alert("error:" + err);
        }
    }
    onRequireChecklistId = async ()=>{
        return new Promise(async (resolve,reject)=>{
            try{
                let data = await SDK.PurchaseOrders.generateChecklistID(this.state.purchaseOrderNumber);
                if(data){
                    this.state.purchaseOrderInfo.checklistId = data._id;
                    resolve(data._id);
                }else{
                    reject("Error generating checklkist");
                }
            }catch(err){
                console.error(err);
                reject("Error generating checklkist");
            }
        })
        
        
        
    }

    uploadFiles = async ()=>{
        try{
            if(this.state.selectedFiles){
                for(let x = 0; x < this.state.selectedFiles.length; x++){
                    let data = await SDK.PurchaseOrders.submitPurchaseOrderFile(this.state.purchaseOrderNumber, this.state.selectedFiles[x])
                    console.log("SAVED");
                    console.log(data)
                    if(data.files){
                        //inserted
                        // let deliverable = this.state.deliverable;
                        // deliverable.files = data.files;
                        
                        this.state.purchaseOrderInfo = data
                        let progressInfos = this.state.progressInfos;
                        progressInfos.push(this.state.selectedFiles[x].name)
                        this.setState({
                            deliverable:data,
                            progressInfos:progressInfos
                        });
                        
                    }
                }
                
                if(this.props.onSaved){
                    this.props.onSaved();
                }
                // SDK.Projects.submitDeliverableFile(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id,this.state.loadedFile)
                // .then(data=>{
                //     if(data.files){
                //         //inserted
                //         let deliverable = this.state.deliverable;
                //         deliverable.files = data.files;
                        
                //         this.setState({
                //             deliverable:deliverable
                //         });
                        
                //     }
    
                //     if(this.props.onSaved){
                //         this.props.onSaved(data);
                //     }
                // })
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
        
    }
    selectFile= (e) => {
        let currentfiles = this.state.selectedFiles;
        if(this.state.progressInfos.length > 0){
            currentfiles = null
        }
        if(currentfiles){
            for(let x = 0; x < e.target.files.length; x++){
                currentfiles.push(e.target.files[x])
            }
        }else{
            currentfiles = Array.from(e.target.files);
        }
        this.setState({
          progressInfos: [],
          selectedFiles: currentfiles,
        },()=>{
            console.log(JSON.stringify(this.state.selectedFiles));
            
        });
    }
    handleDrop = (files) => {
        let currentfiles = this.state.selectedFiles;
        if(this.state.progressInfos.length > 0){
            currentfiles = null
        }

        if(currentfiles){
            for(let x = 0; x < files.length; x++){
                currentfiles.push(files[x])
            }
        }else{
            currentfiles = Array.from(files);
        }
        this.setState({
            progressInfos: [],
            selectedFiles: currentfiles
          },()=>{
              console.log(JSON.stringify(this.state.selectedFiles));
              
          });
    }

    fileLoadChanged = (e)=>{
        var selectedFile = e.target.files[0];
        if (selectedFile) {
            //this.loadExcel(selectedFile);
            this.setState({
                loadedFile:selectedFile
            });
            
        }

    }

    render = ()=>{
        return (
            <div>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Purchase Order #</label>
                        <Form.Control className="form-control-sm" type="text" value={this.state.purchaseOrderInfo.purchaseOrderNumber} readOnly={true}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label>Status</label>
                        <Form.Control className="form-control-sm" as="select" type="text" name="status" onChange={this.purchaseOrderInfoChanged} value={this.state.purchaseOrderInfo.status} disabled={this.state.readOnly} >
                            {
                                this.state.statuses.map((row)=>{
                                    return <option value={row.status_code} disabled={row.inactive}>{row.status_name} {row.inactive?' *inactive*':''}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        this.state.purchaseOrderInfo.approved?
                        <Form.Group className="col-3">
                            <label htmlFor="multple">Approved By</label>
                            <Form.Control className="form-control-sm" type="text" value={this.state.purchaseOrderInfo.approved_by} readOnly={true}/>
                        </Form.Group>
                        :''
                    }
                    {
                        this.state.purchaseOrderInfo.approved?
                        <Form.Group className="col-3">
                            <label htmlFor="multple">Approved Date</label>
                            <Form.Control className="form-control-sm" type="text" value={this.state.purchaseOrderInfo.approved_date} readOnly={true}/>
                        </Form.Group>
                        :''
                    }
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Purchase Order Date</label>
                        <Form.Control name="request_date" className="form-control-sm" type="date" onChange={this.purchaseOrderInfoChanged} value={moment(this.state.purchaseOrderInfo.request_date).format('YYYY-MM-DD')}  readOnly={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-4">
                        <label htmlFor="multple">Submitted By</label>
                        <Form.Control className="form-control-sm" type="text"  value={this.state.purchaseOrderInfo.requested_by} readOnly={true}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">Customer PO #</label>
                        <Form.Control className="form-control-sm" type="text" name="customerPO"  onChange={this.dataChanged} value={this.state.purchaseOrderInfo.data?this.state.purchaseOrderInfo.data.customerPO:''}  readOnly={this.state.readOnly}/>
                    </Form.Group>
                    {
                        auth.userInfo && auth.userInfo.permissions.includes('EMPLOYEE_VIEW_PRICING')?
                        <Form.Group className="col-3">
                            <label htmlFor="multple">PO Amount</label>
                            <Form.Control className="form-control-sm" type="number" name="poAmount"  onChange={this.dataChanged} value={this.state.purchaseOrderInfo.data?this.state.purchaseOrderInfo.data.poAmount:''}  readOnly={this.state.readOnly}/>
                        </Form.Group>
                        :null
                    }
                </Form.Row>
                <Form.Row>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">PO Quantity</label>
                        <Form.Control className="form-control-sm" type="number" name="poQty"  onChange={this.dataChanged} value={this.state.purchaseOrderInfo.data?this.state.purchaseOrderInfo.data.poQty:''}  readOnly={this.state.readOnly}/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <label htmlFor="multple">PO Lead Time</label>
                        <Form.Control className="form-control-sm" type="number" name="poLeadTime"  onChange={this.dataChanged} value={this.state.purchaseOrderInfo.data?this.state.purchaseOrderInfo.data.poLeadTime:''}  readOnly={this.state.readOnly}/>
                    </Form.Group>
                </Form.Row>
                <DeliverableForm ref={this.formData} readOnly={this.state.readOnly}  formDesign={this.state.formDesign?this.state.formDesign.formData:{}} formData={this.state.form?this.state.form.formData:{}} onModified={()=>{if(this.props.onModified)this.props.onModified()}}/>
                {
                    this.state.purchaseOrderInfo.file?
                    
                <Form.Row>
                    <Form.Group>
                        <label htmlFor="multple">Attachment</label>
                    <Nav.Link pill variant="primary" className="pl-1" onClick={()=>{this.getFile(this.state.purchaseOrderInfo.file)}}>{this.state.purchaseOrderInfo.fileInfo?this.state.purchaseOrderInfo.fileInfo.file.originalname:this.state.purchaseOrderInfo.file}</Nav.Link>
                    </Form.Group>
                </Form.Row>
                    
                    :''
                }

                {
                    this.state.readOnly?
                    ''
                    :
                    <div>

                        <Form.Group className="form-group col-auto">
                            {/* <Form.Label>Files to upload</Form.Label> */}
                            <input hidden ref={this.fileInput} onClick={(e)=>{e.target.value=""}} type="file" multiple className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.selectFile}/>
                            <Button size="sm" className="mb-1" onClick={()=>{this.fileInput.current.click()}}>Choose Files</Button>
                            <br/>
                                <DragAndDrop handleDrop={this.handleDrop}>
                                    <div className="drop-full"> Drop Files Here</div>
                                </DragAndDrop>
                            <div className="custom-file">
                                {/* <input ref="this.excelFileInput" type="file" className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.fileLoadChanged}/> */}
                                
                                
                            </div>
                            {/* {
                                this.state.selectedFiles?
                                    [...this.state.selectedFiles].map((file,index)=>{
                                        return <span>
                                            {file.name}
                                            {this.state.progressInfos && this.state.progressInfos.includes(file.name)?<i className="fa-solid fa-check"></i>:null}
                                            {this.state.progressInfos && this.state.progressInfos.includes(file.name)?null:<Button className="ml-2" size="sm" variant="danger" onClick={()=>{this.removeFile(index)}}><i className="fa-solid fa-xmark"></i></Button> }
                                        </span>
                                    })
                                :null
                            } */}
                            {
                                this.state.selectedFiles?
                                    [...this.state.selectedFiles].map((file,index)=>{
                                        return <span>
                                            {file.name}
                                            {this.state.progressInfos && this.state.progressInfos.includes(file.name)?<i className="fa-solid fa-check"></i>:null}
                                            {this.state.progressInfos && this.state.progressInfos.includes(file.name)?null:<Button className="ml-2" size="sm" variant="danger" onClick={()=>{this.removeFile(index)}}><i className="fa-solid fa-xmark"></i></Button> }
                                        </span>
                                    })
                                :null
                            }
                        </Form.Group>
                        {
                            this.state.selectedFiles && this.state.selectedFiles.length > 0?
                            <Button size="sm" onClick={this.uploadFiles} className="mb-5">Upload</Button>
                            :null
                        }
                    </div>
                }
                <Card>
                    <Card.Header>
                        Uploaded Files
                    </Card.Header>
                    <Card.Body>
                        
                        <ReactGrid
                            export={false}
                            columns={this.fileColumns}
                            rowGetter={i=> this.state.purchaseOrderInfo&&this.state.purchaseOrderInfo.files?this.state.purchaseOrderInfo.files[i]:null}
                            rowsCount={this.state.purchaseOrderInfo&&this.state.purchaseOrderInfo.files?this.state.purchaseOrderInfo.files.length:0} 
                            sortable={false}
                        />
                    </Card.Body>

                </Card>

                <QuotationInfo readOnly={true} key={this.state.purchaseOrderInfo.quotationNumber} quotationNumber={this.state.purchaseOrderInfo?this.state.purchaseOrderInfo.quotationNumber:''} showPurchaseOrder={false}/>
                {
                    this.state.purchaseOrderInfo.approved?
                    <Card>
                        <Card.Header>
                            Checklist
                        </Card.Header>
                        <Card.Body>
                        <ChecklistForm formDesign={this.state.purchaseOrderChecklist} checklistId={this.state.purchaseOrderInfo.checklistId} onRequireChecklistId={this.onRequireChecklistId} saveAll={true} showStatus={true}/>
                        </Card.Body>
                    </Card>
                    :''
                }
                {/* <pre>
                    {JSON.stringify(this.state.purchaseOrderChecklist, null, 2)}
                </pre> */}
            </div>
        );
    }
    

}

export default  PurchaseOrder;