import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/UI/table/table";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

const DefiTableSkeleton: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-xl border-[1px] border-[#f4faff4d] min-w-[930px] xl:w-full">
        <Table>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell>
                  <div className="h-8 w-full bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 pt-4">
        <div className="text-sm text-muted-foreground flex gap-8">
          <div className="flex">
            <Typography type={TEXT_TYPE.BODY_DEFAULT} color="white">
              Clear All
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefiTableSkeleton;
