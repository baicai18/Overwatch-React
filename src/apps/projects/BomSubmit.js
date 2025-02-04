import React from 'react';
import {Card, Button, Form, Row, Col, Nav} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import DragAndDrop from '../tools/DragAndDrop';
import moment from 'moment';


class BomSubmit extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            project:props.project||{},
            revision:props.revision||{},
            requirement:props.requirement||{},
            deliverable:props.deliverable||{},
            parsedBOM:props.deliverable?props.deliverable.bom:null,
            bomParsers:[],
            progressInfos:[]
        }
        this.parserSelect=React.createRef();
        this.fileInput=React.createRef();

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
            let bomDefinition = await SDK.BOM.getBOMDefinition();
            let bomParsers = await SDK.BOM.getParsers();
            let parserOptions = null;
            if(bomParsers.length > 0){
                parserOptions=bomParsers[0];
            }
            // let parserOptions = await SDK.BOM.getParser();
            let bomOutputOptions = await SDK.BOM.getDefaultBOMOutput();
            let bomOutput = null;
            if(this.state.parsedBOM){
                bomOutput = await SDK.BOM.bomParser.outputBOM(this.state.parsedBOM, bomOutputOptions);
            }
            this.setState({
                bomDefinition:bomDefinition,
                bomParsers:bomParsers,
                parserOptions:parserOptions,
                bomOutputOptions:bomOutputOptions,
                bomOutput:bomOutput
            })

        }catch(err){
            console.error(err);
            alert(err);
        }
        
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
        if(props.deliverable !== this.props.deliverable){
            this.setState({
                deliverable:this.props.deliverable,
                parsedBOM:this.props.deliverable?this.props.deliverable.bom:null,
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
    trySave = ()=>{
        this.uploadFile();
        // alert(JSON.stringify(this.state.parsedBOM,function (key, value) {
        //     if (key == "parentNode") {
        //         return undefined;
        //     }
        //     return value;
        // },2));

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
        currentfiles=[files[0]]
        this.setState({
            progressInfos: [],
            excelFile:files[0],
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




    uploadBOM = ()=>{
        if(this.state.parsedBOM){
            SDK.Projects.submitDeliverableBOM(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id,this.state.parsedBOM)
            .then(data=>{
                if(this.props.onSaved){
                    this.props.onSaved(data);
                }
                alert("Saved");
                // alert(JSON.stringify(data));
            })
        }
    }
    uploadFile = ()=>{
        if(this.state.excelFile){
            SDK.Projects.submitDeliverableFile(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id,this.state.excelFile)
            .then(data=>{
                if(data){

                    
                    this.setState({
                        deliverable:data
                    },()=>{
                        this.uploadBOM();
                    })
                }
                
                if(this.props.onSaved){
                    this.props.onSaved(data);
                }
                // if(data.file){
                //     //inserted
                //     let deliverable = this.state.deliverable;
                //     deliverable._id = data._id;
                //     deliverable.files = [data];
                //     this.setState({
                //         deliverable:deliverable
                //     },()=>{
                //         this.uploadBOM();
                //     });

                // }
            })
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
                    <Form.Label htmlFor="fileUploader">Excel Data</Form.Label>
                    
                    {/* <div className="custom-file">
                    <input ref="this.excelFileInput" type="file" className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.fileLoadChanged} onClick={(e)=>{e.target.value=''}}/>
                        <Form.Label className="custom-file-label form-control form-control-sm" htmlFor="fileUploader">{this.state.excelFile?this.state.excelFile.name:'Choose file'}</Form.Label>
                    </div> */}

                    <input hidden ref={this.fileInput} onClick={(e)=>{e.target.value=""}} type="file" multiple className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.fileLoadChanged}/>
                    <Button size="sm" className="mb-1" onClick={()=>{this.fileInput.current.click()}}>Choose Files</Button>
                    <br/>
                        <DragAndDrop handleDrop={this.handleDrop}>
                            <div className="drop-full"> Drop Files Here</div>
                        </DragAndDrop>
                    <div className="custom-file">
                        {/* <input ref="this.excelFileInput" type="file" className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.fileLoadChanged}/> */}
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
                        
                </div>
                </Form.Group>
                {
                    this.state.excelFile?
                    <Button onClick={this.trySave}>Save</Button>
                    :''
                }
                <Form.Group className="form-group col-auto">
                    <Form.Label>Parser</Form.Label>
                    <Form.Control size="sm" ref={this.parserSelect} as="select" onChange={this.parserChanged}>
                        {
                            this.state.bomParsers?
                            this.state.bomParsers.map((x,index)=>{
                                return <option key={x._id} value={x.baseOptions.parserName}>{x.baseOptions.parserName}</option>
                            })
                            :''
                        }
                    </Form.Control>
                </Form.Group>
                <Card>
                    <Card.Header className="card-header-border">Uploaded File</Card.Header>
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
                <Card>
                    <Card.Header className="card-header-border">BOM</Card.Header>
                    <Card.Body>
                        <ReactGrid
                            columns={this.state.bomOutput?this.state.bomOutput.header.map(row=>{
                                return {key:row, name:row, resizable:true}
                            }):[]}
                            rowGetter={i=> this.state.bomOutput?this.state.bomOutput.row_objects[i]:{}}
                            rowsCount={this.state.bomOutput?this.state.bomOutput.row_objects.length:0} 
                            
                        />

                    </Card.Body>
                </Card>
                {/* <pre>{JSON.stringify(this.state.parsedBOM,function (key, value) {
                                        if (key == "parentNode") {
                                            return undefined;
                                        }
                                        return value;
                                    }, 
                                    2)}</pre> */}
                                    
                {/* <pre>{JSON.stringify(this.state.deliverable,function (key, value) {
                                        if (key == "parentNode") {
                                            return undefined;
                                        }
                                        return value;
                                    }, 
                                    2)}</pre> */}
            </div>
        )
    }
    loadExcel(file){
        SDK.BOM.bomParser.getExcelData(file, this.state.headerIndex, this.state.dataIndex)
        .then(data=>{
            return new Promise((resolve,reject)=>{
                this.setState({
                    loadedExcelData:data,
                    headers:data.header
                }, ()=>{
                    if(this.state.parserOptions){
                        SDK.BOM.bomParser.parseBOM(this.state.loadedExcelData, this.state.parserOptions, this.state.bomDefinition)
                        .then(data=>{
                            data.item_number = this.state.project.itemnumber;
                            data.revision = this.state.revision.revision;
                            data.description = this.state.revision.description;
                            this.setState({
                                parsedBOM:data
                            },()=>{
                                SDK.BOM.bomParser.outputBOM(data, this.state.bomOutputOptions)
                                .then(data=>{
                                    this.setState({
                                        bomOutput:data
                                    },()=>{
                                        console.log(this.state.bomOutput);
                                    })
                                    resolve(true);
                                })
                                .catch(err=>{
                                    reject(err);
                                    console.log(err);
                                })
                            })
                            
                        })
                        .catch(err=>{
                            reject(err);
                            console.log(err);
                        })
                    }
                })
            })
            
            
        })
        .catch(err=>{
            console.log(err);
            this.setState({
                parsedBOM:null,
                loadedExcelData:null,
                headers:null,
                bomOutput:null
            })
            alert("Unable to parse BOM");
        });
    }
    
    fileLoadChanged = (e)=>{
        var selectedFile = e.target.files[0];
        if (selectedFile) {
            
        }
        this.loadExcel(selectedFile);
        this.setState({
            excelFile:selectedFile
        });

    }
    deleteFile = (file, index)=>{
        SDK.Projects.deleteDeliverableFile(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id, file)
        .then(data=>{
            if(data){
                var deliverable = this.state.deliverable;
                deliverable.files.splice(index, 1);
                
                if(this.props.onSaved){
                    this.props.onSaved(data);
                }
                this.setState({
                    deliverable:deliverable
                });
            }
        })
        .catch(err=>{
            alert(err);
        })
    }
}

export default  BomSubmit;