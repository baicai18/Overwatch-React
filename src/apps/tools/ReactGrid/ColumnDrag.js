import React, { Component } from 'react';
 
 
class ColumnDrag extends Component {
    constructor(props){
        super(props)
        this.state = {
            width:props.width?props.width:180,
            mouseDown:false,
            mouseX:null,
            mouseY:null,
        }
        console.log("SETUP");
    }
 
 
    // Code is invoked after the component is mounted/inserted into the DOM tree.
    componentDidMount() {
        //this.pullBOM();
    }
 
    render() {
        return(
            <div className="column-drag" 
                onMouseDown={this.handleMouseDown} 
                onMouseUp={this.handleMouseUp} 
                onMouseMove={this.handleMouseMove} 
                onMouseLeave={this.handleMouseLeave}
                onMouseOut={this.handleMouseOut}
                ></div>
        )
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
 
 
 
export default ColumnDrag;
 

