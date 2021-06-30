import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import notify from '../notify';
import Header from '../Header/Header'

const Table = ({ setList }) => {
    const [headers, setHeaders] = useState({});
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost/api/list.php")
            .then(res => res.json())
            .then(result => {
                setHeaders(result.data.headers[0]);
                setList(result.data.rows);
                const r = result.data.rows.map(d => {
                    return { ...d, update: <Link to={`/update-form/${d.id}`} className="update-button" >Update</Link> };
                })
                setRows(r);
                setIsLoading(false);
                result.messages.forEach(msg => {
                    notify(result.status === "false" ? "error" : "success", msg);
                })
            });
    }, [setList]);

    return (
        <div className="container">
            <Header></Header>
            <div>
                <DataTable value={rows} loading={isLoading}>
                    {
                        Object.keys(headers).map(key => {
                            const { hidden, searchable, sortable, title } = headers[key];
                            return (hidden ? null : <Column key={key} filter={searchable} sortable={sortable} field={key} header={title} />)
                        })
                    }
                    <Column filter={false} sortable={false} field="update" header="Update" />
                </DataTable>
            </div>
        </div>
    );
}

export default Table;