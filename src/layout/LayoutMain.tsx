import { Outlet } from 'react-router-dom';

export const LayoutMain = () => {
  return (
    <>
      <Outlet />
      {/* <div className="relative flex min-h-screen flex-col">
            <div className="container">
               <NavBar className="mb-[2rem] mt-[0.6rem]" />
               <Outlet />
            </div>
            <FooterComponent />
         </div> */}
    </>
  );
};
