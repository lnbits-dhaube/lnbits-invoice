import { cn } from "@/lib/utils";
import Spinner from "./spinner";

interface LoadingProps {
  className?: string;
  containerClassName?: string;
  spinnerClassName?: string;
  text?: string;
  textClassName?: string;
  showText?: boolean;
}

const Loading = ({
  className,
  containerClassName,
  spinnerClassName,
  text = "Loading...",
  textClassName,
  showText = true,
}: LoadingProps) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center h-32",
        containerClassName
      )}
    >
      <div
        aria-label={text}
        role="status"
        className={cn("flex items-center space-x-2", className)}
      >
        <Spinner className={cn("h-10 w-10 text-green-600", spinnerClassName)} />
        {showText && (
          <span
            className={cn("text-xl font-medium text-green-600", textClassName)}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default Loading;
