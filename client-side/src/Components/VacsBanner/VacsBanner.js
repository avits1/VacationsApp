import React from 'react';

// Right Side Vacations Banner
function VacsBanner(props) {
    if (!props.show_banner) {
        return null;
    }

    return (        
        <div className="row p-1"> 
            <br></br>            
            <h4>1. Select Vacations</h4>
            <h4>2. Tag &amp; Follow</h4>
            <h4>3. Stay Updated</h4>           
        </div>
    );
}

export default VacsBanner;