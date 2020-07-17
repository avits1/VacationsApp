import React from 'react';

function VacsMsgs(props) {
    if (!props.show_msg || props.message === undefined || props.message === "") {
        return null;
    }

    return (
        <div className={props.success ? "warning alert alert-success my-2" : " warning alert alert-danger my-2"}>
            {props.message}
        </div>
    );
}

export default VacsMsgs;