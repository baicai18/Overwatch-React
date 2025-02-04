import React, { Component } from 'react';
import {Button, Spinner, Table, Badge} from 'react-bootstrap';
import SortButton from './SortButton';
import 'react-data-grid/dist/react-data-grid.css';
import '../../../styles/ReactGrid.css';
import XLSX from 'xlsx';

class ReactGrid extends Component {
    constructor(props){
        super(props)
        this.mainWindow = React.createRef();
        this.headerTable = React.createRef();
        this.scrollLeft=0;
        this.state = {
            loading:false,
            expandFunction:props.expandFunction,
            hideHeaders:props.hideHeaders||false,
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
            export:props.export == null?true:props.export,
            showRowCount:props.showRowCount||false,
            formatters:props.formatters,
            sortable:props.sortable || false,
            sortBy:props.sortBy||{columnKey:null,order:null}
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
    rowClicked = (index, item, e)=>{
        var selectedRows = this.state.selectedRows;

        if(this.state.multiSelect && e.ctrlKey){
            if(selectedRows.includes(index)){
                selectedRows.splice(selectedRows.indexOf(index),1);
                
            }else{
                selectedRows.push(index);
            }
        }else if(this.state.multiSelect && e.shiftKey){
            if(selectedRows.length > 0){
                let lastIndex = selectedRows[selectedRows.length -1];
                if(index > lastIndex){
                    for(let x = lastIndex; x < index; x++){
                        if(!selectedRows.includes(x+1)){
                            selectedRows.push(x+1);
                        }
                    }
                }else{
                    for(let x = index; x < lastIndex; x++){
                        if(!selectedRows.includes(x)){
                            selectedRows.push(x);
                        }
                    }
                }
                if (window.getSelection) {window.getSelection().removeAllRanges();}
                else if (document.selection) {document.selection.empty();}
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
        let items = [];
        let lastItem;
        let alt = false;

        // let scrollAmount = this.mainWindow.current?this.mainWindow.current.scrollTop:0;

        for(let x = 0; x < this.state.rowsCount; x++){
            let item = this.state.rowGetter(x);
            if(this.props.alternateBy && lastItem){
                if(item[this.props.alternateBy] !== lastItem[this.props.alternateBy]){
                    alt= !alt;
                }
            }

            let ref = React.createRef();
            this.rowRefs[x] = ref;
            // if(scrollAmount / 10 > x || (scrollAmount /10)+10 < x){
            //     items.push(
            //         <tbody key={item+x} ref={ref} style={{height:'30px'}}>
            //         <tr key={x+item} onClick={()=>{this.rowClicked(x, item)}} >
            //         </tr>
            //         </tbody>
            //     )
            // }else{
                items.push(
                    {
                        row:item,
                        display:(
                            <tbody key={item+x} ref={ref}>
                                <tr key={x+item} onClick={(e)=>{this.rowClicked(x, item,e)}} 
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
                                    {columns.map((column,index)=>{
                                        return column.hidden?'':(
                                            <td key={column+index}
                                            style={
                                                column.style?
                                                column.style
                                                :{}
                                            } 
                                            // style={{width:x.width?x.width:"150px"}} 
                                            title={
                                                item?
                                                item[column.key] != null?
                                                (
                                                    column.formatter?
                                                        column.formatter({value:item[column.key], row:item, index:x})
                                                    :
                                                        item[column.key].toString()
                                                )
                                                :null
                                                :null
                                                }
                                            >
                                                {
                                                    item?
                                                    item[column.key] != null?
                                                        (
                                                            column.formatter?
                                                            column.formatter({value:item[column.key], row:item, index:x})
                                                            :
                                                                item[column.key].toString()
                                                        )
                                                    :column.formatIfEmpty?column.formatter?column.formatter({value:item[column.key], row:item, index:x}):null:null
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
                    }
                    
                )
            // }
            
            lastItem = item;
        }
        if(this.state.sortable){
            if(this.state.sortBy.columnKey){
                items.sort((a,b)=>{
                    let column = columns.find((col)=>{
                        return col.key === this.state.sortBy.columnKey
                    });
                    let aValue = column && column.sortValue?
                                    column.sortValue({value:a.row[this.state.sortBy.columnKey],row:a.row})
                                    :a.row[this.state.sortBy.columnKey];
                    let bValue = column && column.sortValue?
                                    column.sortValue({value:b.row[this.state.sortBy.columnKey],row:b.row})
                                    :b.row[this.state.sortBy.columnKey];
                    if(aValue < bValue){
                        return this.state.sortBy.order==='ascending'?-1:1;
                    }
                    if(aValue > bValue){
                        return this.state.sortBy.order==='ascending'?1:-1;
                    }
                    return 0;
                })
            }
        }
        return items.map((x)=>{return x.display});
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
    sortChanged=(sortBy)=>{
        if(sortBy){
            this.setState({
                sortBy:sortBy
            },()=>{
                this.forceUpdate();
            })
        }else{
            this.setState({
                sortBy:{columnKey:null,order:null}
            },()=>{
                this.forceUpdate();
            })
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
                    {
                        this.props.title?
                        <Badge>{this.props.title}</Badge>:''
                    }
                    {
                        this.state.export?
                        <Button variant={"success"} size={"sm"} onClick={this.exportExcel}>Export Excel <i className="fas fa-download"></i></Button>
                        //<button className='close' style={{float:'initial'}} onClick={this.exportExcel} title="export"><i class="fas fa-download fa-xs"></i></button>
                        :''
                    }
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

                    {
                        this.props.buttons?
                        this.props.buttons.map((item)=>{
                            return item;
                        }):''
                    }
                    {
                        this.props.rightButtons?
                            <div className="header-actions mr-0">
                                {
                                    this.props.rightButtons.map((item)=>{
                                        return item;
                                    })
                                }
                            </div>
                        :''
                        
                    }
                    <div 
                        ref={this.mainWindow}
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
                            {!this.state.hideHeaders?
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
                                                <div>{x.name}</div>
                                                {this.state.sortable?<SortButton columnKey={x.key} sortOrder={this.state.sortBy.columnKey===x.key?this.state.sortBy.order:null} onClick={this.sortChanged}></SortButton>:''}
                                                
                                                {/* <ColumnDrag width={x.width} onWidthChanged={(width)=>{this.columnWidthChanged(index, width)}}></ColumnDrag> */}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            :''
                            }
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
        let scrollTop = event.currentTarget.scrollTop
        // let scrollLeft= event.currentTarget.scrollLeft
        // if(this.scrollLeft !== scrollLeft){
        //     this.scrollLeft = scrollLeft
        //     this.headerTable.current.style.left="-"+ scrollLeft + "px";
        //     // this.setState(
        //     //     {
        //     //         scrollLeft:scrollLeft
        //     //     }
        //     // );

        // }
        this.setState(
            {
                scrollTop:scrollTop
            }
        );

        // if(this.mainWindow.current){
        //     console.log(this.mainWindow.current.scrollTop);
        // }else{
        //     console.log("mainWindow null");
        // }
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
                                data = this.state.columns[y].exportFormatter({value:data, row:row, index:y});
                            }else if(this.state.columns[y].formatter){
                                data = this.state.columns[y].formatter({value:data, row:row, index:y});
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