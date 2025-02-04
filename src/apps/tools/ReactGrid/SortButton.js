import React, { Component } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 
 
class SortButton extends Component {
    constructor(props){
        super(props)
        this.state = {
            width:props.width?props.width:180,
            mouseDown:false,
            mouseX:null,
            mouseY:null,
            columnKey:props.columnKey,
            sortOrder:props.sortOrder
        }
        console.log("SETUP");
    }
    componentDidUpdate(props){
        if(props.sortOrder!== this.props.sortOrder){
            this.setState({
                sortOrder:this.props.sortOrder
            })
        }
    }
 
    // Code is invoked after the component is mounted/inserted into the DOM tree.
    componentDidMount() {
        //this.pullBOM();
    }
 
    render() {
        return(
            <div className={'sort-button ' + (this.state.sortOrder?this.state.sortOrder:'')} 
                onClick={this.onClick} 
            >
                {
                this.state.sortOrder?
                    this.state.sortOrder==='ascending'?
                    <i class="fas fa-sort-up fa-fw mr-2"/>
                    // <FontAwesomeIcon icon="sort-up" className="fa-fw fas mr-2"/>
                    :
                    <i class="fas fa-sort-down fa-fw mr-2"/>
                    // <FontAwesomeIcon icon="sort-down" className="fa-fw fas mr-2"/>
                    :
                    <i class="fas fa-sort fa-fw mr-2"/>
                    // <FontAwesomeIcon icon="sort" className="fa-fw fas mr-2"/>
                }
            </div>
        )
    }
    onClick = (e)=>{
        let returnOrder = ''
        switch(this.state.sortOrder){
            case 'ascending': 
            returnOrder='descending';
                break;
            case 'descending':
                returnOrder=null;
                break;
            default:
                returnOrder = 'ascending';
                break;
        }

        if(this.props.onClick){
            if(returnOrder){
                this.props.onClick({
                    columnKey:this.props.columnKey,
                    order:returnOrder
                });
                
            }else{
                this.props.onClick(null);

            }
        }

    }
    handleMouseDown = (e)=>{
        this.setState({
            mouseDown:true,
            mouseX:e.clientX,
            mouseY:e.clientY
        })
 
 
        document.addEventListener ('mouseup',   this.handleMouseUp,   {capture:true});
        document.addEventListener ('mousemove', this.handleMouseMove, {capture:true});
    }
    handleMouseUp = (e)=>{
        this.setState({
            mouseDown:false
        })
 
        document.removeEventListener ('mouseup',   this.handleMouseUp,   {capture:true});
        document.removeEventListener ('mousemove', this.handleMouseMove, {capture:true});
        e.stopPropagation ();
    }
    handleMouseMove = (e)=>{
        if(this.state.mouseDown){
            this.setState({
                width:this.state.width+(e.clientX - this.state.mouseX),
                mouseX:e.clientX,
                mouseY:e.clientY
 
            },
            ()=>{
                if(this.props.onWidthChanged){
                    this.props.onWidthChanged(this.state.width);
                }
            }
            )
            e.preventDefault();
            e.stopPropagation();
        }
    }
    handleMouseLeave = (e)=>{
        if(this.state.mouseDown){
            e.preventDefault();
            e.stopPropagation();
        }
    }
    handleMouseOut = (e)=>{
        
        if(this.state.mouseDown){
            e.preventDefault();
            e.stopPropagation();
        }
    }
 
}
 
 
 
export default SortButton;
 

