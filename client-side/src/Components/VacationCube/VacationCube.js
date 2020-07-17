import React from 'react';

// TODO1: import Moment from 'react-moment';

// TODO2: implement Moment by packages: moment, react moment with WORKING dependencies  (!!)
// including: react-scripts, react-dev-utils, ..
// WorkAround: show date by text cut using .. 


const IMG = (imageName) => {
    return require(`../../upload/${imageName}`);
}

class VacationCube extends React.Component {
        
    followVacation(vac_id, is_followed) { // for vacations_user        
        if (is_followed) {
            this.props.removeFollowed(vac_id);
        }
        else {
            this.props.addFollowed(vac_id);
        }
    }
    
    editVacation(vac_id) { // for admin vacation                                        
        this.props.editVacation(vac_id);                
    }
    
    delVacation(vac_id) { // for admin vacation                        
        this.props.deleteVacation(vac_id);
    }
    
    
    render() {               
        
        let DateStart = new Date(this.props.vcube.date_start);       
        let MonStart = DateStart.getMonth();
        MonStart = parseInt(MonStart) + 1;        
        let DateStartStr = DateStart.getDate() + "/" + MonStart + "/" + DateStart.getFullYear();

        let DateEnd = new Date(this.props.vcube.date_end);               
        let MonEnd = DateEnd.getMonth();
        MonEnd = parseInt(MonEnd) + 1;        
        let DateEndStr = DateEnd.getDate() + "/" + MonEnd + "/" + DateEnd.getFullYear();
        
        var follow_num = (this.props.vcube.follow_num == null) ? 0 : this.props.vcube.follow_num;

        //// For future use : ..
        // var src_path = picSource + this.props.vcube.pic;
        // console.log(src_path);
        // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // var options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'};
    
        // const date_orig = props.vcube.date_start.toNumber();
        // const date_formatted = Intl.DateTimeFormat('en-US',{
        //     year: 'numeric',
        //     month: 'short',
        //     day: '2-digit' }).format(date_orig);
    
        // &nbsp; = non-breaking space     

        return (
        <div className="vacation_div">            

            {/* fa- fas- fab- facebook-f tag bookmark star thumb-up  fa-xs fa-sm fa-lg fa-7x */}                        
            <div className={(this.props.is_admin) ? "d-none text-right" : "text-right"}>
                <div className=""><i onClick={this.followVacation.bind(this, this.props.vcube.vac_id, this.props.is_followed)} className={(this.props.is_followed) ? "fas fa-star" : "far fa-star"}></i></div> 
            </div>

            <div className={(!this.props.is_admin) ? "d-none text-right" : "text-right"}>
                <div className=""><i onClick={this.delVacation.bind(this,this.props.vcube.vac_id)} className="far fa-times-circle"></i></div> 
                <div className=""><i onClick={this.editVacation.bind(this,this.props.vcube.vac_id)} className="fas fa-pen"></i></div> 
            </div>

            {/* badge badge-light */}
            <div className="text-left text-success">To: <span className="text-dark">{this.props.vcube.dest}</span></div>
            <div className="text-left text-success">Description: <span className="text-dark">{this.props.vcube.vac_desc}</span></div>
            <div className="text-left text-success">Price: <span className="text-dark">{this.props.vcube.price} &#8362;</span></div>
            
            <div className='vacation_row row'>
                <div className='vacation_col col-md-12'>                    
                    <img  className='border border-primary rounded ' width='100%' height='100%'  src={IMG(this.props.vcube.pic)} alt="Vacation Pic" />
                </div>
            </div>
            
            
            {/* TODO1: use Moment Here */}
            {/* <div className="text-center">{new Intl.DateTimeFormat('en-US',options).format(props.vcube.date_start)}   */}
            {/* <div className="text-center"> <Moment parse="YYYY-MM-DD HH:mm">{props.vcube.date_start}</Moment>   */}

            {/* WorkAround: show date by text cut using indexOf & slice  */}
            {/* <div className="text-left">{props.vcube.date_start } - {props.vcube.date_end}</div> */}

            {/* {props.vcube.date_start.toString() } */}
            {/* {props.vcube.date_start.toUTCString() } */}
            {/* {props.vcube.date_start.parse("01 Jan 1970") } */} 

            <div className="row">               
                <div className="col-md-10 col-lg-10 col-xl-10 col-sm-10 col-xs-10">                        
                    <div className="text-left  text-success">Vacation Dates:</div>
                    <div  className="text-left text-info">{DateStartStr} - {DateEndStr}</div>            
                </div>

                {/* badge badge-pill badge-dark badge-info badge-primary badge-secondary  */}
                <div className="col-md-2 col-lg-2 col-xl-2 col-sm-2 col-xs-2">
                    <div className={(this.props.is_admin) ? "d-none text-right" : "text-right badge badge-dark"}>{follow_num}</div>
                </div>
            </div>
                                                
        </div>
        );
    }

}

export default VacationCube;
