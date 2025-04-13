
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && trendValue && (
          <p
            className={cn(
              "text-xs font-medium mt-1",
              trend === "up" && "text-emerald-500",
              trend === "down" && "text-red-500"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
            {` ${trendValue}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
