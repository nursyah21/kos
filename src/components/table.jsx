function Table({ rows = [''], children }) {
    return (<div className="overflow-x-auto min-h-72 pb-24">
        <table className="table">
            <thead>
                <tr>
                    {rows.map(item =>
                        <th key={item}>{item}</th>
                    )}
                </tr>
            </thead>
            <tbody className="">
                {children}
            </tbody>
        </table>
    </div>);
}

export default Table;