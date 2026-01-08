import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export default function BadgeDrawer({
  tech,
  fromCard = false,
}: {
  tech: any;
  fromCard?: boolean;
}) {
  return (
    <Drawer>
      <DrawerTrigger>
        <Badge
          variant="secondary"
          className={`cursor-pointer hover:bg-secondary/80 transition-colors flex items-center 
            ${
              fromCard ? "px-1.5 py-0.5 text-[10px] gap-1" : "gap-1.5 px-3 py-1"
            }`}
          //   onClick={loadProjects}
        >
          {tech.icon && (
            <img
              src={tech.icon}
              alt={tech.name}
              className={fromCard ? "w-3 h-3" : "w-4 h-4"}
            />
          )}
          {tech.name}
        </Badge>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Projects using {tech.name}</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
