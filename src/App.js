import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import GridComponents from "./Components";
import Modal from "react-modal";
import uuid from "uuidv4";


Modal.setAppElement("#root");

// const frameworkComponents = {
//     athleteRender: athleteRender
// };

const App = () => {

    const [rowData, setRowData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [gridApi, setGridApi] = React.useState(() => { });

    const [validAthlete, setValidAthelte] = useState(true);
    const [validGold, setValidGold] = useState(true);
    const [validSilver, setValidSilver] = useState(true);
    const [validBronze, setValidBronze] = useState(true);
    const [validCountery, setValidCountry] = useState(true);

    const [athlete, setAthlete] = useState('');
    const [gold, setGold] = useState('');
    const [silver, setSilver] = useState('');
    const [bronze, setBronze] = useState('');
    const [country, setCountry] = useState('');

    const [columnDefs] = useState([
        { field: "athlete", sortable: true, filter: true, editable: true, checkboxSelection: true },
        { field: "gold", sortable: true, filter: true, editable: true },
        { field: "silver", sortable: true, filter: true, editable: true },
        { field: "bronze", sortable: true, filter: true, editable: true },
        { field: "country", sortable: true, filter: true, editable: true }
        // {
        //     headerName: "",
        //     colId: "actions",
        //     cellRenderer: "actionsRenderer",
        //     editable: false,
        //     filter: false,
        //     minWidth: 220
        // }
    ]);

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    const onCellValueChanged = ({ data }) => {
        // console.log(data);
        if (data.athlete === '' || data.gold === '' || data.silver === '' || data.bronze === '' || data.country === '') {
            window.confirm(`Please fill all details`);
            dataFetch();
        }
        else {

        }
    }


    const onGridReady = params => {
        setGridApi(params.api);
    };

    const dataFetch = () => {
        fetch(
            "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
        )
            .then(res => res.json())
            .then(data => {
                data.forEach(row => (row.id = uuid()));
                console.log(data.slice(0, 100));
                setRowData(data.slice(0, 100));
            })

    };

    useEffect(() => {
        dataFetch();
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

        if (athlete === '') {
            setValidAthelte(false);
            return window.confirm(`Please fill Athlete name`);
        }
        if (gold === '') {
            setValidGold(false);
            return window.confirm(`Please fill No of Gold medals`);
        }
        if (silver === '') {
            setValidSilver(false);
            return window.confirm(`Please fill No of Silver medals`);
        }
        if (bronze === '') {
            setValidBronze(false);
            return window.confirm(`Please fill No of Bronze medals`);
        }
        if (country === '') {
            setValidCountry(false);
            return window.confirm(`Please fill Country name`);
        }

        setRowData((prev) => ([
            ...prev,
            newRow
        ]))
        toggleModal()
        setAthlete('');
        setGold('');
        setSilver('');
        setBronze('');
        setCountry('');

    }

    const deleteRow = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log("selectedRow", selectedRows);
        setRowData(rowData.filter
            (row => {
                return selectedRows.indexOf(row) == -1
            }))
    }

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: 1250 }}>
            <button onClick={toggleModal}>Open modal</button>
            <button
                color="secondary"
                variant="outlined"
                data-action="delete"
                onClick={() => deleteRow()}>Delete</button>
            <AgGridReact
                rowData={rowData}
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                rowSelection={'multiple'}
                getRowNodeId={data => data.id}
                onCellValueChanged={onCellValueChanged}>
            </AgGridReact>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog"
            >
                <div>
                    <form>
                        <label for="athlete">Athlete:</label>
                        <input onChange={(e) => setAthlete(e.target.value)} type="text" id="athlete" name="athlete"></input>
                        <label for="gold">Gold:</label>
                        <input onChange={(e) => setGold(e.target.value)} type="text" id="gold" name="gold"></input>
                        <label for="silver">Silver:</label>
                        <input onChange={(e) => setSilver(e.target.value)} type="text" id="silver" name="silver"></input>
                        <label for="bronze">Bronze:</label>
                        <input onChange={(e) => setBronze(e.target.value)} type="text" id="bronze" name="bronze"></input>
                        <label for="country">Country:</label>
                        <input onChange={(e) => setCountry(e.target.value)} type="text" id="country" name="country"></input>

                    </form>
                    <button onClick={addNewRow} >save</button>
                    <button onClick={toggleModal}>Close</button>
                </div>
            </Modal>
        </div>
    )
};

export default App;