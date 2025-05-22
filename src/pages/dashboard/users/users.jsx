import { NavLink, Outlet } from 'react-router';

function Users() {

    return (<>
        <div className="p-4 container">
            <div className='flex justify-between sticky top-0 py-2 bg-base-100 z-10'>
                <div className='flex gap-4'>
                    {
                        [['/dashboard/users/penghuni', 'Penghuni'],
                        ['/dashboard/users/petugas', 'Petugas']].map((item, id) =>
                            <NavLink key={id} to={item[0]} className={({ isActive }) => isActive ? '' : 'opacity-60'}>
                                <h2 className="text-2xl font-semibold">{item[1]}</h2>
                            </NavLink>
                        )
                    }
                </div>
            </div>
            <Outlet />
        </div>
    </>);
}

export default Users;