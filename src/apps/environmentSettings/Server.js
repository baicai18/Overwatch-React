import React from 'react';
import {Redirect} from 'react-router-dom';
import SDK from '../../sdk/SDK';
import Dialog from 'react-bootstrap-dialog'

class Server extends React.Component{

    constructor(props){
        super(props);
        this.state = {
        }
    }

    render = ()=>{
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }else{
            return (
                <div className="container-fluid">
                    <h1 className="h3 mb-2 text-gray-800">Server Settings</h1>
                    <p className="mb-4">Manage Server Options</p>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Reset Server</h6>
                        </div>
                        <div className="card-body">
                            <p>Warning! Resetting server will delete all data and restore the system to it's initial stage</p>
                            <button className="btn btn-danger" id="resetServer" onClick={this.resetClicked}>Reset Server</button>
                        </div>
                    </div>
                    <Dialog ref={(el) => { this.dialog = el }} />
                </div>
            );
        }
    }
    
    resetClicked = ()=>{
        this.dialog.show({
            title: 'Warning! Confirm Reset?',
            body: 'Resetting server will delete all data and restore to initial settings. Are you sure you want to continue? This cannot be undone.',
            actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(()=>{
                  //reset the server
                  SDK.InitialSetup.resetServer()
                  .then(data=>{
                    // window.location.href = '/InitialSetup'
                    this.setState({
                        redirect:"/InitialSetup"
                    })
                  })
                  .catch(err=>{
                      console.log(err);
                      alert("Error resetting server");
                  })
              })
            ],
            bsSize: 'small',
            onHide: (dialog) => {
              dialog.hide()
              console.log('closed by clicking background.')
            }
          })
        // this.dialog.showAlert({
        //     title:'Warning! Confirm Reset?',
        //     body:'Resetting server will delete all data and restore to initial settings. Are you sure you want to continue? This cannot be undone.',
        //     actions: [
        //         Dialog.CancelAction(),
        //         Dialog.OKAction()
        //     ],
        //     bsSize: 'small',
        //     onHide: (dialog) => {
        //         dialog.hide()
        //         console.log('closed by clicking background.')
        //     }

        // });
    }
    

}

export default  Server;