import React from "react";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ ...props }, ref) => (
  <div className="relative w-full rounded-xl overflow-auto">
    <table
      ref={ref}
      className={"w-full caption-bottom text-sm overflow-auto"}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...props }, ref) => (
  <thead
    ref={ref}
    className="[&_tr]:border-[1px] [&_tr]:border-[#f4faff4d] [&_tr]:border-t-0 [&_tr]:border-l-0 [&_tr]:border-r-0"
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...props }, ref) => (
  <tbody ref={ref} className={"[&_tr:last-child]:border-0"} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...props }, ref) => (
  <tfoot
    ref={ref}
    className={
      "border-[1px] border-[#f4faff4d] bg-muted/50 font-medium [&>tr]:last:border-b-0"
    }
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ ...props }, ref) => (
  <tr
    ref={ref}
    className={
      "hover:bg-[#18181A]  modified-cursor-pointer border-[1px] border-[#f4faff4d] transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-r-0 border-l-0 grid grid-cols-[minmax(min-content,0.5fr)_minmax(min-content,2fr)_minmax(min-content,2fr)_minmax(min-content,1fr)_minmax(min-content,1fr)_minmax(min-content,1fr)] items-center"
    }
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ ...props }, ref) => (
  <th
    ref={ref}
    className={
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] flex items-center"
    }
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ ...props }, ref) => (
  <td
    ref={ref}
    className={
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    }
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ ...props }, ref) => (
  <caption
    ref={ref}
    className={"mt-4 text-sm text-muted-foreground"}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
