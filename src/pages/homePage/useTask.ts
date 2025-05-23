import { isWithinInterval, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export default function useTask() {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(),
  });

  const taskData = {
    data: [
      {
        taskId: "b513908d-4eac-48a5-9355-08900b358722",
        taskName: "hggj",
        taskDescription: "hgjhgj",
        taskDeadline: "2025-05-21T05:58:00.000Z",
        taskStartDate: "2025-05-20T14:03:00.000Z",
        taskActualEndDate: null,
        taskStatusId: "07621d5c-a88d-4061-835d-2c1f40aaf4ed",
        taskStatusName: "Delayed",
        taskTypeId: "ea59cfc1-06c9-4e9e-a0cb-9339dbbf604a",
        taskTypeName: "Client Staff Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Pritesh",
        },
        assignees: [
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
        ],
      },
      {
        taskId: "a87c28b3-e3d5-4f3c-b87e-6163b68bb2ed",
        taskName: "21",
        taskDescription: "hjhgj",
        taskDeadline: "2025-05-19T18:57:00.000Z",
        taskStartDate: "2025-05-21T05:58:00.000Z",
        taskActualEndDate: null,
        taskStatusId: "183d40e6-9a43-4a36-857e-98ee9a6886a6",
        taskStatusName: "In Progress",
        taskTypeId: "a26ea178-6fcc-4b9b-a34b-ceea4bc35d1e",
        taskTypeName: "Rushiraj Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Pritesh",
        },
        assignees: [
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
          {
            employeeId: "d2a87068-abb7-45b3-bf69-d6fc426cc827",
            employeeName: "Rushiraj Patel",
          },
        ],
      },
      {
        taskId: "c584085a-63d0-4b50-8f4e-e609c8ca30c4",
        taskName: "jhgjgj",
        taskDescription: "ghjghgh",
        taskDeadline: "2025-05-21T11:16:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "33d54386-54c0-4097-8e97-c07e2a40aeef",
        taskStatusName: "Yet to start",
        taskTypeId: "a26ea178-6fcc-4b9b-a34b-ceea4bc35d1e",
        taskTypeName: "Rushiraj Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Pritesh",
        },
        assignees: [
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
        ],
      },
      {
        taskId: "098e5e3d-b272-4637-8a33-edffc58423a2",
        taskName: "vnfdgvd",
        taskDescription: "fdgdg",
        taskDeadline: "2025-05-02T11:00:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "07621d5c-a88d-4061-835d-2c1f40aaf4ed",
        taskStatusName: "Delayed",
        taskTypeId: "f5beb1ff-ef2a-4f55-b2ab-98a955d6e335",
        taskTypeName: "Client + Consultant Joint Task",
        createdByEmployee: {
          employeeId: "564d96db-8ccb-471c-9626-3880a168abc6",
          employeeName: "Unknown",
        },
        assignees: [
          {
            employeeId: "02d5cbb0-4ab9-452d-aec2-f886b3fbe608",
            employeeName: "Parth Gadhiya",
          },
        ],
      },
      {
        taskId: "48725be7-ad32-4ff2-aab8-59a2057edc05",
        taskName: "ngdfmgfd",
        taskDescription: "dgfdhfd",
        taskDeadline: "2025-05-21T10:54:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "183d40e6-9a43-4a36-857e-98ee9a6886a6",
        taskStatusName: "In Progress",
        taskTypeId: "ea59cfc1-06c9-4e9e-a0cb-9339dbbf604a",
        taskTypeName: "Client Staff Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Unknown",
        },
        assignees: [
          {
            employeeId: "d2a87068-abb7-45b3-bf69-d6fc426cc827",
            employeeName: "Rushiraj Patel",
          },
        ],
      },
      {
        taskId: "504510d1-f65a-456a-8150-3807eea1a245",
        taskName: "gfdgdg",
        taskDescription: "fgdgdfgd",
        taskDeadline: "2025-05-21T10:50:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "183d40e6-9a43-4a36-857e-98ee9a6886a6",
        taskStatusName: "In Progress",
        taskTypeId: "a26ea178-6fcc-4b9b-a34b-ceea4bc35d1e",
        taskTypeName: "Rushiraj Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Unknown",
        },
        assignees: [
          {
            employeeId: "d2a87068-abb7-45b3-bf69-d6fc426cc827",
            employeeName: "Rushiraj Patel",
          },
        ],
      },
      {
        taskId: "9e18e2c0-a39b-446e-b0c1-58ff26ea2cdb",
        taskName: "agsdash",
        taskDescription: "sdasdas",
        taskDeadline: "2025-05-21T10:38:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "183d40e6-9a43-4a36-857e-98ee9a6886a6",
        taskStatusName: "In Progress",
        taskTypeId: "ea59cfc1-06c9-4e9e-a0cb-9339dbbf604a",
        taskTypeName: "Client Staff Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Pritesh",
        },
        assignees: [
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
          {
            employeeId: "d2a87068-abb7-45b3-bf69-d6fc426cc827",
            employeeName: "Rushiraj Patel",
          },
        ],
      },
      {
        taskId: "8729ebbe-3969-4515-8289-f50c91868c4b",
        taskName: "Pritesh Task 1",
        taskDescription: "ssd gfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgf",
        taskDeadline: "2025-05-09T17:04:00.000Z",
        taskStartDate: null,
        taskActualEndDate: "2025-05-20T08:46:26.746Z",
        taskStatusId: "07621d5c-a88d-4061-835d-2c1f40aaf4ed",
        taskStatusName: "Delayed",
        taskTypeId: "f5beb1ff-ef2a-4f55-b2ab-98a955d6e335",
        taskTypeName: "Client + Consultant Joint Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Unknown",
        },
        assignees: [
          {
            employeeId: "1330babc-5dfa-46e3-b66b-62c9c7f0a9ef",
            employeeName: "testemp",
          },
        ],
      },
      {
        taskId: "b3b02311-5b02-4f64-befc-ebe1c193c3d5",
        taskName: "New Task",
        taskDescription: "dsvcsd",
        taskDeadline: "2025-05-15T08:22:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "07621d5c-a88d-4061-835d-2c1f40aaf4ed",
        taskStatusName: "Delayed",
        taskTypeId: "3a84e838-7950-4203-a1d3-e118f5b8e290",
        taskTypeName: "Owner Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Pritesh",
        },
        assignees: [
          {
            employeeId: "bc1b2738-3319-4ac4-aaad-72ddca128cb1",
            employeeName: "Rahul",
          },
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
        ],
      },
      {
        taskId: "dc5eae00-81fc-42b1-a735-19ac9acbdb07",
        taskName: "Pritesh Task",
        taskDescription: "Pritesh Task Desctiption 1",
        taskDeadline: "2025-05-06T12:30:00.000Z",
        taskStartDate: null,
        taskActualEndDate: "2025-05-15T12:57:47.854Z",
        taskStatusId: "1007687e-3b29-4b2d-b653-a018355aa316",
        taskStatusName: "Completed",
        taskTypeId: "3a84e838-7950-4203-a1d3-e118f5b8e290",
        taskTypeName: "Owner Task",
        createdByEmployee: {
          employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
          employeeName: "Pritesh",
        },
        assignees: [
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
          {
            employeeId: "02d5cbb0-4ab9-452d-aec2-f886b3fbe608",
            employeeName: "Parth Gadhiya",
          },
        ],
      },
      {
        taskId: "ec0cf952-f1c9-4ca2-9a9f-31dd61f4e391",
        taskName: "Rushi Task",
        taskDescription: "Rushi Task",
        taskDeadline: "2025-05-15T19:03:00.000Z",
        taskStartDate: null,
        taskActualEndDate: null,
        taskStatusId: "07621d5c-a88d-4061-835d-2c1f40aaf4ed",
        taskStatusName: "Delayed",
        taskTypeId: "3a84e838-7950-4203-a1d3-e118f5b8e290",
        taskTypeName: "Owner Task",
        createdByEmployee: {
          employeeId: "d2a87068-abb7-45b3-bf69-d6fc426cc827",
          employeeName: "Unknown",
        },
        assignees: [
          {
            employeeId: "02d5cbb0-4ab9-452d-aec2-f886b3fbe608",
            employeeName: "Parth Gadhiya",
          },
          {
            employeeId: "02afc708-d586-4584-b729-aa320adb78d5",
            employeeName: "Pritesh",
          },
          {
            employeeId: "564d96db-8ccb-471c-9626-3880a168abc6",
            employeeName: "Jay Joshi",
          },
          {
            employeeId: "bc1b2738-3319-4ac4-aaad-72ddca128cb1",
            employeeName: "Rahul",
          },
          {
            employeeId: "bf8d3f0e-5c3e-414d-b834-6df3c6044a76",
            employeeName: "Vipul Rajgor",
          },
        ],
      },
    ],
  };

  const columnToggleOptions = [
    { key: "srNo", label: "Sr No", visible: true },
    { key: "taskName", label: "Task Name", visible: true },
    { key: "taskDescription", label: "Task Description", visible: true },
    { key: "taskStartDate", label: "Task Start Date", visible: true },
    { key: "taskDeadline", label: "Task End Date", visible: true },
    { key: "taskStatusName", label: "Task Status", visible: true },
    { key: "taskTypeName", label: "Task Type", visible: true },
  ];

  const visibleColumns = columnToggleOptions.reduce(
    (acc, col) => {
      if (col.visible) acc[col.key] = col.label;
      return acc;
    },
    {} as Record<string, string>,
  );

  const filteredTaskData = useMemo(() => {
    let filtered = taskData.data;

    // Apply date range filter if selected
    if (selectedDateRange?.from) {
      filtered = filtered.filter((task) => {
        if (!task.taskDeadline) return false;

        const deadlineDate = parseISO(task.taskDeadline);
        const startDate = task.taskStartDate
          ? parseISO(task.taskStartDate)
          : null;
        const endDate = task.taskActualEndDate
          ? parseISO(task.taskActualEndDate)
          : null;

        // Check if any of the dates fall within the selected range
        const isDeadlineInRange = isWithinInterval(deadlineDate, {
          start: selectedDateRange.from!,
          end: selectedDateRange.to || selectedDateRange.from!,
        });

        const isStartDateInRange = startDate
          ? isWithinInterval(startDate, {
              start: selectedDateRange.from!,
              end: selectedDateRange.to || selectedDateRange.from!,
            })
          : false;

        const isEndDateInRange = endDate
          ? isWithinInterval(endDate, {
              start: selectedDateRange.from!,
              end: selectedDateRange.to || selectedDateRange.from!,
            })
          : false;

        return isDeadlineInRange || isStartDateInRange || isEndDateInRange;
      });
    }

    // Apply status filter if selected
    if (filters.taskStatusName?.length) {
      filtered = filtered.filter((task) =>
        filters.taskStatusName.includes(task.taskStatusName),
      );
    }

    return filtered;
  }, [selectedDateRange, taskData.data, filters.taskStatusName]);

  const filterOptions = useMemo(() => {
    const statusOptions = Array.from(
      new Set(taskData.data.map((task) => task.taskStatusName)),
    ).map((status) => ({
      label: status,
      value: status,
      count: filteredTaskData.filter((task) => task.taskStatusName === status)
        .length,
    }));

    return {
      taskStatusName: statusOptions,
    };
  }, [filteredTaskData, taskData.data]);

  const handleFilterChange = (col: string, selected: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [col]: selected,
    }));
  };

  return {
    taskData,
    visibleColumns,
    setSelectedDateRange,
    filteredTaskData,
    filterOptions,
    handleFilterChange,
    filters,
  };
}
