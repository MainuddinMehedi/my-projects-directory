import ThemeSwitcher from "./ThemeSwitcher";
import CreateProjectButton from "./CreateProjectButton";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-center gap-4">
      <CreateProjectButton />
      <ThemeSwitcher />
    </div>
  );
}
