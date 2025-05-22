function Table({ rows = [''], children }) {
    return (<div className="overflow-x-auto min-h-72">
        <table className="table">
            <thead>
                <tr>
                    {rows.map(item =>
                        <th key={item}>{item}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>);
}

export default Table;