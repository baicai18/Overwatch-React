import React from 'react';
import {Button, Form, Card, Col} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ParserOptions from './ParserOptions';

class BomParser extends React.Component{

    constructor(props){
        super(props);
        this.parserSelect = React.createRef();
        this.state = {
            dataLoaded:false,
            headerIndex: 1,
            dataIndex:2,
            excelFile:null,
            bomDefinition:{},
            parserOptions:{},
            bomParsers:[],
            bomOutputOptions:{},
            parsedBOM:{},
            bomOutput:{},
            loadedExcelData:{}
        }
        this.parserOptionsRef = React.createRef();
    }

    async componentDidMount(){
        
        try{
            let bomDefinition = await SDK.BOM.getBOMDefinition();
            let bomOutputOptions = await SDK.BOM.getDefaultBOMOutput();
            let bomParsers = await SDK.BOM.getParsers();
            let parserOptions = null;
            let headerIndex = 1;
            let dataIndex = 2;

            if(bomParsers.length > 0){
                try{
                    parserOptions = await SDK.BOM.getParser(bomParsers[0].baseOptions.parserName)
                    headerIndex = parserOptions.baseOptions.headerIndex;
                    dataIndex = parserOptions.baseOptions.dataIndex;
                }catch(err){
    
                }

            }
            
            this.setState({
                bomDefinition:bomDefinition,
                bomOutputOptions:bomOutputOptions,
                bomParsers:bomParsers,
                parserOptions:parserOptions?parserOptions:this.state.parserOptions,
                headerIndex:headerIndex,
                dataIndex:dataIndex,
                dataLoaded:true
            })
            

        }catch(err){
            console.log(err);
        }
        
    }

    baseOptionsChanged = (data)=>{
        var parserOptions = this.state.parserOptions;
        parserOptions.baseOptions = data;
        this.setState({
            parserOptions: parserOptions
        })
    }

    fieldDataChanged = (index, data)=>{
        if(data){
            var parserOptions = this.state.parserOptions;
            if(parserOptions.fields == null){
                parserOptions.fields = []
            }

            var found = false;
            for(var x = 0; x < parserOptions.fields.length; x++){
                if(parserOptions.fields[x].field_name === data.field_name && parserOptions.fields[x].type === data.type){

                    found = true;
                    parserOptions.fields[x] = data;
                }
            }
            if(!found){
                parserOptions.fields.push(data);
            }
            this.setState({
                parserOptions:parserOptions
            })
        }
        

    }
    testOptions = ()=>{
        let parserOptions = this.parserOptionsRef.current.getParserOptionData();
        SDK.BOM.bomParser.parseBOM(this.state.loadedExcelData, parserOptions, this.state.bomDefinition)
        .then(data=>{
            this.setState({
                parsedBOM:data
            })
            SDK.BOM.bomParser.outputBOM(data, this.state.bomOutputOptions)
            .then(data=>{
                this.setState({
                    bomOutput:data
                })
            })
            .catch(err=>{
                console.log(err);
                alert(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
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
    excelOptionsChanged = (e)=>{
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var parserOptions = this.state.parserOptions;
        if(!parserOptions.baseOptions){
            parserOptions.baseOptions={};
        }
            
        parserOptions.baseOptions[name] = value;
        this.setState({
            [name]:value
        });
    }

    loadExcel = (file)=>{
        SDK.BOM.bomParser.getExcelData(file, this.state.headerIndex, this.state.dataIndex)
        .then(data=>{
            this.setState({
                loadedExcelData:data,
                headers:data.header
            })
        })
        .catch(err=>{
            console.log(err);
        });
    }

    deleteParser = async(e)=>{
        try{
            await SDK.BOM.deleteParser(this.parserSelect.current.value)
            let bomParsers = await SDK.BOM.getParsers();
            this.setState({
                bomParsers:bomParsers
            })
            alert("Deleted");
        }catch(err){
            alert(err);
        }
    }

    parserChanged = async(e)=>{

        let parserName = e.target.value;
        console.log("Load: " + parserName);
        let parserOptions = await SDK.BOM.getParser(parserName)
        let headerIndex = parserOptions.baseOptions.headerIndex;
        let dataIndex = parserOptions.baseOptions.dataIndex;

        this.setState({
            parserOptions:parserOptions,
            headerIndex:headerIndex,
            dataIndex:dataIndex
        },()=>{
            this.forceUpdate();
        })
    }

    saveParser = ()=>{
        let parserOptions = this.parserOptionsRef.current.getParserOptionData();
        SDK.BOM.saveParser(parserOptions)
        .then(async data=>{
            
            alert("saved");
            try{
                let bomParsers = await SDK.BOM.getParsers();
                this.setState({
                    bomParsers:bomParsers
                })
            }catch(err){

            }
        })
        .catch(err=>{
            alert(err.message);
        })
    }

    render = ()=>{
        
        if(!this.state.dataLoaded){
            return <div></div>
        }else{
            return (
                
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Row>
                                <Form.Group className="col-auto">
                                    <Form.Label htmlFor="headerIndex">Header Row Index</Form.Label>
                                    <Form.Control type="number" className="form-control-sm" name="headerIndex" value={this.state.headerIndex} min="1" onChange={this.excelOptionsChanged}/>
                                </Form.Group>
                                <Form.Group className="form-group col-auto">
                                    <Form.Label htmlFor="dataIndex">Data Row Index</Form.Label>
                                    <Form.Control type="number" className="form-control-sm" name="dataIndex" value={this.state.dataIndex} min="2" onChange={this.excelOptionsChanged}/>
                                </Form.Group>
                                <Form.Group className="form-group col-auto">
                                    <Form.Label htmlFor="fileUploader">Excel Data</Form.Label>
                                    
                                    <div className="custom-file">
                                    <input ref="this.excelFileInput" type="file" className=" form-control-sm" id="fileUploader" aria-describedby="inputGroupFileAddon01" accepts=".xls, .xlsx" onChange={this.fileLoadChanged} onClick={(e)=>{e.target.value=''}}/>
                                        <Form.Label className="custom-file-label form-control form-control-sm" htmlFor="fileUploader">{this.state.excelFile?this.state.excelFile.name:'Choose file'}</Form.Label>
                                    </div>
                                </Form.Group>
                            </Form.Row>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                        </div>
                        <div className="card-body">
                            <ReactGrid
                                columns={this.state.loadedExcelData.header?this.state.loadedExcelData.header.map(row=>{
                                    return {key:row, name:row, resizable:true}
                                }):[]}
                                rowGetter={i=> this.state.loadedExcelData.row_objects?this.state.loadedExcelData.row_objects[i]:{}}
                                rowsCount={this.state.loadedExcelData.row_objects?this.state.loadedExcelData.row_objects.length:0} 
                                sortable={true}
                                
                            />
                        </div>
                    </div>
                    <Card>
                        <Card.Header>
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="validationCustom01">
                                    <Form.Label>Parser Options</Form.Label>
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
                            </Form.Row>
                            <div class="header-actions">
                                <a onClick={this.deleteParser}>
                                    <i class="fas fa-times"/>
                                    {/* <FontAwesomeIcon icon="times"/> */}
                                </a>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ParserOptions 
                                ref={this.parserOptionsRef} 
                                bomDefinition={this.state.bomDefinition} 
                                parserOptions={this.state.parserOptions} 
                                headers={this.state.headers} />
                        </Card.Body>
                        
                        <Card.Body>
                            <Button size={'sm'} onClick={this.testOptions}>Test Options</Button>
                            <Button type="button" size={'sm'} onClick={this.saveParser}>Save Parser</Button>
                        </Card.Body>
                    </Card>
                    
                    {/* <div className="card">
                        <div className="card-header">
                            <Form.Row>
                                <Form.Group as={Col} md="4" controlId="validationCustom01">
                                    <Form.Label>Parser Options</Form.Label>
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
                            </Form.Row>
                            <div class="header-actions">
                                <a onClick={this.deleteParser}>
                                    <FontAwesomeIcon icon="times"/>
                                </a>
                            </div>
                        </div>
                        <div className="card-body" id="parserOptions">
                            {   
                                this.state.bomDefinition.definition_name ?
                                    <Form>
                                        <Card.Body className="border">
                                            <BaseOptions key={this.state.parserOptions} onDataChanged={this.baseOptionsChanged} baseOptions={this.state.parserOptions?this.state.parserOptions.baseOptions:null}/>
                                        </Card.Body>
                                        {this.state.bomDefinition.fields.map((field, index)=>{
                                            return (
                                                <Card.Body key={index} className="border card-body-thin">
                                                    <ParserField 
                                                        key={this.state.headers} 
                                                        index={index} 
                                                        fieldDefinition={field} 
                                                        fieldData={
                                                            this.state.parserOptions?
                                                            this.state.parserOptions.fields && field?
                                                                this.state.parserOptions.fields.find(row=>{
                                                                    if(row){
                                                                        return row.field_name === 
                                                                        field.field_name && 
                                                                        row.type === 
                                                                        field.type;
                                                                    }else{
                                                                        return false;
                                                                    }
                                                                    
                                                                })?
                                                                this.state.parserOptions.fields.find(row=>{
                                                                    if(row){
                                                                        return row.field_name === field.field_name && row.type === field.type;
                                                                    }else{
                                                                        return false;
                                                                    }
                                                                    
                                                                }):
                                                                {}
                                                            :{}
                                                            :{}
                                                        } 
                                                        headers={this.state.headers} 
                                                        onDataChanged={this.fieldDataChanged}/>
                                                </Card.Body>
                                            )
                                        })}
                                    </Form>
                                :
                                    <div/>
                            }
                        </div>
                        <div className="card-body">
                            <button type="button" className="btn btn-primary" id="testOption" onClick={this.testOptions}>Test Options</button>
                            <button type="button" className="btn btn-primary" id="saveParser" onClick={this.saveParser}>Save Parser</button>
                        </div>
                    </div> */}
                    <div className="card">
                        <div className="card-header">
                            BOM Output
                        </div>
                        <div className="card-body">
                            <ReactGrid
                                columns={this.state.bomOutput.header?this.state.bomOutput.header.map(row=>{
                                    return {key:row, name:row, resizable:true}
                                }):[]}
                                rowGetter={i=> this.state.bomOutput.row_objects?this.state.bomOutput.row_objects[i]:{}}
                                rowsCount={this.state.bomOutput.row_objects?this.state.bomOutput.row_objects.length:0} 
                                
                            />
                        </div>
                    </div>
                    {/* <div className="card">
                        <div className="card-header">
                            Parsed BOM
                        </div>
                        <div className="card-body">
                            <ReactJson src={this.state.parsedBOM}/>
                        </div>
                    </div> */}
                    {/* <div className="card">
                        <div className="card-header">
                            ExcelData JSON
                        </div>
                        <div className="card-body">
                            <ReactJson src={this.state.loadedExcelData}/>
                        </div>
                    </div> */}
                    {/* <div className="card">
                        <div className="card-header">
                            Parser JSON
                        </div>
                        <div className="card-body">
                            <ReactJson src={this.state.parserOptions}/>
                        </div>
                    </div> */}
                    {/* <div className="card">
                        <div className="card-header">
                            getBOMDefinition JSON
                        </div>
                        <div className="card-body">
                            <ReactJson src={this.state.bomDefinition}/>
                        </div>
                    </div> */}
    
                </div>
            );
        }
        
    }

}

export default  BomParser;