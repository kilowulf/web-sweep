"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbList
} from "./ui/breadcrumb";
import { MobileSidebar } from "./Sidebar";

/**
 * BreadcrumbHeader Component.
 *
 * Renders a breadcrumb navigation header based on the current pathname.
 * It splits the current path into segments and generates breadcrumb items for each segment.
 * Additionally, it renders a MobileSidebar for navigation on smaller screens.
 *
 * @returns {JSX.Element} The rendered breadcrumb header.
 */
export default function BreadcrumbHeader() {
  // Retrieve the current pathname from Next.js navigation hook.
  const pathName = usePathname();
  // Split the path into segments; if the path is "/", use an array with an empty string.
  const paths = pathName === "/" ? [""] : pathName?.split("/");

  return (
    <div className="flex items-center flex-start">
      {/* Mobile sidebar for navigation on mobile devices */}
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {/* Render "Home" if path segment is empty, otherwise capitalize the segment */}
                <BreadcrumbLink className="capitalize" href={`/${path}`}>
                  {path === "" ? "Home" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {/* Add a separator between breadcrumb items, except after the last item */}
              {index !== paths.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
