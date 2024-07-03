import React, { useCallback, useState } from "react";
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
import Dropdown from "@components/UI/dropdown";
import { SelectChangeEvent } from "@mui/material";
import { AIRDROP_APPS, AUDITED_APPS, TOKEN_OPTIONS } from "@constants/defi";

export const columns: ColumnDef<TableInfo>[] = [
  {
    accessorKey: "app",
    header: () => (
      <div>
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          App
        </Typography>
      </div>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-left">{row.getValue("app")}</div>
    ),
    enableSorting: false, // disable sorting for this column

    filterFn: (row, columnId, filterValue) => {
      const rowValue: string = row.getValue(columnId);
      if (filterValue === "Audited") {
        return AUDITED_APPS.includes(rowValue);
      } else if (filterValue === "Not Audited") {
        return !AUDITED_APPS.includes(rowValue);
      } else if (filterValue === "Airdrop") {
        return AIRDROP_APPS.includes(rowValue);
      } else if (filterValue === "No Airdrop") {
        return !AIRDROP_APPS.includes(rowValue);
      }
      return true;
    },
  },
  {
    accessorKey: "title",
    header: () => (
      <div>
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          Title
        </Typography>
      </div>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("title")}</div>;
    },
    enableSorting: false, // disable sorting for this column
  },
  {
    accessorKey: "action",
    header: () => (
      <div>
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          Action
        </Typography>
      </div>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-left">{row.getValue("action")}</div>
    ),
    enableSorting: false, // disable sorting for this column
  },
  {
    accessorKey: "apr",
    header: () => (
      <div>
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          APR
        </Typography>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("apr")).toFixed(2);
      return <div className="font-medium">{amount} %</div>;
    },
  },
  {
    accessorKey: "volume",
    header: () => (
      <div>
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          TVL
        </Typography>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("volume"));

      const formatted = amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        notation: "compact",
        compactDisplay: "short",
      });

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "daily_rewards",
    header: () => (
      <div className="w-full text-right">
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          Daily Rewards
        </Typography>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("daily_rewards"));

      const formatted = amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        notation: "compact",
        compactDisplay: "short",
      });

      return <div className="font-medium text-right">{formatted}</div>;
    },
  },
];

export function DataTable({
  data,
  loading,
}: {
  data: TableInfo[];
  loading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "apr",
      desc: true,
    },
  ]);

  const [tokenFilter, setTokenFilter] = useState("None");
  const [liquidityFilter, setLiquidityFilter] = useState("None");
  const [securityFilter, setSecurityFilter] = useState("None");
  const [airdropFilter, setAirdropFilter] = useState("None");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    sortDescFirst: true,
    enableSortingRemoval: false,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },

    state: {
      sorting,
    },
  });

  const handleLiquidityFiltering = useCallback((e: SelectChangeEvent) => {
    const column = table.getColumn("action");
    setLiquidityFilter(e.target.value);
    column?.setFilterValue(e.target.value);
  }, []);

  const handleTokenFiltering = useCallback((e: SelectChangeEvent) => {
    const column = table.getColumn("title");
    setTokenFilter(e.target.value);
    column?.setFilterValue(e.target.value);
  }, []);

  const handleSecurityFilter = useCallback((e: SelectChangeEvent) => {
    const column = table.getColumn("app");
    column?.setFilterValue(e.target.value);
  }, []);
  const handleAirdropFilter = useCallback((e: SelectChangeEvent) => {
    const column = table.getColumn("app");
    column?.setFilterValue(e.target.value);
  }, []);
  const resetFilters = useCallback(() => {
    table.resetColumnFilters();
    setLiquidityFilter("None");
    setTokenFilter("None");
    setAirdropFilter("None");
    setSecurityFilter("None");
  }, []);

  return (
    <div className="w-full">
      <div className={`flex w-100 flex-col gap-2`}>
        <Typography type={TEXT_TYPE.H4} color="secondary">
          Explore reward opportunities
        </Typography>
        <Typography type={TEXT_TYPE.BODY_MICRO} color="secondary">
          Find the best opportunities, and earn tokens
        </Typography>
      </div>
      <div className="flex flex-row justify-between gap-4">
        <div className="w-full gap-4 flex flex-row py-4">
          <div>
            <Dropdown
              value={liquidityFilter}
              backgroundColor="#101012"
              textColor="#fff"
              handleChange={handleLiquidityFiltering}
              options={[
                { value: "None", label: "Type of liquidity" },
                { value: "yay", label: "Derivates" },
                { value: "Lend", label: "Lend" },
                { value: "Pair", label: "Pairing" },
                { value: "Alt", label: "Alt" },
              ]}
            />
          </div>
          <div>
            <Dropdown
              value={tokenFilter}
              backgroundColor="#101012"
              textColor="#fff"
              handleChange={handleTokenFiltering}
              options={[
                { value: "None", label: "Type of token" },
                ...TOKEN_OPTIONS,
              ]}
            />
          </div>
          <div>
            <Dropdown
              value={securityFilter}
              backgroundColor="#101012"
              textColor="#fff"
              handleChange={handleSecurityFilter}
              options={[
                { value: "None", label: "Type of Security" },
                { value: "Audited", label: "Audited" },
                { value: "Not Audited", label: "Not Audited" },
              ]}
            />
          </div>
          <div>
            <Dropdown
              value={airdropFilter}
              backgroundColor="#101012"
              textColor="#fff"
              handleChange={handleAirdropFilter}
              options={[
                { value: "None", label: "Airdrop" },
                { value: "Airdrop", label: "Airdrop" },
                { value: "No Airdrop", label: "No Airdrop" },
              ]}
            />
          </div>
        </div>
        <div
          className="flex w-full justify-end items-center cursor-pointer"
          onClick={resetFilters}
        >
          <p>Clear All</p>
        </div>
      </div>

      <div className="rounded-xl border-[1px] border-[#f4faff4d]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loading ? "Loading..." : "No results"}
              </TableCell>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 pt-4">
        <div className="text-sm text-muted-foreground flex gap-8">
          <div
            className="flex"
            onClick={() =>
              table.getCanPreviousPage() ? table.previousPage() : null
            }
            style={{
              cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
            }}
          >
            <CDNImage
              src="/icons/chevronLeft.svg"
              alt="chevron left"
              width={8}
              height={8}
            />
          </div>
          <div
            className="flex"
            onClick={() => (table.getCanNextPage() ? table.nextPage() : null)}
            style={{
              cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
            }}
          >
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
