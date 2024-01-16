import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export function Dashboard() {
  return (
    <div className="bg-white p-6">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button className="text-xs" variant="outline">
            24H
          </Button>
          <Button className="text-xs" variant="outline">
            7D
          </Button>
          <Button className="text-xs" variant="outline">
            1M
          </Button>
          <Button className="text-xs" variant="outline">
            3M
          </Button>
          <Button className="text-xs" variant="outline">
            All
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button className="text-xs" variant="outline">
            Hide Filters
          </Button>
          <Button className="text-xs" variant="outline">
            View (13)
          </Button>
          <Button className="text-xs" variant="outline">
            Export
          </Button>
          <Button className="text-xs" variant="outline">
            Clear All
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <Select>
            <SelectTrigger id="model">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="gp3-t5-turbo-16k">gp3-t5-turbo-16k</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
          <Button className="text-xs" variant="outline">
            + Add Filter
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto h-screen">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request #</TableHead>
              <TableHead>Response #</TableHead>
              <TableHead>Model #</TableHead>
              <TableHead>Total Tokens #</TableHead>
              <TableHead>Prompt Tokens #</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>October 23 20:29 AM</TableCell>
              <TableCell>Success</TableCell>
              <TableCell>I will now go direct...</TableCell>
              <TableCell>While it is true that...</TableCell>
              <TableCell>gp3-t5-turbo-16k-0613</TableCell>
              <TableCell>653</TableCell>
              <TableCell>521</TableCell>
              <TableCell>132</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
