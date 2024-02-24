import React from 'react';

type ErrorBoundaryProps = { children?: React.ReactNode };
type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center gap-[1rem] font-Inter sm:p-[1rem]">
          <div className="flex flex-col items-center gap-[1rem] md:flex-row md:items-stretch">
            <div className="flex w-full flex-col gap-[1rem] px-[.5rem]">
              <h2 className="text-[1.5rem] font-extrabold tracking-wider text-r-blue lg:text-[2rem] xl:text-[4rem]">
                Oooops...
              </h2>
              <div className="flex w-full flex-col gap-[1rem] text-[.9rem] font-medium tracking-wide text-black dark:text-white md:max-w-[30rem] lg:text-[1rem] xl:max-w-[40rem]">
                <p className="">
                  Try refreshing the page. If the problem is not solved, please create a ticket in the support channel
                  on the{' '}
                  <a href={import.meta.env.VITE_SERVER_INVITE_EN} target="_ blank" className="links_style">
                    discord server of the project
                  </a>
                  .
                  <br />
                  <br />
                </p>
                <p>P.S. A screenshot of your browser&apos;s console would really help us.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
