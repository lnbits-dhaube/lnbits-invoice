import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-green-100", className)}
      role="status"
    />
  );
};

export default Skeleton;
