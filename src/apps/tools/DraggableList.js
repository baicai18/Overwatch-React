import React from 'react';


class DraggableList extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            keyName:props.keyName,
            dragging:false,
            list:props.list,
            mapFunction:props.mapFunction,
        }
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        //alert(JSON.stringify(this.state.list));
    }

    componentDidUpdate(props){
        if(props.list !== this.props.list || props.mapFunction !== this.props.mapFunction || props.keyName !== this.props.keyName){
            this.setState({
                list:this.props.list,
                mapFunction:this.props.mapFunction,
                keyName:this.props.keyName
            })

        }
        // this.state.list = this.props.list;
        // this.state.mapFunction = this.props.mapFunction;
        // this.state.keyName = this.props.keyName;
        // this.setState({
        //     list:this.props.list,
        //     mapFunction:this.props.mapFunction,
        //     keyName:this.props.keyName
        // })
        // this.setState({
        //     list:this.props.list,
        //     mapFunction:this.props.mapFunction
        // })
    }

    render() {
        return (
            <div key={this.state.list}>
                {
                    (this.state.list && Array.isArray(this.state.list))?
                    this.state.list.map((x,index)=>{
                        return <div className="drag-parent" key={index + x}
                                // draggable={true} 
                                // onDragEnd={(evt)=>this.onDragEnd(evt, index, this.state.keyName)} 
                                // onDragStart={(evt)=>this.onDragStart(evt, index, this.state.keyName)} 
                                // onDragOver={(evt)=>this.onDragOver(evt, index, this.state.keyName)} 
                                // onDrop={(evt)=>this.onDrop(evt, index, this.state.keyName)} 

                                style={this.state.dragOverIndex===index?
                                    this.state.dragIndex > index?
                                    {
                                        borderTop:"1px solid red"
                                    }
                                    :
                                    {
                                        borderBottom:"1px solid red"
                                    }
                                :{}}
                                >
                                <div className="drag-part"
                                    draggable={true} 
                                    onDragEnd={(evt)=>this.onDragEnd(evt, index, this.state.keyName)} 
                                    onDragStart={(evt)=>this.onDragStart(evt, index, this.state.keyName)} 
                                    onDragOver={(evt)=>this.onDragOver(evt, index, this.state.keyName)} 
                                    onDrop={(evt)=>this.onDrop(evt, index, this.state.keyName)} 
                                >
                                    <svg width="100%" height="100%">
                                        <defs>
                                            <pattern id="polka-dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                                                
                                                <circle fill="#fff" cx="2" cy="2" r="1">
                                                </circle>
                                                
                                            </pattern>
                                        </defs>
                                        
                                        <rect x="0" y="0" width="100%" height="100%" fill="url(#polka-dots)"></rect>
                                    </svg>
                                </div>
                                    {this.state.mapFunction(x,index, this.state.keyName)}
                                </div>
                    })
                    :''
                }
            </div>
        )
    }

    onDragStart(event, index, key){
        this.setState({
            dragIndex:index,
            dragging: true
        })
        event.dataTransfer.setData("index", index);
        event.dataTransfer.setData("keyName", key);
        event.stopPropagation();
    }

    onDragOver(event, index, key){
        if(this.state.dragIndex !== index.toString() && this.state.dragging){
            //allow
            if(this.state.dragOverIndex !== index){
                this.setState({
                    dragOverIndex:index
                })

            }
            event.preventDefault();
        }else{
            if(this.state.dragOverIndex != null){
                this.setState({
                    dragOverIndex:null
                })
            }
        }
    }
    onDragEnd(event, index, key){
        
        this.setState({
            dragIndex:null,
            dragOverIndex:null,
            dragging:false
        })
    }
    onDrop(event, index, key){
        var list = this.state.list;
        var from = event.dataTransfer.getData("index");
        var to = index
        var keyName = event.dataTransfer.getData("keyName");
        if(keyName === this.state.keyName){
            list.splice(to,0,list.splice(from,1)[0]);
            this.setState({
                list:list,
                dragIndex:null,
                dragOverIndex:null,
                dragging:false
            },()=>{
                if(this.props.onListChanged){
                    this.props.onListChanged(list);
                }
                this.forceUpdate();
            })
    
            event.stopPropagation();
        }

        
    }

}

export default DraggableList;