import { signOut } from '@firebase/auth';
import { ArrowLeftRight, Blinds, LayoutDashboard, LogOut, UsersRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { auth } from '../../lib/firebase';

function Dashboard() {
    return (<>
        <div className="flex">
            <div className="flex fixed h-screen w-fit bg-base-100 z-1 justify-between flex-col items-center p-4 py-12 text-white">
                <div></div>
                <div className='gap-12 flex-col flex '>
                    {[['/dashboard', <LayoutDashboard />],
                    ['/dashboard/transaksi', <ArrowLeftRight />],
                    ['/dashboard/unit', <Blinds />, true],
                    ['/dashboard/users', <UsersRound />, true]].map((item, id) =>
                        <NavLink key={id} end={!item[2]} to={item[0]}>
                            {({ isActive }) => <div className={!isActive ? 'text-gray-600' : ''}>
                                {item[1]}
                            </div>
                            }
                        </NavLink>
                    )}

                </div>

                <button className="hover:opacity-100 opacity-60 " onClick={() => { signOut(auth) }}>
                    <LogOut />
                </button>

            </div>
            <div className="ml-20 container m-4">
                <Outlet />
            </div>
        </div>

    </>);
}

export default Dashboard;