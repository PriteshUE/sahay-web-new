import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash,
  ChevronUp,
  ChevronDown,
  KeyRound,
  GripVertical,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SpinnerIcon } from "../Icons";
import FormCheckbox from "../Form/FormCheckbox/FormCheckbox";
import Pagination from "../Pagination/Pagination";

const DND_ITEM_TYPE = "ROW";

interface ResizableTableProps {
  children: React.ReactNode;
}

const ResizableTable = ({ children }: ResizableTableProps) => {
  return (
    <Table className="w-full border-collapse table-fixed">{children}</Table>
  );
};

interface ResizableTableHeaderProps {
  children: React.ReactNode;
}

const ResizableTableHeader = ({ children }: ResizableTableHeaderProps) => {
  return <TableHeader className="relative">{children}</TableHeader>;
};

interface ResizableTableHeadProps {
  children: React.ReactNode;
  onResize?: (width: number) => void;
  initialWidth?: number;
  isResizable?: boolean;
  style?: React.CSSProperties;
}

const ResizableTableHead = ({
  children,
  onResize,
  initialWidth = 150,
  isResizable = true,
  style,
}: ResizableTableHeadProps) => {
  const [width, setWidth] = useState(initialWidth);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isResizable) return;

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + e.clientX - startX;
      setWidth(Math.max(50, newWidth)); // Minimum width of 50px
      if (onResize) onResize(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <TableHead
      style={{ width: `${width}px`, ...style }}
      className="relative select-none"
    >
      <div className="flex items-center justify-between">
        {children}
        {isResizable && (
          <div
            className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 active:bg-blue-600"
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    </TableHead>
  );
};

interface DraggableRowProps {
  id: string;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

function DraggableRow({ id, index, moveRow, children }: DraggableRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DND_ITEM_TYPE,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item: { id: number; index: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      className={`cursor-move ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {children}
    </TableRow>
  );
}

interface TableProps<T extends Record<string, unknown>> {
  tableData?: T[];
  columns?: Partial<Record<keyof T, string>>;
  primaryKey: keyof T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  paginationDetails?: PaginationFilter;
  setPaginationFilter?: (filter: PaginationFilter) => void;
  isLoading?: boolean;
  isActionButton?: boolean;
  additionalButton?: React.ReactNode;
  onAdditionButton?: (item: T) => void;
  customActions?: (row: T) => React.ReactNode;
  showIndexColumn?: boolean;
  multiSelect?: boolean;
  selectedValue?: T[] | T;
  handleChange?: (selected: T[] | T) => void;
}

const TableData = <T extends Record<string, unknown>>({
  tableData = [],
  columns = {},
  primaryKey,
  onEdit,
  onDelete,
  customActions,
  paginationDetails,
  setPaginationFilter,
  isLoading = false,
  isActionButton = false,
  onAdditionButton = () => {},
  additionalButton,
  showIndexColumn = false,
  multiSelect,
  selectedValue = [],
  handleChange,
}: TableProps<T>) => {
  const [rows, setRows] = useState<T[]>(tableData);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const tableRef = useRef<HTMLDivElement>(null);

  const columnKeys = Object.keys(columns ?? {});
  const showCheckboxes = multiSelect || (!!selectedValue && !!handleChange);

  useEffect(() => {
    setRows(tableData);
  }, [tableData]);

  const handleResize = (columnKey: string, width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: Math.max(50, width), // Ensure minimum width of 50px
    }));
  };

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const [movedRow] = updatedRows.splice(dragIndex, 1);
      updatedRows.splice(hoverIndex, 0, movedRow);
      return updatedRows;
    });
  };

  const handleCheckboxChange = (item: T, isChecked: boolean) => {
    const selectedItems = Array.isArray(selectedValue) ? selectedValue : [];

    if (multiSelect) {
      const updatedSelection = isChecked
        ? [...selectedItems, item]
        : selectedItems.filter(
            (selected) => selected[primaryKey] !== item[primaryKey],
          );
      handleChange?.(updatedSelection);
    } else {
      if (isChecked) handleChange?.(item);
    }
  };

  // Calculate total width of all columns
  const totalWidth =
    40 + // drag handle
    (showCheckboxes ? 40 : 0) + // checkbox column
    (showIndexColumn ? 80 : 0) + // index column
    columnKeys.reduce((sum, key) => sum + (columnWidths[key] || 150), 0) + // data columns
    (isActionButton ? 40 : 0); // action column

  return (
    <Card className="w-full p-2 mb-5 overflow-hidden">
      <div
        className="overflow-x-auto max-h-[calc(100svh-183px)] tb:max-h-[calc(100svh-260px)]"
        ref={tableRef}
        style={{ overflowX: "auto" }}
      >
        <div style={{ width: `${totalWidth}px`, minWidth: "100%" }}>
          <DndProvider backend={HTML5Backend}>
            <ResizableTable>
              <ResizableTableHeader>
                <TableRow>
                  <ResizableTableHead
                    initialWidth={40}
                    isResizable={false}
                    style={{ width: "40px" }}
                    children={undefined}
                  >
                    {/* Drag handle column */}
                  </ResizableTableHead>
                  {showCheckboxes && (
                    <ResizableTableHead
                      initialWidth={40}
                      isResizable={false}
                      style={{ width: "40px" }}
                      children={undefined}
                    >
                      {/* Checkbox column */}
                    </ResizableTableHead>
                  )}
                  {showIndexColumn && (
                    <ResizableTableHead
                      initialWidth={80}
                      isResizable={false}
                      style={{ width: "80px" }}
                    >
                      #
                    </ResizableTableHead>
                  )}
                  {columnKeys.map((clm, i) => (
                    <ResizableTableHead
                      key={clm + i}
                      initialWidth={columnWidths[clm] || 150}
                      onResize={(width) => handleResize(clm, width)}
                      isResizable={true}
                    >
                      {columns[clm]}
                    </ResizableTableHead>
                  ))}
                  {isActionButton && (
                    <ResizableTableHead
                      initialWidth={40}
                      isResizable={false}
                      style={{ width: "40px" }}
                      children={undefined}
                    >
                      {/* Action column */}
                    </ResizableTableHead>
                  )}
                </TableRow>
              </ResizableTableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="py-6">
                      <div className="flex justify-center items-center h-20">
                        <div className="animate-spin">
                          <SpinnerIcon />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((item, index) => (
                    <DraggableRow
                      key={item[primaryKey] as React.Key}
                      id={String(item[primaryKey])}
                      index={index}
                      moveRow={moveRow}
                    >
                      <TableCell style={{ width: "40px" }}>
                        <GripVertical className="w-6 h-6 text-gray-500 cursor-grab" />
                      </TableCell>
                      {showCheckboxes && (
                        <TableCell style={{ width: "40px" }}>
                          <FormCheckbox
                            id={`${String(item[primaryKey])}-checkbox`}
                            onChange={(e) =>
                              handleCheckboxChange(item, e.target.checked)
                            }
                            checked={
                              multiSelect
                                ? (selectedValue as T[]).some(
                                    (selected) =>
                                      selected[primaryKey] === item[primaryKey],
                                  )
                                : (selectedValue as T)?.[primaryKey] ===
                                  item[primaryKey]
                            }
                          />
                        </TableCell>
                      )}
                      {showIndexColumn && (
                        <TableCell
                          style={{ width: "80px" }}
                          className="text-center p-0"
                        >
                          <div className="flex flex-col items-center gap-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveRow(index, index - 1)}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveRow(index, index + 1)}
                              disabled={index === rows.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                      {columnKeys.map((clm) => (
                        <TableCell
                          key={`${item[primaryKey]}_${clm}`}
                          className="whitespace-normal break-words"
                          style={{
                            width: columnWidths[clm]
                              ? `${columnWidths[clm]}px`
                              : "150px",
                            maxWidth: columnWidths[clm]
                              ? `${columnWidths[clm]}px`
                              : "150px",
                          }}
                        >
                          {String(item[clm] || " - ")}
                        </TableCell>
                      ))}
                      {isActionButton && (
                        <TableCell
                          style={{ width: "40px" }}
                          className="text-right whitespace-nowrap"
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              {customActions?.(item)}

                              <DropdownMenuItem
                                onClick={() => onEdit && onEdit(item)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => onDelete && onDelete(item)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>

                              {additionalButton && onAdditionButton && (
                                <DropdownMenuItem
                                  onClick={() => onAdditionButton(item)}
                                >
                                  <span className="flex items-center">
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Permission
                                  </span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </DraggableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ResizableTable>
          </DndProvider>
        </div>
      </div>

      {paginationDetails && (
        <div className="pt-4">
          <Pagination
            paginationDetails={paginationDetails}
            setPaginationFilter={setPaginationFilter}
          />
        </div>
      )}
    </Card>
  );
};

export default TableData;
