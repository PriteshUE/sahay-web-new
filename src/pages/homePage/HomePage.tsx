import TableData from "@/components/shared/DataTable/DataTable";
import DateRangePicker from "@/components/shared/DateRange/dateRanglePicker";
import useTask from "./useTask";
import DropdownSearchMenu from "@/components/shared/DropdownSearchMenu/DropdownSearchMenu";

export default function HomePage() {
  const {
    visibleColumns,
    setSelectedDateRange,
    filteredTaskData,
    filterOptions,
    handleFilterChange,
    filters,
  } = useTask();

  return (
    <div>
      <p>Home Screen</p>
      <div className="flex gap-4">
        <div className="z-10 relative">
          <DateRangePicker onChange={setSelectedDateRange} />
        </div>
        <div>
          <DropdownSearchMenu
            label="Status"
            options={filterOptions.taskStatusName || []}
            selected={filters.taskStatusName || []}
            onChange={(selected) =>
              handleFilterChange("taskStatusName", selected)
            }
            multiSelect
            showCount
          />
        </div>
      </div>

      <div className="mt-3 bg-white py-2 tb:py-4 tb:mt-6">
        <TableData
          tableData={filteredTaskData.map((item, index) => ({
            ...item,
            srNo: index + 1,
          }))}
          columns={visibleColumns}
          primaryKey="taskId"
          permissionKey="marketing"
          localStorageId="countryList"
        />
      </div>
    </div>
  );
}
