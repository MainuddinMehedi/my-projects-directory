import ThemeSwitcher from "./ThemeSwitcher";

export default function FloatingButtons() {
  return (
    <div className="absolute bottom-5 right-5 space-y-5">
      <ThemeSwitcher />
    </div>
  );
}
