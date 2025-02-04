import React from 'react';

import ReactDataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css' 
import XLSX from 'xlsx';

class DataGrid extends React.Component { 
    constructor(props){
        super(props);
        this.exportExcel = this.exportExcel.bind(this);
    }
    exportExcel(e){
        if(this.props.rowsCount > 0){

            var compiled = [];
            for(var x = 0; x < this.props.rowsCount; x++){
                var obj = this.props.rowGetter(x);
                var newObj = {};
                this.props.columns.forEach(prop=>{
                    newObj[prop.name] = obj[prop.key];
                })
                compiled.push(newObj);
            }

            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(compiled);
            XLSX.utils.book_append_sheet(wb, ws, "data");
            XLSX.writeFile(wb, 'output.xlsx');
        }
    }
    render() {
        return (
            <div>
                <button className="btn btn-sm btn-secondary mb-2" onClick={this.exportExcel}>Export Excel</button>
                <ReactDataGrid {...this.props}/>
            </div>);
    }
}

export default DataGrid;