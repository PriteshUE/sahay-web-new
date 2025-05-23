import { useState, useMemo } from "react";
import DropdownSearchMenu from "@/components/shared/DropdownSearchMenu/DropdownSearchMenu";
import DndTable from "@/components/shared/DndTable";

// Define a type for your tasks
type Task = {
  id: string;
  taskId?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  sequence: number;
};

const tasks = [
  {
    id: "1",
    taskId: "TASK=6722",
    title: "Documentation",
    description:
      "You can't compress the program without quantifying the open-source SSD...",
    status: "Todo",
    priority: "Medium",
    type: "Documentation",
    sequence: 1,
  },
  {
    id: "2",
    title: "Calculate the EXE feed",
    description:
      "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "In Progress",
    priority: "High",
    type: "Feature",
    sequence: 2,
  },
  {
    id: "3",
    title: "Bypass the neural TCP card",
    description: "We need to bypass the neural TCP card!",
    status: "Backlog",
    priority: "High",
    type: "Bug",
    sequence: 3,
  },
  {
    id: "4",
    title: "the neural TCP card",
    description: "to bypass the neural TCP card!",
    status: "01",
    priority: "aaaaa",
    type: "Bug ff",
    sequence: 4,
  },
  {
    id: "5",
    title: "heural TCP card",
    description: "bypass the neural TCP card!",
    status: "02",
    priority: "High",
    type: "Bug",
    sequence: 5,
  },
];

// Define a type for column toggle options
type ColumnToggleOption = {
  key: keyof Task | string;
  label: string;
  visible: boolean;
};

export default function TaskStatus() {
  const [columnToggleOptions, setColumnToggleOptions] = useState<
    ColumnToggleOption[]
  >([
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "sequence", label: "Sequence", visible: true },
  ]);

  const visibleColumns = columnToggleOptions.reduce(
    (acc, col) => {
      if (col.visible) acc[col.key] = col.label;
      return acc;
    },
    {} as Record<string, string>,
  );

  const onToggleColumn = (key: string) => {
    setColumnToggleOptions((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const canToggleColumns = columnToggleOptions.length > 3;

  // Multi-select filter state for each filterable column
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  // List of columns that can be filtered (typed as keys of Task)
  const filterableColumns = useMemo<(keyof Task)[]>(
    () => ["status", "priority", "type"],
    [],
  );

  // Get visible filterable columns
  const visibleFilterableColumns = columnToggleOptions
    .filter(
      (col) => col.visible && filterableColumns.includes(col.key as keyof Task),
    )
    .map((col) => col.key);

  // Extract unique values and counts for each filterable column from tasks
  const filterOptions = useMemo(() => {
    const options: {
      [key in keyof Task]?: { label: string; value: string; count: number }[];
    } = {};

    filterableColumns.forEach((col) => {
      const counts: Record<string, number> = {};
      tasks.forEach((task) => {
        const value = task[col];
        if (value) counts[value] = (counts[value] || 0) + 1;
      });
      options[col] = Object.entries(counts).map(([value, count]) => ({
        label: value,
        value,
        count,
      }));
    });
    return options;
  }, [filterableColumns]);

  // Filter tasks based on selected filters (multi-select)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      visibleFilterableColumns.every((col) => {
        const filterValues = filters[col];
        const taskValue = task[col as keyof Task];
        return (
          !filterValues?.length || filterValues.includes(taskValue as string)
        );
      }),
    );
  }, [filters, visibleFilterableColumns]);

  // Handler for filter selection
  const handleFilterChange = (col: string, selected: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [col]: selected,
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex gap-4 mb-4">
        {/* Status filter */}
        {visibleFilterableColumns.includes("status") && (
          <DropdownSearchMenu
            label="Status"
            options={filterOptions["status"] || []}
            selected={filters["status"] || []}
            onChange={(selected) => handleFilterChange("status", selected)}
            multiSelect
            showCount
          />
        )}
        {/* Priority filter */}
        {visibleFilterableColumns.includes("priority") && (
          <DropdownSearchMenu
            label="Priority"
            options={filterOptions["priority"] || []}
            selected={filters["priority"] || []}
            onChange={(selected) => handleFilterChange("priority", selected)}
            multiSelect
            showCount
          />
        )}
        {/* Type filter */}
        {visibleFilterableColumns.includes("type") && (
          <DropdownSearchMenu
            label="Type"
            options={filterOptions["type"] || []}
            selected={filters["type"] || []}
            onChange={(selected) => handleFilterChange("type", selected)}
            multiSelect
            showCount
          />
        )}
        {/* Toggle Visible Columns */}
        {canToggleColumns && (
          <DropdownSearchMenu
            label="Toggle Visible Columns"
            columns={columnToggleOptions}
            onToggleColumn={onToggleColumn}
          />
        )}
      </div>
      <DndTable
        tableData={filteredTasks}
        primaryKey="id"
        columns={visibleColumns}
        localStorageId="TaskStatusColumnWidth"
      />
    </div>
  );
}
