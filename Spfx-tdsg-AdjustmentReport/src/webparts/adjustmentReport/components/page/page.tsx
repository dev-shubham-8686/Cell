import * as React from "react";
import Header from "../common/header";

interface IPage {
  title: string;
  children: React.ReactNode;
}

const Page: React.FC<IPage> = ({ title, children }) => (
  <>
    <Header title={title} />
    <main className="main d-flex h-100 flex-grow-1">
      {children}
    </main>
  </>
);

export default Page;
