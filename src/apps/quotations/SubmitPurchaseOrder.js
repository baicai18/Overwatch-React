import React from 'react';

import {Button,  Modal, Form, Nav} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import DragAndDrop from '../tools/DragAndDrop';
import moment from 'moment';


class SubmitPurchaseOrder extends React.Component { 
    constructor(props){
        super(props);
        this.deliverableForm = React.createRef();
        this.state={
            show:props.show,
            quotationNumber:props.quotationNumber,
            data:{},
            purchaseOrderForm:{},
            progressInfos:[]
        }
        this.fileInput = React.createRef();
        this.fileColumns = [
            {key:"name",name:'Filename',formatter:({value,row})=>{
                return <Nav.Link pill variant="primary" onClick={()=>{this.getFile(row.file)}}>{value}</Nav.Link>
                //return <a href={'/organization/'+ value.name}>{value.name}</a>
            },exportFormatter:({value})=>{
                return value;
            }},
            {key:"actions", name:"actions", formatter:({value,row, index})=>{
                return <Button variant="danger" size="sm" onClick={()=>{this.removeFile(index)}}>X</Button>
            },exportFormatter:({value})=>{
                return null;
            },formatIfEmpty:true},
        ]

    }

    async componentDidMount(){
        //this.refreshRequirements();
        try{
            let purchaseOrderForm = await SDK.PurchaseOrders.getPurchaseOrderForm();
            if(purchaseOrderForm){
                this.setState({
                    purchaseOrderForm:purchaseOrderForm.formData
                })

            }
        }catch(err){

        }
    }

    fileLoadChanged = (e)=>{
        let selectedFiles = e.target.files;
        console.log(selectedFiles);
        //this.loadExcel(selectedFile);
        this.setState({
            attachment:selectedFiles
        });
        

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
    removeFile = (index)=>{
        console.log(index);
        let selectedFiles = this.state.selectedFiles;
        selectedFiles.splice(index,1);
        this.setState({
            selectedFiles:selectedFiles
        })
        console.log(selectedFiles)
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Purchase Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Form.Group>
                        <Form.Label>Customer PO# *</Form.Label>
                        <Form.Control name="customerPO" type="text" onChange={this.controlChanged}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>PO Quantity *</Form.Label>
                        <Form.Control name="poQty" type="number" min="0" step="0.01" onChange={this.controlChanged}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>PO Lead Time *</Form.Label>
                        <Form.Control name="poLeadTime" type="number" min="0" step="0.01" onChange={this.controlChanged}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>PO Amount *</Form.Label>
                        <Form.Control name="poAmount" type="number" min="0" step="0.01" onChange={this.controlChanged}/>
                    </Form.Group>
                    <DeliverableForm ref={this.deliverableForm} formDesign={this.state.purchaseOrderForm}/>

                    <Form.Group>
                        <Form.Label htmlFor="fileUploader">Attachment</Form.Label>
                        <input hidden ref={this.fileInput} onClick={(e)=>{e.target.value=""}} type="file" multiple className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.selectFile}/>
                        <Button size="sm" className="mb-1" onClick={()=>{this.fileInput.current.click()}}>Choose Files</Button>
                        <br/>
                            <DragAndDrop handleDrop={this.handleDrop}>
                                <div className="drop-full"> Drop Files Here</div>
                            </DragAndDrop>
                        <div className="custom-file">
                            {/* <input ref="this.excelFileInput" type="file" className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.fileLoadChanged}/> */}
                            
                            
                        </div>
                        <ReactGrid
                            export={false}
                            columns={this.fileColumns}
                            rowGetter={i=> this.state.selectedFiles?this.state.selectedFiles[i]:null}
                            rowsCount={this.state.selectedFiles?this.state.selectedFiles.length:0} 
                            sortable={false}
                        />
                        {/* <div className="custom-file">
                        <input ref="this.excelFileInput" type="file" className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" onChange={this.fileLoadChanged}/>
                            <Form.Label className="custom-file-label form-control form-control-sm" htmlFor="fileUploader">{this.state.attachment?this.state.attachment.name:'Choose file'}</Form.Label>
                        </div> */}
                    </Form.Group>

                        
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" size="sm" onClick={this.closeModal}>
                        Close
                    </Button> */}
                    <Button variant="primary" size="sm"onClick={this.submitPurchaseOrder}>
                        Submit Request
                    </Button>
                </Modal.Footer>
            </Modal>
        )
        
    }
    closeModal = ()=>{
        this.setState({
            show:false,
            selectedIndex:-1
        })
    }
    showModal = ()=>{
        this.setState({
            show:true
        })
        
    }

    submitPurchaseOrder = async ()=>{
        let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        try{
            let POInfo = await SDK.PurchaseOrders.submitPurchaseOrder(this.state.quotationNumber, this.state.data, formData, this.state.selectedFiles);
            if(this.state.selectedFiles){
                for(let x = 0; x < this.state.selectedFiles.length; x++){
                    await SDK.PurchaseOrders.submitPurchaseOrderFile(POInfo.purchaseOrderNumber, this.state.selectedFiles[x])
                }
            }
            


            if(this.props.onSubmit){
                this.props.onSubmit(this.state.data, formData);
            }
            this.closeModal();
        }catch(err){
            console.error(err);
            alert('Error:' + err);
        }
    }

    submitRequest = ()=>{
        let formData = this.deliverableForm.current.getFormData()
        //alert(JSON.stringify(data));
        if(this.state.selectedIndex !== -1){
            if(this.props.onSubmit){
                this.props.onSubmit(this.state.data, formData);
            }
            this.closeModal();
        }
    }

    controlChanged = (e)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        data[e.currentTarget.name] = value;
        this.setState({
            data:data
        })
        if(this.props.onDataChanged){
            this.props.onDataChanged(this.state.index,this.state.data);
        }
        

    }
}

export default SubmitPurchaseOrder;