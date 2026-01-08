"use client";

import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useState } from "react";
import { getProjectsByTech } from "@/queries/project";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// TODO: Add a loading scheleton

export default function BadgeDrawer({
  tech,
  fromCard = false,
}: {
  tech: any;
  fromCard?: boolean;
}) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    setLoading(true);

    try {
      const data = await getProjectsByTech(tech._id);
      setProjects(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Badge
          variant="secondary"
          className={`cursor-pointer hover:bg-secondary/80 transition-colors flex items-center 
            ${
              fromCard ? "px-1.5 py-0.5 text-[10px] gap-1" : "gap-1.5 px-3 py-1"
            }`}
          onClick={loadProjects}
        >
          {tech.icon && (
            <Image
              src={tech.icon}
              alt={tech.name}
              width={12}
              height={12}
              className={fromCard ? "w-3 h-3" : "w-4 h-4"}
            />
          )}
          {tech.name}
        </Badge>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl p-6">
          <DrawerHeader>
            <DrawerTitle className="text-2xl flex items-center gap-2">
              {tech.icon && (
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              )}
              Projects using {tech.name}
            </DrawerTitle>

            <DrawerDescription>
              Total {projects.length} projects in my directory built with this
              technology.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 h-[50vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                Loading...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <div key={p._id} className="h-64">
                    {/* Simplified Card for Drawer */}
                    <div className="border rounded-lg p-4 h-full flex flex-col bg-card">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <div className="text-xs text-muted-foreground mt-1 mb-4">
                        {new Date(p.devPhase?.startDate).getFullYear()}
                      </div>
                      <DrawerClose asChild>
                        <Link
                          href={`/projects/${p.slug}`}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "mt-auto",
                          )}
                        >
                          View Project
                        </Link>
                      </DrawerClose>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && projects.length === 0 && (
              <div className="text-center text-muted-foreground">
                No projects found for this tech.
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
