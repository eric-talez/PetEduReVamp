import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        hover && "card-hover",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  description: string;
  badge?: { text: string; variant: string };
  trainer: { image: string; name: string };
  onClick?: () => void;
}

const CourseCard = forwardRef<HTMLDivElement, CourseCardProps>(
  ({ image, title, description, badge, trainer, children, onClick, ...props }, ref) => {
    return (
      <Card 
        ref={ref} 
        className="overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 hover:translate-y-[-4px] hover:shadow-lg"
        onClick={onClick}
        {...props}
      >
        <div className="relative h-48">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {badge && (
            <span className={`absolute top-2 right-2 text-xs font-medium py-1 px-2 rounded-full bg-${badge.variant}-500 text-white`}>
              {badge.text}
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {description}
          </p>
          <div className="mt-auto flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs">{trainer.name}</span>
          </div>
          {children}
        </div>
      </Card>
    );
  }
);
CourseCard.displayName = "CourseCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CourseCard };
