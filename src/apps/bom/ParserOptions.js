import React from 'react';
import {Button, Card, Collapse} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import ParserField from './ParserField';
import BaseOptions from './BaseOptions';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class ParserOptions extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            bomDefinition:props.bomDefinition,
            parserOptions:props.parserOptions,
            bomParsers:[],
            bomOutputOptions:{},
            headers:props.headers||[],
            tableFormat:props.tableFormat,
            collapseOptions:true,
        }
        this.fieldRefs = [];
        this.baseOptionRef = React.createRef();
    }

    async componentDidMount(){
        
    }
    componentDidUpdate = (props)=>{
        if(this.props.headers !== props.headers){
            this.setState({
                headers:this.props.headers
            })
        }
        if(this.props.parserOptions !== props.parserOptions){
            this.setState({
                parserOptions:this.props.parserOptions
            })
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
        SDK.BOM.bomParser.parseBOM(this.state.loadedExcelData, this.state.parserOptions, this.state.bomDefinition)
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
        SDK.BOM.saveParser(this.state.parserOptions)
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

    getParserOptionData = ()=>{
        let baseOptions = this.baseOptionRef.current.getBaseOptionsData();
        let fields = this.fieldRefs.map((ref)=>{
            return ref.current.getFieldData();
        })
        return {
            baseOptions:baseOptions,
            fields:fields
        }

        //return fieldData;
    }
    clearOptions = ()=>{
        this.setState({
            parserOptions:{}
        },()=>{
            this.forceUpdate();
            this.fieldRefs.forEach(x=>{
                x.current.clearData();
            })
        })
    }

    render = ()=>{
            this.fieldRefs = [];
            return (
                <Card>
                    <Card.Header>
                        Parser Options
                        <Button className={'ml-3'} size={'sm'} onClick={()=>{this.setState({collapseOptions:!this.state.collapseOptions})}}>
                            {
                                this.state.collapseOptions?
                                <i class="fas fa-angle-up"/>
                                // <FontAwesomeIcon icon="angle-up"/>
                                :
                                <i class="fas fa-angle-down"/>
                                // <FontAwesomeIcon icon="angle-down"/>
                            }
                        </Button>
                        <div className="header-actions">
                            <Button size={'sm'} onClick={this.clearOptions}>Clear</Button>
                        </div>
                    </Card.Header>
                    <Collapse in={this.state.collapseOptions}>
                        <div>
                        <Card.Body className="border">
                            <BaseOptions ref={this.baseOptionRef} key={this.state.parserOptions} onDataChanged={this.baseOptionsChanged} baseOptions={this.state.parserOptions?this.state.parserOptions.baseOptions:null}/>
                        </Card.Body>
                        <Card.Header>
                            Fields
                        </Card.Header>
                        <Card.Body className="border">
                            <table className="table border" key={this.state.parserOptions}>
                                <thead>
                                    <tr>
                                        <th>Field Name</th>
                                        {/* <th>Type</th> */}
                                        <th>Column Name</th>
                                        <th>Multiple in Cell</th>
                                        <th>Deliminator</th>
                                        <th>Multiple Columns</th>
                                        <th>Column Deliminator</th>
                                    </tr>
                                </thead>
                                {
                                    this.state.bomDefinition.fields.map((field,index)=>{
                                    let ref = React.createRef();
                                    this.fieldRefs.push(ref);
                                    return (
                                        <ParserField 
                                        tableFormat={true}
                                        ref={ref} 
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
                                        />
                                    )
                                })
                            }
                            </table>
                            
                        </Card.Body>
                        </div>
                        
                    </Collapse >
                    
                    {/* <Card.Body>
                        <pre>
                            {this.state.bomDefinition?JSON.stringify(this.state.bomDefinition, null, 2):''}
                        </pre>
                    </Card.Body> */}
                </Card>
            );
        
    }

}

export default  ParserOptions;