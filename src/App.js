import React, { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import GridComponents from "./Components";
import Modal from "react-modal";
import uuid from "uuidv4";

Modal.setAppElement("#root");

const frameworkComponents = {
    actionsRenderer: GridComponents.ActionsRenderer
};

const App = () => {

    const [rowData, setRowData] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    const customStyle={
        content:{
            width:'50%',
            height:260,
            margin:'auto'
        }
    }

    const [athlete, setAthlete] = useState('');
    const [gold, setGold] = useState('');
    const [silver, setSilver] = useState('');
    const [bronze, setBronze] = useState('');
    const [country, setCountry] = useState('');

    const [columnDefs] = useState([
        { field: "athlete", sortable: true, filter: true, editable: true },
        { field: "gold", sortable: true, filter: true, editable: true },
        { field: "silver", sortable: true, filter: true, editable: true },
        { field: "bronze", sortable: true, filter: true, editable: true },
        { field: "country", sortable: true, filter: true, editable: true },
        {
            headerName: "",
            colId: "actions",
            cellRenderer: "actionsRenderer",
            editable: false,
            filter: false,
            minWidth: 220
        }]);

    const onGridReady = (params) => {
        fetch(
            "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
        )
            .then(res => res.json())
            .then(data => {
                data.forEach(row => (row.id = uuid()));
                console.log(data.slice(0, 100));
                setRowData(data.slice(0, 100));
            });
    };
    
    useEffect(() => {
        onGridReady();
    }, []);

    const addNewRow = () => {
        const newRow = {
            athlete: athlete,
            gold: gold,
            silver: silver,
            bronze: bronze,
            country: country,
            id: uuid()
        }

        setRowData((prev) => ([
            ...prev,
            newRow
        ]))
        toggleModal()
    }

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: 1250 }}>
            <button onClick={toggleModal} style={{marginLeft:'600px'}}>Add Row</button>
            <AgGridReact
                rowData={rowData}
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                frameworkComponents={frameworkComponents}
                getRowNodeId={data => data.id}>
            </AgGridReact>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog"
                style={customStyle}
            >
                <div>
                    <form style={{ width: '50px' }}>
                        <label for="athlete">Athlete:</label>
                        <input onChange={(e) => setAthlete(e.target.value)} type="text" id="athlete" name="athlete"></input>
                        <label for="gold">Gold:</label>
                        <input onChange={(e)=> setGold(e.target.value)} type="text" id="gold" name="gold"></input>
                        <label for="silver">Silver:</label>
                        <input onChange={(e)=> setSilver(e.target.value)} type="text" id="silver" name="silver"></input>
                        <label for="bronze">Bronze:</label>
                        <input onChange={(e)=> setBronze(e.target.value)} type="text" id="bronze" name="bronze"></input>
                        <label for="country">Country:</label>
                        <input onChange={(e)=> setCountry(e.target.value)}type="text" id="country" name="country"></input>

                    </form>
                    <button onClick={addNewRow} >save</button>
                    <button onClick={toggleModal}>Close</button>
                </div>
            </Modal>
        </div>
    )
};

export default App;