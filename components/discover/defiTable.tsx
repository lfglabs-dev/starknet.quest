import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/UI/table/table";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import { CDNImage } from "@components/cdn/image";

export const columns: ColumnDef<TableInfo>[] = [
  {
    accessorKey: "status",
    header: "App",
    cell: ({ row }) => <div className="capitalize">{row.getValue("app")}</div>,
  },
  {
    accessorKey: "title",
    header: () => <Typography type={TEXT_TYPE.BODY_DEFAULT}>Title</Typography>,
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Action",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("action")}</div>
    ),
  },
  {
    accessorKey: "APR",
    header: () => <div className="flex-1">APR</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("apr"));
      return <div className="font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "TVL",
    header: () => <div className="">TVL</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("tvl"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "Daily rewards",
    header: () => <div className="">Daily Rewards</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("daily_rewards"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
];

export function DataTable({ data }: { data: TableInfo[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-xl border-[1px] border-[#f4faff4d]">
        <div
          className={`flex w-100 flex-col gap-2 p-4 border-b-[1px] border-[#f4faff4d]`}
        >
          <Typography type={TEXT_TYPE.H4} color="secondary">
            Explore reward opportunities
          </Typography>
          <Typography type={TEXT_TYPE.BODY_MICRO} color="secondary">
            Find the best opportunities, and earn tokens
          </Typography>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
              // </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Typography type={TEXT_TYPE.BODY_SMALL}>
            Number of rows per page 5
          </Typography>
        </div>
        <div className="text-sm text-muted-foreground flex gap-8">
          <div className="flex">
            <CDNImage
              src="/icons/chevronLeft.svg"
              alt="chevron left"
              width={8}
              height={8}
            />
          </div>
          <div className="flex">
            <CDNImage
              src="/icons/chevronRight.svg"
              alt="chevron right"
              width={16}
              height={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
