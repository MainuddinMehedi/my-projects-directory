import LatestProjects from "@/components/projects/LatestProjects";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-[56px] sm:text-[76px] font-extrabold text-center my-16 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight leading-tight">
        Mainuddin&apos;s Projects Directory
      </h1>

      <div className="space-y-10">
        <div className="sm:max-w-200 mx-auto">
          <Input
            type="text"
            placeholder="Search projects..."
            className="w-full py-5"
          />
        </div>

        <div>
          <LatestProjects />
        </div>
      </div>
    </div>
  );
}
