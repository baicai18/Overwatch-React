import React from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function MessageList(props){
    const listItems = props.messages.map((notification)=>{

        //var unreadCount = 0;
        var className = '';
        if(notification.seen){
            className = 'class="font-weight-bold"';
        }
        
        return (
            <a className="dropdown-item d-flex align-items-center" href={notification.link} data-type="notification" data-id={notification["_id"]}>
                <div>
                    <div className="small text-gray-500">{notification.timestamp}</div>
                    <span className={className}>{notification.message}</span>
                </div>
            </a>

        )
    });
    return (<div>{listItems}</div>);
}

class Messages extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user:props.user,
            siteTitle:props.siteTitle,
        }
        this.doSomething = this.doSomething.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.hide = this.hide.bind(this);
    }
    render() {
        return (
            <li className="nav-item dropdown no-arrow mx-1" aria-labelledby="userDropdown" >
                <div className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" tabIndex="1"  onClick={this.toggleShow} onBlur={this.hide}>
                    <i class="fas fa-envelope"/>
                    {/* <FontAwesomeIcon icon="envelope"/> */}
                    <span className="badge badge-danger badge-counter" style={{display:'none'}} id="message_count"></span>
                </div>
                
                
                <div className={ "dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in " + (this.state.show ? 'show' : '')}>
                    <h6 className="dropdown-header">
                        Message Center
                    </h6>
                    <div id="notifications">
                        <MessageList messages={(this.state.user.messages) ? this.state.user.messages : []}/>
                    </div>
                    <a className="dropdown-item text-center small text-gray-500" href="/">Read More Messages</a>
                </div>
            </li>
        );
    }
    doSomething(e){
        e.preventDefault();
        console.log(e.target.innerHTML);
    }
    
    toggleShow(){
        this.setState({show: !this.state.show});
    }
    
    hide(e){
        if(e && e.relatedTarget){
            e.relatedTarget.click();
        }
        this.setState({show: false});
    }
}

export default Messages;