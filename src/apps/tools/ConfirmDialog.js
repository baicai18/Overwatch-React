import React, {Component} from 'react';
import {Button, Modal} from 'react-bootstrap';


class ConfirmDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            show:false,
            title:'',
            body:'',
            onConfirm:null,
            onCancel:null,
            onClose:null,
            cancelText:'Cancel',
            confirmText:'Confirm',
            hideConfirm:false,
            hideCancel:false
        }
    }

    showDialog = async(title, body, onConfirm, onCancel, onClose, cancelText, confirmText, hideConfirm, hideCancel)=>{
        this.setState({
            show:true,
            title:title,
            body:body,
            onConfirm:onConfirm,
            onCancel:onCancel,
            onClose:onClose,
            cancelText:cancelText||'Cancel',
            confirmText:confirmText||'Confirm',
            hideConfirm:hideConfirm?hideConfirm:false,
            hideCancel:hideCancel?hideCancel:false
        })
    }

    handleClose = async()=>{
        if(this.state.onClose){
            this.state.onClose();
        }
        this.setState({
            show:false
        })
    }
    handleConfirm = async()=>{
        if(this.state.onConfirm){
            this.state.onConfirm();
        }
        this.setState({
            show:false
        })
    }
    handleCancel = async()=>{
        if(this.state.onCancel){
            this.state.onCancel();
        }
        this.setState({
            show:false
        })
    }

    

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.body}</Modal.Body>
                <Modal.Footer>
                {
                    this.state.hideCancel?
                    '':
                    <Button variant="secondary" onClick={this.handleCancel}>
                        {this.state.cancelText || 'Cancel'}
                    </Button>
                }
                {
                    this.state.hideConfirm?
                    '':
                   <Button variant="primary" onClick={this.handleConfirm}>
                        {this.state.confirmText || 'Confirm'}
                    </Button>
                }
                </Modal.Footer>
            </Modal>
        )
    }
}



export default ConfirmDialog;
