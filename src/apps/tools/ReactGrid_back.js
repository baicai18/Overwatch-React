import React, { Component } from 'react';
import {Button, Spinner, Table, Badge} from 'react-bootstrap';
import 'react-data-grid/dist/react-data-grid.css';
import '../../styles/ReactGrid.css';
import XLSX from 'xlsx';


class ReactGrid extends Component {
    constructor(props){
        super(props)
        this.headerTable = React.createRef();
        this.scrollLeft=0;
        this.state = {
            loading:false,
            expandFunction:props.expandFunction,
            columns:props.columns,
            rowGetter:props.rowGetter,
            rowsCount:props.rowsCount,
            minHeight:props.height||props.minHeight,
            maxHeight:props.height||props.maxHeight,
            scrollLeft:0,
            multiSelect:props.multiSelect||false,
            expandRows:[],
            selectedRows:[],
            highlightedIndexes:[],
            export:this.props.export == null?true:this.props.export,
            showRowCount:this.props.showRowCount||false,
            formatters:props.formatters
        }
        this.rowRefs = [];
        //console.log(JSON.stringify(this.props.rowStyleFunction));
    }


    // Code is invoked after the component is mounted/inserted into the DOM tree.
    componentDidMount() {
        //this.pullBOM();
    }
    componentDidUpdate(props){
        if(props.loading !== this.props.loading || props.columns !== this.props.columns || props.rowGetter !== this.props.rowGetter || props.rowsCount !== this.props.rowsCount || props.formatters !== this.props.formatters){
            let selectedRows = this.state.selectedRows;
            // if(props.rowGetter !== this.props.rowGetter){
            //     selectedRows = [];
            // }
            this.setState({
                loading:this.props.loading,
                columns:this.props.columns,
                rowGetter:this.props.rowGetter,
                rowsCount:this.props.rowsCount,
                export:this.props.export == null?true:this.props.export,
                formatters:this.props.formatters,
                // selectedRows:selectedRows,
            })
            //console.log(JSON.stringify(this.props));
        }
    }
    rowClicked = (index, item)=>{
        var selectedRows = this.state.selectedRows;

        if(this.state.multiSelect){
            if(selectedRows.includes(index)){
                selectedRows.splice(selectedRows.indexOf(index),1);
                
            }else{
                selectedRows.push(index);
            }
        }else{
            selectedRows = [index]
        }

        this.setState({
            selectedRows:selectedRows
        },()=>{

        })
        if(this.props.onRowClicked){
            this.props.onRowClicked(index,item);
        }

    }

    addHighlightedIndex = (index)=>{
        return new Promise((resolve, reject)=>{
            let highlightedIndexes = this.state.highlightedIndexes;
            if(highlightedIndexes.indexOf(index) === -1){
                highlightedIndexes.push(index);
            }
            this.setState({
                highlightedIndexes:highlightedIndexes
            },()=>{
                this.forceUpdate();
                resolve(true);
            })
        })
    }
    clearHighlightedIndexes = (index)=>{
        return new Promise((resolve, reject)=>{
            let highlightedIndexes = [];
            this.setState({
                highlightedIndexes:highlightedIndexes
            },()=>{
                this.forceUpdate();
                resolve(true);
            })
        })
        
    }

    toggleExpand = (x)=>{
        let expandRows = this.state.expandRows;
        var index = expandRows.indexOf(x);
        if(index > -1){
            expandRows.splice(index,1);
        }else{
            expandRows.push(x);
        }
        this.setState({
            expandRows:expandRows
        })
    }

    displayRows = (columns)=>{
        const items = [];
        let lastItem;
        let alt = false;
        for(let x = 0; x < this.state.rowsCount; x++){
            let item = this.state.rowGetter(x);
            if(this.props.alternateBy && lastItem){
                if(item[this.props.alternateBy] !== lastItem[this.props.alternateBy]){
                    alt= !alt;
                }
            }

            let ref = React.createRef();
            this.rowRefs[x] = ref;
            items.push(
                <tbody key={item+x} ref={ref}>
                <tr key={x+item} onClick={()=>{this.rowClicked(x, item)}} 
                    className={
                        this.state.selectedRows.includes(x) || this.state.highlightedIndexes.includes(x)?
                        "table-info"
                        :alt?'alt-row'
                        :""} 
                    style={this.props.rowStyleFunction?this.props.rowStyleFunction(item):{}}>
                    {
                        this.state.expandFunction?
                        <td>
                            <Badge onClick={()=>{this.toggleExpand(x)}}>
                            {
                                this.state.expandRows.includes(x)?
                                <i className="fas fa-minus-circle"/>
                                :
                                <i className="fas fa-plus-circle"/>
                            }
                            </Badge>
                            
                        </td>
                        :null
                    }
                    {columns.map((x,index)=>{
                        return x.hidden?'':(
                            <td key={x+index}
                            style={
                                x.style?
                                x.style
                                :{}
                            } 
                            // style={{width:x.width?x.width:"150px"}} 
                            title={
                                item?
                                item[x.key] != null?
                                (
                                    x.formatter?
                                        x.formatter({value:item[x.key], row:item})
                                    :
                                        item[x.key].toString()
                                )
                                :null
                                :null
                                }
                            >
                                {
                                    item?
                                    item[x.key] != null?
                                        (
                                            x.formatter?
                                                x.formatter({value:item[x.key], row:item})
                                            :
                                                item[x.key].toString()
                                        )
                                    :x.formatIfEmpty?x.formatter?x.formatter({value:item[x.key], row:item}):null:null
                                    :null
                                }
                            </td>
                        )
                    })}
                </tr>
                <tr className={this.state.expandRows.includes(x)?'expand expand-show':'expand'}>
                    <td colSpan={columns.length+1} className={"p-0"} >
                        {/* <div> */}
                            {/* <pre> */}
                                {this.state.expandFunction?this.state.expandFunction(item):''}
                            {/* </pre> */}
                            

                        {/* </div> */}
                    </td>
                    
                </tr>
                </tbody>
            )
            lastItem = item;
        }
        return items;
    }
    clearSelectedRows = ()=>{
        this.setState({
            selectedRows:[]
        })
    }
    selectRow = (selectFunction, jumpTo, click)=>{
        return new Promise((resolve, reject)=>{
            if(this.state.rowGetter){
                for(let x = 0; x < this.state.rowsCount; x++){
                    if(selectFunction(this.state.rowGetter(x))){
                        this.setState({
                            selectedRows:[x]
                        }, ()=>{
                            if(jumpTo){
                                this.rowRefs[x].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                            
                            if(click){
                                if(this.props.onRowClicked){
                                    this.props.onRowClicked(x, this.state.rowGetter(x));
                                }
                            }
                            resolve(true);
                        })
                        return;
                    }
                }
                this.setState({
                    selectedRows:[]
                },()=>{
                    resolve(true);
                })
            }
        })
        
    }

    getSelectedRows=()=>{
        if(this.state.selectedRows.length > 0){
            return this.state.selectedRows.map((value,index)=>{
                return {
                    row:this.props.rowGetter?this.props.rowGetter(value):null,
                    index:value
                }
            })
        }else{
            return [];
        }
    }

    render() {
            var columns;
            if(this.state.columns == null){
                //need to manually define columns
                columns = [];
                if(this.state.rowGetter){
                    var obj = this.state.rowGetter(0);
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            columns.push({
                                key:key,
                                name:key,
                            })
                        }
                    }
                }
                

            }else{
                columns = this.state.columns;
            }

            return (
                <div>
                    {this.state.export?<Button variant={"success"} size={"sm"} onClick={this.exportExcel}>Export Excel <i className="fas fa-file-excel"></i></Button>:''}
                    {/* <div style={{overflow:"hidden",maxHeight:this.state.maxHeight?this.state.maxHeight:"50vh"}} className="border">
                        <Table ref={this.headerTable} className="table-fixed mb-0" style={{
                            position:"relative",
                            // left:"-" + this.state.scrollLeft + "px"
                        }} size="sm">
                            <thead>
                                <tr>
                                    {columns.map((x,index)=>{
                                        return x.hidden?'':(
                                            <th key={x.key} style={{width:x.width?(x.width + 'px'):"150px"}}>
                                                {x.name}
                                                <ColumnDrag width={x.width} onWidthChanged={(width)=>{this.columnWidthChanged(index, width)}}></ColumnDrag>
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                        </Table>
                    </div> */}
                    <div 
                        style={{overflow:"auto",minHeight:this.state.minHeight?this.state.minHeight:"0px",maxHeight:this.state.maxHeight?this.state.maxHeight:"50vh"}} 
                        className="border" 
                        // onScroll={this.handleScroll}
                        >
                        {
                        this.state.loading?
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>:
                        <Table className="table-fixed mb-0" size="sm">
                            <thead>
                                <tr>
                                    {
                                        this.state.expandFunction?
                                        <th width="50px">Expand</th>
                                        :null
                                    }
                                    {columns.map((x,index)=>{
                                        return x.hidden?'':(
                                            <th key={x.key} /*style={{width:x.width?(x.width + 'px'):"150px"}}*/>
                                                {x.name}
                                                {/* <ColumnDrag width={x.width} onWidthChanged={(width)=>{this.columnWidthChanged(index, width)}}></ColumnDrag> */}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                                {
                                    this.displayRows(columns)
                                }
                            {/* <tbody  >
                            </tbody> */}
                        </Table>
                        }
                    </div>
                    {
                        this.state.showRowCount?
                        <div>rows: {this.state.rowsCount}</div>
                        :''
                    }
                </div>
                
            )
    }
    handleScroll = (event)=>{
        //let scrollTop = event.currentTarget.scrollTop
        let scrollLeft= event.currentTarget.scrollLeft
        if(this.scrollLeft !== scrollLeft){
            this.scrollLeft = scrollLeft
            this.headerTable.current.style.left="-"+ scrollLeft + "px";
            // this.setState(
            //     {
            //         scrollLeft:scrollLeft
            //     }
            // );

        }
    }
    columnWidthChanged = (index, width)=>{
        //console.log(index + ', ' + width);
        var columns = this.state.columns;
        columns[index].width=width;
        this.setState({
            columns:columns
        },
        ()=>{
        })
       
    }

    exportExcel = ()=>{
        if(this.state.columns && this.state.columns.length > 0){
            for(let y = 0; y < this.state.columns.length; y++){
                //console.log(this.state.columns[y].formatter);
                //var data = row[this.state.columns[y].key];
                //tempRow[this.state.columns[y].name] = data;
            }
        }
        if(this.state.rowsCount > 0){
            let obj = []
            for(let x = 0; x < this.state.rowsCount; x++){
                let row = this.state.rowGetter(x)
                if(this.state.columns && this.state.columns.length > 0){
                    let tempRow = {}
                    for(let y = 0; y < this.state.columns.length; y++){
                        if(this.state.columns[y].export == null || this.state.columns[y].export===true){
                            let data = row[this.state.columns[y].key];
                            if(this.state.columns[y].exportFormatter){
                                data = this.state.columns[y].exportFormatter({value:data, row:row});
                            }else if(this.state.columns[y].formatter){
                                data = this.state.columns[y].formatter({value:data, row:row});
                            }
                            tempRow[this.state.columns[y].name] = data;
                        }
                    }
                    obj.push(tempRow);
                }else{
                    obj.push(this.state.rowGetter(x));
                }
            }

            let ws = XLSX.utils.json_to_sheet(obj);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

            this.download(this.s2ab(wbout),'output.xlsx', "application/octet-stream");
        }
    }
    s2ab(s) { 
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf);  //create uint8array as viewer
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }
    download(data, filename, type) {
        let file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            let a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
}



export default ReactGrid;
