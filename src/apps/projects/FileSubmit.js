import React from 'react';
import {Card, Button, Form, Row, Col, Nav} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import DragAndDrop from '../tools/DragAndDrop';
import moment from 'moment';
import ReactGrid from '../tools/ReactGrid/ReactGrid';


class FileSubmit extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            project:props.project||{},
            revision:props.revision||{},
            requirement:props.requirement||{},
            deliverable:props.deliverable||{},
            progressInfos:[]
        }
        this.fileInput = React.createRef();

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

    componentDidMount(){
    }

    componentDidUpdate(props){
        if(props.project !== this.props.project && this.props.projecty !== {}){
            this.setState({
                project:this.props.project
            })

        }
        if(props.revision !== this.props.revision && this.props.revision !== {}){
            this.setState({
                revision:this.props.revision
            })

        }
        if(props.requirement !== this.props.requirement && this.props.requirement !== {}){
            this.setState({
                requirement:this.props.requirement
            })

        }
        if(props.deliverable !== this.props.deliverable && (JSON.stringify(props.deliverable) !== JSON.stringify(this.props.deliverable))){
            console.log('old Deliverable: ' + JSON.stringify(props.deliverable));
            console.log('New Deliverable: ' + JSON.stringify(this.props.deliverable))
            this.setState({
                deliverable:this.props.deliverable||{}
            })
        }
    }

    setShow = (value)=> {
        this.setState({show:value});
    }

    newProjectFieldChanged = (e) =>{
        var newProject = this.state.newProject;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        newProject[e.currentTarget.name] = value;

        this.setState({
            newProject:newProject
        }) 
    }
    trySave = async ()=>{
        try{
            let data = await SDK.Projects.saveNewProject(this.state.newProject);
            this.refreshProjects();
            this.setState({
                show:false
            })
        }catch(err){
            console.error(err);
            alert(err);
        }

    }

    getFile = (file)=>{
        SDK.Vault.getFile(file);
    }
    removeFile = (index)=>{
        let selectedFiles = this.state.selectedFiles;
        selectedFiles.splice(index,1);
        this.setState({
            selectedFiles:selectedFiles
        })
    }

    render = ()=>{
        return (
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
                
                <Card>
                    <Card.Header className="card-header-border">Uploaded Files</Card.Header>
                    <Card.Body style={{overflow:"auto"}}>
                        
                        <ReactGrid
                            export={false}
                            columns={this.fileColumns}
                            rowGetter={i=> this.state.deliverable&&this.state.deliverable.files?this.state.deliverable.files[i]:null}
                            rowsCount={this.state.deliverable&&this.state.deliverable.files?this.state.deliverable.files.length:0} 
                            sortable={false}
                        />
                            {/* {
                                this.state.deliverable?
                                this.state.deliverable.files?
                                this.state.deliverable.files.map((x, index)=>{
                                    return <Row>
                                                <Col className="col-auto">
                                                    <Nav.Link pill variant="primary" onClick={()=>{this.getFile(x.file)}}>{x.filename}</Nav.Link>
                                                </Col>
                                                <Col className="col-auto">
                                                    <Button variant="danger" size="sm" onClick={()=>{this.deleteFile(x.file, index)}}>X</Button>
                                                </Col>
                                            </Row>
                                    //return <nav onClick={()=>{this.getFile(x.file)}}>{x.filename}</nav>
                                }):''
                                :''
                            } */}
                            {/* <pre>
                                {
                                    this.state.deliverable?
                                    JSON.stringify(this.state.deliverable, null, 2):''
                                }

                            </pre> */}
                    </Card.Body>
                </Card>
                
            </div>
        )
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

    deleteFile = async (file, index)=>{
        try{
            let data = await SDK.Projects.deleteDeliverableFile(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id, file);
            var deliverable = this.state.deliverable;
            deliverable.files.splice(index, 1);
            if(deliverable.files.length === 0){
                deliverable._id = null
            }
            this.setState({
                deliverable:deliverable
            });
            
            if(this.props.onSaved){
                this.props.onSaved(data);
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    uploadFile = ()=>{
        if(this.state.loadedFile){
            SDK.Projects.submitDeliverableFile(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id,this.state.loadedFile)
            .then(data=>{
                if(data.files){
                    //inserted
                    let deliverable = this.state.deliverable;
                    deliverable.files = data.files;
                    
                    this.setState({
                        deliverable:deliverable
                    });
                    
                }

                if(this.props.onSaved){
                    this.props.onSaved(data);
                }
            })
        }
    }

    uploadFiles = async ()=>{
        try{
            if(this.state.selectedFiles){
                for(let x = 0; x < this.state.selectedFiles.length; x++){
                    let data = await SDK.Projects.submitDeliverableFile(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id,this.state.selectedFiles[x])
                    console.log("SAVED");
                    console.log(data)
                    if(data.files){
                        //inserted
                        // let deliverable = this.state.deliverable;
                        // deliverable.files = data.files;
                        
                        this.state.deliverable = data
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
}

export default  FileSubmit;