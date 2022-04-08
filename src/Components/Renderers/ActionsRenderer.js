import React, { useState, useEffect } from 'react';


export default (props) => {
  
    function deleteRow(force = false) {
        let data = props.data;
        let confirm = true;
        if (!force) {
            confirm = window.confirm(`Are you sure you want to delete this row: ${JSON.stringify(data)})`)
        }
        if (confirm) {
            props.api.updateRowData({ remove: [data] });
            props.api.refreshCells({ force: true });
        }
    };

    return (
        <div>
            <button
                color="secondary"
                variant="outlined"
                onClick={() => deleteRow()}>Delete</button>
        </div>
    )
}
