import { cn } from "@/lib/utils";
import { SVGProps } from "react";

interface SpinnerProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <svg
      className={cn("animate-spin stroke-current", className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <line
        x1="128"
        y1="32"
        x2="128"
        y2="64"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="195.9"
        y1="60.1"
        x2="173.3"
        y2="82.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="224"
        y1="128"
        x2="192"
        y2="128"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="195.9"
        y1="195.9"
        x2="173.3"
        y2="173.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="128"
        y1="224"
        x2="128"
        y2="192"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="60.1"
        y1="195.9"
        x2="82.7"
        y2="173.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="32"
        y1="128"
        x2="64"
        y2="128"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
      <line
        x1="60.1"
        y1="60.1"
        x2="82.7"
        y2="82.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      ></line>
    </svg>
  );
};

export default Spinner;
