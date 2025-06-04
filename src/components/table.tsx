interface Props {
    rows: string[];
    children: React.ReactNode;
}

function Table({ rows, children }: Props) {
    return (<div className="overflow-x-auto min-h-72 pb-24">
        <table className="table">
            <thead>
                <tr>
                    {rows.map((item, id) =>
                        <th key={id}>{item}</th>
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