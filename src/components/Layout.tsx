import Image from "next/image";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="w-full h-screen px-8 pt-8 font-test">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start container mx-auto relative h-full">
                <Header />
                <div className="flex-1 flex items-start gap-8 justify-center w-full mt-20">
                    <div className="hidden lg:block">
                        <Sidebar />
                    </div>
                    {children}
                </div>
                <div className="absolute top-1/4 left-0 right-0 bottom-0 z-[-1]">
                    <Image
                        className="w-full h-full object-contain"
                        src="/images/bg_rome.svg"
                        alt="Background"
                        fill={true}
                    />
                </div>
            </main>
        </div>
    );
}
