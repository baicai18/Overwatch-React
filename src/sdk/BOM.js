
import fetcher from '../fetcher';
import  XLSX from 'xlsx';
var BOM = {
    getBOMDefinition: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/definition/active');
                if(response.ok){
                    resolve(await response.json())
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
        
    },
    getFieldTypes: ()=> {
        return new Promise(async (resolve, reject) =>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/fieldTypes');
                if(response.ok){
                    resolve(await response.json())
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
        
    },
    getDefaultBOMOutput: ()=> {
        return new Promise(async (resolve, reject) =>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/output/default');
                if(response.ok){
                    resolve(await response.json())
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
        
    },
    getParser: (parserName)=> {
        return new Promise(async (resolve, reject) =>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/parser/' + (parserName?parserName:''));
                if(response.ok){
                    resolve(await response.json())
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    deleteParser: (parserName)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/parser/' + parserName, {
                    method: 'DELETE'
                })
                if(response.ok){
                    resolve(true);
                }
            }catch(err){
                console.log(err);
                reject(err);
            }
        });
        
    },
    getParsers: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/parsers', )
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err);
            }
        });
    },
    saveParser: parserOptions=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/parser', {
                    method: 'POST',
                    body: JSON.stringify(parserOptions)
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    saveDefinition: bomDefinition=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/definition', {
                    method: 'POST',
                    body: JSON.stringify(bomDefinition)
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    saveOutput: bomOutput=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/boms/output', {
                    method: 'POST',
                    body: JSON.stringify(bomOutput),
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    bomParser:{
        getExcelData: function (file, headerIndex, dataIndex) {
            if(headerIndex == null){
                headerIndex = 1;
            }
            if(dataIndex == null){
                dataIndex = headerIndex+1;
            }
    
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var data = event.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
    
                    workbook.SheetNames.forEach(function (sheetName) {
    
                        var tempData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, range:headerIndex-1, blankrows:true });
                        var XL_header = tempData[0];
                        
                        tempData.splice(1,dataIndex-headerIndex - 1);
    
                        var index = tempData.length;
                        for (let x = 0; x < tempData.length; x++) {
                            if (tempData[x].length === 0) {
                                //found blank
                                index = x;
                                break;
    
                            }
                        }
                        var XL_header_data = tempData.slice(1, index);
                        for (let x = 0; x < XL_header_data.length; x++) {
                            for (let y = 0; y < XL_header_data[x].length; y++) {
                                if (XL_header_data[x][y] == null) {
                                    XL_header_data[x][y] = '';
                                }
                            }
                            if (XL_header_data[x].length < XL_header.length) {
                                for (let z = XL_header_data[x].length; z <= XL_header.length; z++) {
                                    XL_header_data[x].push('');
                                }
                            }
                        }
    
                        // var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, range:headerIndex-1, blankrows:true });
                        var new_row_objects = XL_header_data.map(row=>{
                            var obj = {}
                            for(let x = 0; x < XL_header.length; x++){
                                obj[XL_header[x]] = row[x];
                            }
                            return obj
                        })
                        
    
                        //({ header: XL_header, data: XL_header_data, row_objects: XL_row_object.slice(0,index-1) });
    
                        resolve({ header: XL_header, data: XL_header_data, row_objects: new_row_objects });
                    })
                };
                reader.onerror = function (event) {
                    reject("File could not be read! Code " + event.target.error.code);
                };
                reader.readAsBinaryString(file);
    
            })
            
        },
        parseBOM: function (data, options, bomDefinition) {
            // console.log("PARSE: " + JSON.stringify(bomDefinition));
            return new Promise(async (resolve, reject)=>{
                try{
    
                    let headerMap = {};
                    for(let x = 0; x < data.header.length; x++){
                        headerMap[data.header[x]] = x;
                    }
    
                    let topNode;
                    let currentNode;
                    let index = 0;
                    let hasLevel = false;
                    let hasParent = false;
            
                    for (let y = 0; y < options.fields.length; y++) {
                        if (options.fields[y].type === "level" && options.fields[y].column_name !== "") {
                            hasLevel = true;
                        }
                        if (options.fields[y].type === "parent_item_number" && options.fields[y].column_name !== "") {
                            hasParent = true;
                        }
                    }
            
            
            
                    if (options.baseOptions.topLevel) {
                        //we have top level, otherwise create new BOMNode
                        topNode = BOM.bomParser.getBOMNodeFromRow(data.data[0], headerMap, options, bomDefinition)
                        index = 1;
                    } else {
                        topNode = {
                            level: 0,
                            parentItemnumber: null,
                            seq: null,
                            item_number: null,
                            description: null,
                            quantity: null,
                            reference_designators: [],
                            manufacturer_items: [],
                            components: []
                        }
                    }
                    currentNode = topNode;
                    for (let x = index; x < data.data.length; x++) {
                        var node = BOM.bomParser.getBOMNodeFromRow(data.data[x], headerMap, options, bomDefinition)
                        
                        if (hasLevel) {
                            // var level;
                            // if (node.level === 0) {
                            //     level = 1;
                            // }
                            if (node.level > currentNode.level + 1) {
                                currentNode = currentNode.components[currentNode.components.length - 1];
                            } else if (node.level < currentNode.level + 1) {
                                while (node.level < currentNode.level + 1) {
                                    if(currentNode.parentNode){
                                        currentNode = currentNode.parentNode;
                                    }else{
                                        break;
                                    }
                                    
                                }
                            }
                        } else if (hasParent) {
                            var tempParent = BOM.bomParser.findItemNumberNodes(topNode, node.parent_item_number);
                            if (tempParent.length > 0) {
                                currentNode = tempParent[0];
                            } else {
                                currentNode = topNode;
                            }
            
                            
                        }
                        // console.log(x);
                        // console.log(JSON.parse(JSON.stringify(currentNode,function (key, value) {
                        //     if (key == "parentNode") {
                        //         return undefined;
                        //     }
                        //     return value;
                        // }, 2)));
                        // console.log(JSON.parse(JSON.stringify(node,function (key, value) {
                        //     if (key == "parentNode") {
                        //         return undefined;
                        //     }
                        //     return value;
                        // }, 2)));
                        node.parentNode = currentNode;
                        currentNode.components.push(node);
                    }
                    //now we have to merge items
                    // console.log(topNode);
                    BOM.bomParser.findAndMerge(topNode);
        
                    resolve(topNode);
                }catch(err){
                    reject(err);
                }
            })
            
    
            
        },
        findAndMerge: function (node, options) {
            var lastNonEmptyNode = null;
            for (let x = 0; x < node.components.length; x++) {
                if (x >= node.components.length) {
                    break;
                }
                let foundMatch = false;
                if (node.components[x].item_number != null && node.components[x].item_number !== "") { //check for matching item numbers
                    //we have an item_number,
                    foundMatch = true;
                    for (let y = x + 1; y < node.components.length; y++) {
                        if (y >= node.components.length) {
                            break;
                        }
                        if (node.components[y].item_number === node.components[x].item_number) {
                            //found
                            if(node.components[x].reference_designators){
                                node.components[x].reference_designators = node.components[x].reference_designators.concat(node.components[y].reference_designators);
                            }else{
                                node.components[x].reference_designators = node.components[y].reference_designators;
                            }
                            if(node.components[x].manufacturer_items){
                                node.components[x].manufacturer_items = node.components[x].manufacturer_items.concat(node.components[y].manufacturer_items);
                            }else{
                                node.components[x].manufacturer_items = node.components[y].manufacturer_items;
                            }
                            
                            if (node.components[y].quantity) {
                                node.components[x].quantity += node.components[y].quantity;
                            }
                            node.components.splice(y, 1);
                            y--;
                            foundMatch = true;
                            // console.log(1 + ": " + y + " : " + node.components.length);
                        } else {
    
                        }
                    }
                } else if(node.components[x].reference_designators && node.components[x].reference_designators.length > 0) {//check to see if matching references and merge manufacturer parts
                    for (let y = x + 1; x < node.components.length; y++) {
                        if (y >= node.components.length) {
                            break;
                        }
                        if (node.components[y].reference_designators.length === node.components[x].reference_designators.length) {
                            //might be match
    
                            let hasMissing = false;
                            for (let z = 0; z < node.components[x].reference_designators.length; z++) {
                                if (!node.components[y].reference_designators.includes(node.components[x].reference_designators[z])) {
                                    hasMissing = true;
                                    break;
                                }
                            }
                            if (!hasMissing) {
                                for (let z = 0; z < node.components[y].reference_designators.length; z++) {
                                    if (!node.components[x].reference_designators.includes(node.components[y].reference_designators[z])) {
                                        hasMissing = true;
                                        break;
                                    }
                                }
                            }
                            if (!hasMissing) {
                                //this is a match
                                node.components[x].manufacturer_items = node.components[x].manufacturer_items.concat(node.components[y].manufacturer_items);
                                if (node.components[y].quantity) {
                                    node.components[x].quantity += node.components[y].quantity;
                                }
                                node.components.splice(y, 1);
                                y--;
                                foundMatch = true;
                                // console.log(2 + ": " + y + " : " + node.components.length);
                            }
                        }
    
                    }
                }
                //check for same sequences
                if (node.components[x].seq != null && node.components[x].seq !== "" && !foundMatch) {
                    for (let y = x + 1; y < node.components.length; y++) {
                        if (y >= node.components.length) {
                            break;
                        }
                        if (node.components[y].seq === node.components[x].seq) {
                            //found
                            node.components[x].reference_designators = node.components[x].reference_designators.concat(node.components[y].reference_designators);
                            node.components[x].manufacturer_items = node.components[x].manufacturer_items.concat(node.components[y].manufacturer_items);
                            if (node.components[y].quantity) {
                                node.components[x].quantity += node.components[y].quantity;
                            }
                            node.components.splice(y, 1);
                            y--;
                            foundMatch = true;
                            // console.log(3 + ": " + y + " : " + node.components.length);
                        } 
                    }
                }
                //check for same manufacturer partnumbers
                if(node.components[x].manufacturer_items && !foundMatch){
                    if (node.components[x].manufacturer_items.length > 0) {
                        for (let y = x + 1; y < node.components.length; y++) {
                            if (y >= node.components.length) {
                                break;
                            }
                            if (node.components[y].manufacturer_items.length === node.components[x].manufacturer_items.length) {
                                //might be match
        
                                let hasMissing = false;
                                for (let z = 0; z < node.components[x].manufacturer_items.length; z++) {
                                    let found = false;
                                    for (let i = 0; i < node.components[y].manufacturer_items.length; i++) {
                                        if (node.components[y].manufacturer_items[i].manufacturer === node.components[x].manufacturer_items[z].manufacturer && node.components[y].manufacturer_items[i].manufacturer_item_number === node.components[x].manufacturer_items[z].manufacturer_item_number) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        hasMissing = true;
                                        break;
                                    }
                                }
                                if (!hasMissing) {
        
                                    for (let z = 0; z < node.components[y].manufacturer_items.length; z++) {
                                        let found = false;
                                        for (let i = 0; i < node.components[x].manufacturer_items.length; i++) {
                                            if (node.components[x].manufacturer_items[i].manufacturer === node.components[y].manufacturer_items[z].manufacturer && node.components[x].manufacturer_items[i].manufacturer_item_number === node.components[y].manufacturer_items[z].manufacturer_item_number) {
                                                found = true;
                                                break;
                                            }
                                        }
                                        if (!found) {
                                            hasMissing = true;
                                            break;
                                        }
                                    }
                                }
                                if (!hasMissing) {
                                    //this is a match
                                    node.components[x].reference_designators = node.components[x].reference_designators.concat(node.components[y].reference_designators);
                                    if (node.components[y].quantity) {
                                        node.components[x].quantity += node.components[y].quantity;
                                    }
                                    node.components.splice(y, 1);
                                    y--;
                                    // console.log(4 + ": " + y + " : " + node.components.length);
                                }
                            }
                        }
                    }
                    //finally check if it is empty except for manufacturer parts
                    if ((node.components[x].item_number == null || node.components[x].item_number === "") && (node.components[x].revision == null || node.components[x].revision === "") && (node.components[x].description == null || node.components[x].description === "") && (node.components[x].quantity == null || node.components[x].quantity === 0) && (node.components[x].seq == null || node.components[x].seq === "") && node.components[x].reference_designators.length === 0) {
                        if (lastNonEmptyNode) {
                            lastNonEmptyNode.manufacturer_items = lastNonEmptyNode.manufacturer_items.concat(node.components[x].manufacturer_items);
                            node.components.splice(x, 1);
                            x--;
                            foundMatch = true;
                            // console.log(5+ ": " + x + " : " + node.components.length);
                        }
                    } else {
                        lastNonEmptyNode = node.components[x];
                    }
                }
                
                
    
    
            }
        },
        findItemNumberNodes: function (node, item_number) {
            var items = [];
            if (node.item_number === item_number) {
                items.push(node);
            }
            for (var x = 0; x < node.components.count; x++) {
                items = items.concat(BOM.findItemNumberNodes(node.compoennts[x], item_number));
            }
            return items;
        },
        getBOMNodeFromRow: function(row, headerMap, options, bomDefinition) {
            var bomnode = {
                //level: 0,
                //parentItemnumber: null,
                //seq: null,
                //item_number: null,
                //quantity: null,
                //reference_designators: [],
                //manufacturer_parts: [],
                //components:[]
            }
    
            if(row){
    
            }else{
                alert(JSON.stringify(row));
            }
            for (let x = 0; x < options.fields.length; x++) {
    
                switch (options.fields[x].type) {
                    case "manufacturer_items":
                        if (options.fields[x].multiple) {
                            //create temp object to store array values before merging
                            var tempObject = {};
                            for (let y = 0; y < options.fields[x].fields.length; y++) {
                                if(options.fields[x].fields[y].column_name != null && options.fields[x].fields[y].column_name != ''){
                                    if (options.fields[x].fields[y].multiple) {
    
    
                                        if (options.fields[x].fields[y].multiple_in_column) {
                                            tempObject[options.fields[x].fields[y].type] = row[headerMap[options.fields[x].fields[y].column_name]].toString().split(options.fields[x].fields[y].deliminator);
        
                                        } else if (options.fields[x].fields[y].multiple_columns) {
        
                                            //get deliminator
                                            tempObject[options.fields[x].fields[y].type] = [];
                                            var index = 1;
                                            while (true) {
                                                if (row[headerMap[options.fields[x].fields[y].column_name + options.fields[x].fields[y].col_deliminator + index.toString()]]) {
                                                    tempObject[options.fields[x].fields[y].type].push(row[headerMap[options.fields[x].fields[y].column_name + options.fields[x].fields[y].col_deliminator + index.toString()]]);
                                                } else {
                                                    break;
                                                }
                                                index++;
                                            }
                                        } else {
                                            tempObject[options.fields[x].fields[y].type] = [row[headerMap[options.fields[x].fields[y].column_name]]];
                                        }
                                    } else {
                                        tempObject[options.fields[x].fields[y].type] = [row[headerMap[options.fields[x].fields[y].column_name]]];
                                    }
                                }
                                
                            }
    
                            if (options.fields[x].multiple) {
                                bomnode[options.fields[x].type] = [];
                                var values = [];
                                
                                while (true) {
                                    var item = {};
    
                                    var found = false;
                                    Object.keys(tempObject).forEach(function (key, index) {
                                        if (tempObject[key].length > 0) {
                                            found = true;
                                            item[key] = tempObject[key][0];
                                            tempObject[key].shift();
                                        }else{
                                            var maxLength = 0;
                                            Object.keys(tempObject).forEach(function (key, index) {
                                                if (tempObject[key].length > maxLength) {
                                                    maxLength = tempObject[key].length;
                                                }
                                            });
    
                                            if(maxLength > 0){
                                                //found
                                                item[key] = bomnode[options.fields[x].type][bomnode[options.fields[x].type].length - 1][key];
                                                tempObject[key].shift();
                                                found = true;
                                            }
                                        }
                                    });
    
                                    if (found) {
                                        if(item.manufacturer  || item.manufacturer_item_number){
                                            bomnode[options.fields[x].type].push(item);
                                        }else{
                                            // console.log(item);
                                            
                                        }
                                        
                                    } else {
                                        break;
                                    }
                                }
                            } else {
                                //just place tempObject as is
                                if(tempObject.manufacturer || tempObject.manufacturer_item_number){
                                    bomnode[options.fields[x].type] = tempObject;
                                }
                                
                            }
                        } else {
    
    
                        }
                        break;
                    case "object":
                        if (options.fields[x].multiple) {
                            //create temp object to store array values before merging
                            var tempObject = {};
                            for (var y = 0; y < options.fields[x].fields.length; y++) {
                                if (options.fields[x].fields[y].multiple) {
    
    
                                    if (options.fields[x].fields[y].multiple_in_column) {
                                        tempObject[options.fields[x].fields[y].field_name] = row[headerMap[options.fields[x].fields[y].column_name]].split(options.fields[x].fields[y].deliminator);
    
                                    } else if (options.fields[x].fields[y].multiple_columns) {
    
                                        //get deliminator
                                        tempObject[options.fields[x].fields[y].field_name] = [];
                                        var index = 1;
                                        while (true) {
                                            if (row[headerMap[options.fields[x].fields[y].column_name + options.fields[x].fields[y].col_deliminator + index.toString()]]) {
                                                tempObject[options.fields[x].fields[y].field_name].push(row[headerMap[options.fields[x].fields[y].column_name + options.fields[x].fields[y].col_deliminator + index.toString()]]);
                                            } else {
                                                break;
                                            }
                                            index++;
                                        }
                                    } else {
                                        tempObject[options.fields[x].fields[y].field_name] = row[headerMap[options.fields[x].fields[y].column_name]];
                                    }
                                } else {
                                    tempObject[options.fields[x].fields[y].field_name] = row[headerMap[options.fields[x].fields[y].column_name]];
                                }
                            }
    
                            if (options.fields[x].multiple) {
                                bomnode[options.fields[x].field_name] = [];
                                var values = [];
                                while (true) {
                                    var item = {};
    
                                    var found = false;
                                    Object.keys(tempObject).forEach(function (key, index) {
                                        if (tempObject[key].length > 0) {
                                            found = true;
                                            item[key] = tempObject[key][0];
                                            tempObject[key].shift();
                                        }
                                        // key: the name of the object key
                                        // index: the ordinal position of the key within the object 
                                    });
                                    if (found) {
                                        bomnode[options.fields[x].field_name].push(item);
                                    } else {
                                        break;
                                    }
                                }
                            } else {
                                //just place tempObject as is
                                bomnode[options.fields[x].field_name] = tempObject;
                            }
                        } else {
    
                            
                        }
                        break;
                    case "extra":
                        if (row[headerMap[options.fields[x].column_name]]) {
                            if (options.fields[x].multiple) {
                                if (options.fields[x].multiple_in_column) {
                                    var values = row[headerMap[options.fields[x].column_name]].split(options.fields[x].deliminator);
                                    bomnode[options.fields[x].field_name] = values;
                                } else {
                                    bomnode[options.fields[x].field_name] = row[headerMap[options.fields[x].column_name]];
                                }
                            } else {
                                bomnode[options.fields[x].field_name] = row[headerMap[options.fields[x].column_name]];
                            }
                        } else {
                            if (options.fields[x].multiple) {
                                bomnode[options.fields[x].field_name] = [];
                            } else {
                                bomnode[options.fields[x].field_name] = '';
                            }
    
                        }
                        break;
                    case "keyword_search":
                        if (options.fields[x].column_name !== '') {
                            let fieldValue = row[headerMap[options.fields[x].column_name]];
                            if(fieldValue != null && fieldValue !== ''){
                                let retValue;
                                let definitionField = bomDefinition.fields.find((row)=>{
                                    return row.field_name === options.fields[x].field_name && row.type === options.fields[x].type;
                                })
                                if(definitionField == null){
                                    definitionField = {};
                                }
                                // console.log("FieldValue: " + JSON.stringify(fieldValue));
                                // console.log("FIELD: " + JSON.stringify(options.fields[x]));
                                // console.log("definitionField: " + JSON.stringify(definitionField));
                                if(options.fields[x].multiple){
                                    retValue = []
                                }else{
                                    retValue = '';
                                }
                                if(definitionField.searchValues){
                                    let found = false;
                                    for(let i = 0; i < definitionField.searchValues.length; i++){

                                        if(fieldValue.toString().includes(definitionField.searchValues[i].search_value)){
                                            if(options.fields[x].multiple){
                                                retValue.push(definitionField.searchValues[i].display_value);
                                                found=true;
                                            }else{
                                                retValue = definitionField.searchValues[i].display_value;
                                                found=true;
                                                break;
                                            }
                                        }
                                    }
                                    if(!found){
                                        if(definitionField.default_value){
                                            if(options.fields[x].multiple){
                                                retValue.push(definitionField.default_value);
                                            }else{
                                                retValue=definitionField.default_value;
                                            }
                                        }
                                    }
                                    bomnode[options.fields[x].field_name] = retValue;
                                }
                            }else{
                                if (options.fields[x].multiple) {
                                    bomnode[options.fields[x].field_name] = [];
                                } else {
                                    bomnode[options.fields[x].field_name] = '';
                                }
                            }

                            // if (row[headerMap[options.fields[x].column_name]] !== null && row[headerMap[options.fields[x].column_name]] !== '') {
                            //     if (options.fields[x].multiple) {
                            //         if (options.fields[x].multiple_in_column) {
                            //             var values = row[headerMap[options.fields[x].column_name]].split(options.fields[x].deliminator);
                            //             bomnode[options.fields[x].type] = values;
                            //         } else {
                            //             bomnode[options.fields[x].type] = row[headerMap[options.fields[x].column_name]];
                            //         }
                            //     } else {
                            //         bomnode[options.fields[x].type] = row[headerMap[options.fields[x].column_name]];
                            //     }
                            // } else {
                            //     if (options.fields[x].multiple) {
                            //         bomnode[options.fields[x].type] = [];
                            //     } else {
                            //         bomnode[options.fields[x].type] = '';
                            //     }
                            // }
                        }
                        break;
                    default:
                        if (options.fields[x].column_name != null && options.fields[x].column_name !== '') {
                            if (row[headerMap[options.fields[x].column_name]] != null && row[headerMap[options.fields[x].column_name]] !== '') {
                                if (options.fields[x].multiple) {
                                    if (options.fields[x].multiple_in_column) {
                                        var values = row[headerMap[options.fields[x].column_name]].split(options.fields[x].deliminator);
                                        bomnode[options.fields[x].type] = values;
                                    } else {
                                        bomnode[options.fields[x].type] = row[headerMap[options.fields[x].column_name]];
                                    }
                                } else {
                                    bomnode[options.fields[x].type] = row[headerMap[options.fields[x].column_name]];
                                }
                            } else {
                                if (options.fields[x].multiple) {
                                    bomnode[options.fields[x].type] = [];
                                } else {
                                    bomnode[options.fields[x].type] = '';
                                }
                            }
                        }
                        
                }
    
                if (options.fields[x].type === "reference_designators" && options.fields[x].hasRanges) {
                    //try to find ranges in
                    var newRefs = [];
                    var y = 0;
                    while (y < bomnode[options.fields[x].type].length) {
                        var refs = BOM.bomParser.findRange(bomnode[options.fields[x].type][y]);
                        if (refs.length > 1) {
                            var args = [y, 1].concat(refs);
                            Array.prototype.splice.apply(bomnode[options.fields[x].type], args);
                            y += refs.length - 2;
                        }
                        y++;
                    }
                }
            }
            bomnode.components = [];
            return bomnode;
        },
        findRange: function (ref) {
            if (ref.includes('-')) {
                var parts = ref.split('-');
                if (parts.length === 2) {
                    var header1, header2, number1, number2
    
                    var index = parts[0].length - 1;
                    for (var x = index; x >= 0; x--) {
                        if (parts[0][x] >= '0' && parts[0][x] <= '9') {
                            index = x;
                        } else {
                            break;
                        }
                    }
                    header1 = parts[0].substring(0, index);
                    number1 = parseInt(parts[0].substring(index, parts[0].length));
    
                    index = parts[1].length - 1;
                    for (var x = index; x >= 0; x--) {
                        if (parts[1][x] >= '0' && parts[1][x] <= '9') {
                            index = x;
                        } else {
                            break;
                        }
                    }
                    header2 = parts[1].substring(0, index);
                    number2 = parseInt(parts[1].substring(index, parts[1].length));
    
                    if (header1 === header2 && number1 < number2) {
                        var refs = [];
                        for (var x = number1; x <= number2; x++) {
                            refs.push(header1 + x.toString());
                        }
                        return refs;
                    }
                }
            }
    
            return [ref];
        },
        outputBOM: function(bomNode, outputOptions){
            //create headers
            return new Promise(function(resolve, reject){
                var header = [];
                outputOptions.fields.forEach(function(field){
        
                    var tempHeaders = BOM.bomParser.getOutputFieldHeaders(field, bomNode);
                    header = header.concat(tempHeaders);
                })
                var temp = BOM.bomParser.getOutputRow(bomNode, bomNode, outputOptions, header);
                var data = {
                    row_objects: [temp.row_objects],
                    data: [temp.data]
                }
                temp = BOM.bomParser.getOutputData(bomNode, outputOptions, header, bomNode);
                data.row_objects = data.row_objects.concat(temp.row_objects);
                data.data = data.data.concat(temp.data);
                data.header = header;
                resolve(data);
            })
        },
        getOutputData: function(bomNode, outputOptions, headers, topBOM){
            var retData = {
                row_objects: [],
                data: []
            }
            for(var x = 0; x < bomNode.components.length; x++){
                var data = BOM.bomParser.getOutputRow(topBOM, bomNode.components[x], outputOptions, headers);
                retData.row_objects.push(data.row_objects)
                retData.data.push(data.data);
    
                if(bomNode.components[x].components.length > 0){
                    var componentData = BOM.bomParser.getOutputData(bomNode.components[x], outputOptions, headers, topBOM);
                    retData.row_objects = retData.row_objects.concat(componentData.row_objects);
                    retData.data = retData.data.concat(componentData.data);
                }
            }
            return retData;
        },
        getOutputRow: function(bomNode, component, outputOptions, headers){
            var object = {};
            var row = [];
            outputOptions.fields.forEach(function(field){
                var fieldName;
                if(field.type === 'object' || field.type === 'extra' || field.type==='keyword_search'){
                    fieldName = field.field_name;
                }else{
                    fieldName = field.type;
                }
                if(field.display){
                    if(field.fields){
                        if(field.multiple){
                            var maxCount = BOM.bomParser.findMaxCount(bomNode, field);
                            var fieldData = [];
                            for(var x = 0; x < field.fields.length; x++){
                                var innerFieldName;
                                if(field.fields[x].type === 'object' || field.fields[x].type === 'extra'){
                                    innerFieldName = field.fields[x].field_name;
                                }else{
                                    innerFieldName = field.fields[x].type;
                                }
                                var data = [];
                                if(field.fields[x].multiple_columns){
                                    var obj = {};
                                    for(var y = 0; y < maxCount; y++){
                                        try{
                                            obj = {field:field.fields[x].field_name + field.fields[x].deliminator + (y+1).toString(),value:component[fieldName][y][innerFieldName]};
                                            //row.push(component[fieldName][y][innerFieldName]);
                                        }catch{
                                            obj = {field:field.fields[x].field_name + field.fields[x].deliminator + (y+1).toString(),value:''};
                                            //row.push('');
                                        }
                                        data.push(obj);
                                    }
                                }else{
                                    var obj = {};
                                    obj = {
                                        field: field.fields[x].field_name,
                                        value: component[fieldName]?component[fieldName].map(x=>x[innerFieldName]).join(field.fields[x].deliminator):''
                                    }
                                    data.push(obj);
                                }
    
                                fieldData.push(data);
                            }
    
                            //combine
                            for(var x = 0; x < maxCount; x++){
                                for(var y = 0; y < fieldData.length; y++){
                                    if(fieldData[y][x]){
                                        object[fieldData[y][x].field] = fieldData[y][x].value;
                                        row.push(fieldData[y][x].value);
                                    }else{
    
                                    }
                                }
                            }
                        }else{
                            for(var x = 0; x < field.fields.length; x++){
                                var innerFieldName;
                                if(field.fields[x].type === 'object' || field.fields[x].type === 'extra'){
                                    innerFieldName = field.fields[x].field_name;
                                }else{
                                    innerFieldName = field.fields[x].type;
                                }
                                if(component[fieldName]){
                                    if(component[fieldName][innerFieldName]){
                                        object[field.fields[x].field_name] = component[fieldName][innerFieldName];
                                        row.push(component[fieldName][innerFieldName]);
                                    }else{
                                        object[field.fields[x].field_name] = '';
                                        row.push('');
                                    }
                                }
                            }
                        }
                    }else{
                        if(field.multiple){
                            if(field){
                                if(field.multiple_columns){
                                    var maxCount = BOM.bomParser.findMaxCount(bomNode, field);
                                    if(component[fieldName]){
                                        for(var x = 1; x <= maxCount; x++){
                                            if(component[fieldName][x]){
                                                object[field.field_name + field.deliminator + x.toString()] = component[fieldName][x];
                                                row.push(component[fieldName][x]);
    
                                            }else{
                                                
                                                object[field.field_name + field.deliminator + x.toString()] = '';
                                                row.push('');
                                            }
                                        }
                                    }else{
                                        object[field.field_name] = '';
                                        row.push('');
                                    }
                                }else{
                                    if(component[fieldName]){
                                        
                                        try{
                                            if(Array.isArray(component[fieldName])){
                                                object[field.field_name] = component[fieldName].join(field.deliminator);
                                            }else{
                                                object[field.field_name] = component[fieldName];
                                            }
                                            
                                        }catch(e){
                                            
                                            console.error(e);
                                        }
                                        
                                    }else{
                                        object[field.field_name] = '';
                                    }
                                    row.push(object[field.field_name]);
                                }
                            }else{
                                if(component[fieldName]){
                                    object[field.field_name] = JSON.stringify(component[fieldName]);
                                    row.push(JSON.stringify(component[fieldName]));
                                }else{
                                    object[field.field_name] = '';
                                    row.push('');
                                }
                                
                            }
                        }else{
                            if(component[fieldName] != null){
                                object[field.field_name] = component[fieldName];
                                row.push(component[fieldName]);
                            }else{
                                object[field.field_name] = '';
                                row.push('');
                            }
                        }
                    }
                }
            })
    
            return {data: row, row_objects: object};
    
        },
        getOutputFieldHeaders: function(field, bomNode, count){
            var headers = [];
            if(field.display){
                if(field.fields && field.fields.length > 0){
                    if(field.multiple){
                        var maxCount = BOM.bomParser.findMaxCount(bomNode, field);
                        var fieldHeaders = [];
                        for(var x = 0; x < field.fields.length; x++){
                            var temp = BOM.bomParser.getOutputFieldHeaders(field.fields[x], bomNode, maxCount)
                            if(temp.length > 0){
                                fieldHeaders.push(temp);
                            }
                        }
                        for(var x = 0; x < fieldHeaders[0].length; x++){
                            for(var y = 0; y < fieldHeaders.length; y++){
                                headers.push(fieldHeaders[y][x]);
                            }
                        }
                    }else{
                        var fieldHeaders = [];
                        for(var x = 0; x < field.fields.length; x++){
                            var temp = BOM.bomParser.getOutputFieldHeaders(field.fields[x], bomNode, 1)
                            if(temp.length > 0){
                                fieldHeaders.push(temp);
                            }
                        }
                        if(fieldHeaders.length > 0){
                            for(var x = 0; x < fieldHeaders[0].length; x++){
                                for(var y = 0; y < fieldHeaders.length; y++){
                                    headers.push(fieldHeaders[y][x]);
                                }
                            }

                        }
                    }
                }else{
                    if(field.multiple){
                        if(field){
                            if(field.multiple_columns){
                                var maxCount = BOM.bomParser.findMaxCount(bomNode, field);
                                if(count){
                                    maxCount = count;
                                }
                                for(var x = 1; x <= maxCount; x++){
                                    headers.push(field.field_name + field.deliminator + x.toString());
                                }
                            }else{
                                headers.push(field.field_name);
                            }
                        }else{
                            headers.push(field.field_name);
                        }
                    }else{
                        headers.push(field.field_name);
                    }
                }
                
            }
            return headers;
        },
        findMaxCount: function(bomNode, field){
            var testFieldName;
            if(field.type === 'extra' || field.type === 'object'){
                testFieldName = field.field_name;
            }else{
                testFieldName = field.type;
            }
            var maxCount = 0;
            for(var x = 0; x < bomNode.components.length; x++){
                if(bomNode.components[x][testFieldName]){
                    var length = bomNode.components[x][testFieldName].length;
                    if(length > maxCount){
                        maxCount = length;
                    }
                }
                var componentMax = BOM.bomParser.findMaxCount(bomNode.components[x], field);
                if(componentMax > maxCount){
                    maxCount = componentMax;
                }
            }
    
            return maxCount;
        }
    }

}

export default BOM;
// module.exports = BOM;