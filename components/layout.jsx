import { cn } from "@/lib/utils";

const Layout = ({ className, children, top }) => {
  return (
    <div
      className={cn(
        "relative h-screen w-screen overflow-hidden px-6",
        className,
        top && "pt-16",
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
