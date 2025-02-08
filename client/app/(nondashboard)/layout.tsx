import NondashboardNavbar from "@/components/NondashboardNavbar";

import Footer from "@/components/Footer";
import React from "react";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="nondashboard-layout">
      <NondashboardNavbar />
      <main className="nondashboard-layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
