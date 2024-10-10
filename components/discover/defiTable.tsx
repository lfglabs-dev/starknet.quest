import React, { FunctionComponent, useCallback, useState } from "react";
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
import { CDNImage, CDNImg } from "@components/cdn/image";
import Dropdown from "@components/UI/dropdown";
import { SelectChangeEvent } from "@mui/material";
import {
  AIRDROP_APPS,
  AUDITED_APPS,
  STABLES,
  TOKEN_OPTIONS,
} from "@constants/defi";
import AppIcon from "./appIcon";
import ActionText from "./actionText";
import DownIcon from "@components/UI/iconsComponents/icons/downIcon";
import UpIcon from "@components/UI/iconsComponents/icons/upIcon";
import { getRedirectLink } from "@utils/defi";
import DefiTableSkeleton from "./defiTableSkeleton";
import ClaimModal from "./claimModal";
import SuccessModal from "./successModal";

type DataTableProps = {
  data: TableInfo[];
  loading: boolean;
};

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
      <div className="capitalize text-left">
        <AppIcon app={row.getValue("app")} />
      </div>
    ),
    enableSorting: false, // disable sorting for this column

    filterFn: (row, columnId, filterValue) => {
      const rowValue: string = row.getValue(columnId);
      if (filterValue === "Audit") {
        return AUDITED_APPS.includes(rowValue.toLowerCase());
      } else if (filterValue === "No Audit") {
        return !AUDITED_APPS.includes(rowValue.toLowerCase());
      } else if (filterValue === "Airdropped") {
        return AIRDROP_APPS.includes(rowValue.toLowerCase());
      } else if (filterValue === "Hasn't Airdropped") {
        return !AIRDROP_APPS.includes(rowValue.toLowerCase());
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
      return (
        <div className="flex flex-row items-center gap-4 h-10">
          <div
            className="flex flex-row gap-2 items-center justify-center"
            onClick={() =>
              window.open(
                getRedirectLink(row.getValue("app"), row.getValue("action")),
                "_blank"
              )
            }
          >
            <Typography type={TEXT_TYPE.BODY_SMALL} color="white">
              {row.getValue("title")}
            </Typography>
            <CDNImg src="/icons/linkIcon.svg" width={16} />
          </div>
          <div className="flex flex-row items-center gap-2">
            {!AIRDROP_APPS.includes(
              String(row.getValue("app")).toLowerCase()
            ) ? (
              <div className="flex px-2 justify-center items-center border-[1px] border-[#f4faff4d] rounded-sm">
                <Typography type={TEXT_TYPE.BODY_EXTRA_SMALL} color="textGray">
                  AIRDROP
                </Typography>
              </div>
            ) : null}

            {AUDITED_APPS.includes(
              String(row.getValue("app")).toLowerCase()
            ) ? (
              <div className="flex  px-2 justify-center items-center border-[1px] border-[#f4faff4d] rounded-sm">
                <Typography type={TEXT_TYPE.BODY_EXTRA_SMALL} color="textGray">
                  AUDIT
                </Typography>
              </div>
            ) : null}
          </div>
        </div>
      );
    },
    enableSorting: false, // disable sorting for this column
    filterFn: (row, columnId, filterValue) => {
      const rowValue: string = row.getValue(columnId);
      if (filterValue === "Stables") {
        let res = false;
        STABLES.forEach((stable) => {
          if (rowValue.toLowerCase().includes(stable.toLowerCase())) {
            res = true;
          }
        });
        return res;
      }
      return rowValue.toLowerCase().includes(filterValue.toLowerCase());
    },
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
      <div className="capitalize text-left">
        <ActionText type={row.getValue("action")} />
      </div>
    ),
    enableSorting: false, // disable sorting for this column
  },
  {
    accessorKey: "apr",
    header: () => (
      <div className="flex items-center modified-cursor-pointer w-full h-full">
      <div className="flex flex-row gap-2 items-center">
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          APR
        </Typography>
        <div className="flex flex-col gap-0">
          <DownIcon width="10" color="#a6a5a7" />
          <UpIcon width="10" color="#a6a5a7" />
        </div>
      </div>
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
      <div className="flex items-center modified-cursor-pointer w-full h-full">
      <div className="flex flex-row gap-2 items-center">
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          TVL
        </Typography>
        <div className="flex flex-col gap-0">
          <div>
            <DownIcon width="10" color="#a6a5a7" />
          </div>
          <div>
            <UpIcon width="10" color="#a6a5a7" />
          </div>
        </div>
      </div>
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
      <div className="flex items-center modified-cursor-pointer w-full h-full">
      <div className="flex flex-row gap-2 items-center justify-end">
        <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
          Daily Rewards
        </Typography>
        <div className="flex flex-col gap-0">
          <DownIcon width="10" color="#a6a5a7" />
          <UpIcon width="10" color="#a6a5a7" />
        </div>
      </div>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DataTable: FunctionComponent<DataTableProps> = ({ data, loading }) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "apr",
      desc: true,
    },
  ]);

  const [tokenFilter, setTokenFilter] = useState<string>();
  const [liquidityFilter, setLiquidityFilter] = useState<string>();
  const [securityFilter, setSecurityFilter] = useState<string>();
  const [airdropFilter, setAirdropFilter] = useState<string>();
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

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
    setSecurityFilter(e.target.value);
    column?.setFilterValue(e.target.value);
  }, []);

  const handleAirdropFilter = useCallback((e: SelectChangeEvent) => {
    const column = table.getColumn("app");
    setAirdropFilter(e.target.value);
    column?.setFilterValue(e.target.value);
  }, []);

  const resetFilters = useCallback(() => {
    setLiquidityFilter("");
    setTokenFilter("");
    setAirdropFilter("");
    setSecurityFilter("");
    table.resetColumnFilters();
  }, [table]);

  const getClaimRewards = useCallback(() => {
    // TODO: Implement fetch from backend. Returning mock values.
    return [
      {
        appName: "EKUBO", 
        currencies: [
          {currencyName: "STRK", value: 11570}
        ],
      },
      {
        appName: "NOSTRA", 
        currencies: [
          {currencyName: "STRK", value: 12.124},
          {currencyName: "ETH", value: 1.1245}
        ],
      },
      {
        appName: "zkLend", 
        currencies: [
          {currencyName: "USDT", value: 124.12}
        ],
      },
      {
        appName: "VESU", 
        currencies: [
          {currencyName: "STRK", value: 36}
        ],
      },
      {
        appName: "Nimbora", 
        currencies: [
          {currencyName: "STRK", value: 70.145}
        ],
      },
      {
        appName: "zkLend", 
        currencies: [
          {currencyName: "USDT", value: 124.12}
        ],
      },
      {
        appName: "VESU", 
        currencies: [
          {currencyName: "STRK", value: 36}
        ],
      },
      {
        appName: "Nimbora", 
        currencies: [
          {currencyName: "STRK", value: 70.145}
        ],
      },
    ];
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="">
        <div className={`flex w-100 lg:flex-row flex-col justify-between items-start`}>
          <div className={`flex w-100 flex-col gap-2`}>
            <Typography type={TEXT_TYPE.H4} color="secondary">
              Explore reward opportunities
            </Typography>
            <Typography type={TEXT_TYPE.BODY_MICRO} color="secondary">
              Find the best opportunities, and earn tokens
            </Typography>
          </div>
          <div
            onClick={() => setShowClaimModal(true)}
            className="flex flex-row items-center justify-evenly gap-4 bg-white rounded-lg modified-cursor-pointer h-min lg:mt-2 mt-8 px-4 lg:py-1 py-2">
            <AppIcon app="starknet"/>
            <Typography type={TEXT_TYPE.BUTTON_LARGE} color="background">
              Claim all
            </Typography>
          </div>
        </div>
        <ClaimModal
          open={showClaimModal}
          rewards={getClaimRewards()}
          closeModal={() => setShowClaimModal(false)}
          claimRewards={() => {
            setShowClaimModal(false);
            setShowSuccessModal(true);
          }}
        />
        <SuccessModal 
          open={showSuccessModal}
          closeModal={() => setShowSuccessModal(false)}
        />
        <div className="flex xl:flex-row flex-col sm:justify-between gap-4 justify-center items-center py-4 xl:py-0">
          <div className="w-full gap-4 flex flex-row py-4 flex-wrap xl:flex-nowrap justify-center lg:justify-start">
            <div className="w-full lg:w-fit">
              <Dropdown
                value={liquidityFilter}
                backgroundColor="#101012"
                textColor="#fff"
                handleChange={handleLiquidityFiltering}
                placeholder="Type of liquidity"
                options={[
                  { value: "Derivatives", label: "Derivatives" },
                  { value: "Lend", label: "Lend" },
                  { value: "Provide liquidity", label: "Provide liquidity" },
                  { value: "Strategies", label: "Strategies" },
                ]}
              />
            </div>
            <div className="w-full lg:w-fit">
              <Dropdown
                value={tokenFilter}
                backgroundColor="#101012"
                textColor="#fff"
                handleChange={handleTokenFiltering}
                placeholder="Type of token"
                options={TOKEN_OPTIONS}
              />
            </div>
            <div className="w-full lg:w-fit">
              <Dropdown
                value={securityFilter}
                backgroundColor="#101012"
                textColor="#fff"
                handleChange={handleSecurityFilter}
                placeholder="Type of Security"
                options={[
                  { value: "Audit", label: "Audit" },
                  { value: "No Audit", label: "No Audit" },
                ]}
              />
            </div>
            <div className="w-full lg:w-fit">
              <Dropdown
                value={airdropFilter}
                backgroundColor="#101012"
                textColor="#fff"
                handleChange={handleAirdropFilter}
                placeholder="Airdrop Status"
                options={[
                  { value: "Airdropped", label: "Airdropped" },
                  { value: "Hasn't Airdropped", label: "Hasn't Airdropped" },
                ]}
              />
            </div>
          </div>
          <div
            className="flex w-full xl:justify-end flex-grow-0 justify-center items-center"
            onClick={resetFilters}
          >
            <div className="w-fit  modified-cursor-pointer border-[1px] border-[#f4faff4d] px-4 rounded-md">
              <Typography type={TEXT_TYPE.BODY_DEFAULT} color="white">
                Clear All
              </Typography>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-[1px] border-[#f4faff4d] min-w-[930px] xl:w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}>
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
                    onClick={() =>{
                      window.open(
                        getRedirectLink(row.getValue("app"), row.getValue("action")),
                        "_blank"
                      )
                    }}
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
                <DefiTableSkeleton />
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center space-x-2 pt-4">
          <div className="text-sm text-muted-foreground flex gap-8">
            <div
              className="flex modified-cursor-pointer"
              onClick={() =>
                table.getCanPreviousPage() ? table.previousPage() : null
              }
              style= {table.getCanPreviousPage() ? {} : {cursor:'not-allowed' } }
            >
              <CDNImage
                src="/icons/chevronLeft.svg"
                alt="chevron left"
                width={8}
                height={8}
              />
            </div>
            <div
              className="flex modified-cursor-pointer"
              onClick={() => (table.getCanNextPage() ? table.nextPage() : null)}
              style= {table.getCanNextPage() ? {} : {cursor:'not-allowed' } }
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
    </div>
  );
};

export default DataTable;
