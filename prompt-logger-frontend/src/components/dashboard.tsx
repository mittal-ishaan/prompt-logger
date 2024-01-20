import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import DashStat from "@/components/dashstats";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import React, { useState, useContext, useEffect } from "react";
import HomeContext, { HomeContextType } from "@/context/HomeContext";


function truncate(str: string, num: number) {
  return str.length > num ? str.substring(0, num) + "..." : str;
}

export function Dashboard() {
  const { auth } = useContext<HomeContextType>(HomeContext);
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [data, setData] = useState<any>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue);
  };

  const handleClear = () => {
    setValue({ startDate: null, endDate: null });
    setSelectedModel(null);
    setSelectedStatus(null);
  };

  const handleSubmit = async () => {
    const body: any = {};
    if (auth) body["userId"] = auth.userId;
    if (value?.startDate) body["dateFrom"] = value?.startDate;
    if(value?.endDate) {
      const date = new Date(new Date(value.endDate).setDate(new Date(value.endDate).getDate() + 1));
      body["dateTo"] = date.toISOString().slice(0,10);
    }
    if(selectedModel) body["model"] = selectedModel;
    if(selectedStatus) body["status"] = selectedStatus;
    const response = await fetch(`http://localhost:8000/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    }).then((data) => {
      setData(data.chats);
    }).catch((error) => {
      console.error('There was a problem with the data processing:', error);
    });
  };

  useEffect(() => {
    if (auth) {
      const response = fetch(`http://localhost:8000/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: auth.userId }),
      }).then((response) => response.json()).then((data) => {
        setData(data.chats);
      });
    }
  }
  , [auth]);


  return (
    <div className="bg-white p-6">
      <DashStat />
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex justify-between grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
          <div className="flex space-x-2 ">
            <Datepicker separator="to" value={value} onChange={handleValueChange} showShortcuts={true} />
          </div>
          <div className="flex space-x-2">
            <Button className="text-xs" variant="outline" type="submit">
              Export
            </Button>
            <Button className="text-xs" variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <Select onValueChange={setSelectedModel}>
              <SelectTrigger id="model">
              <SelectValue placeholder="Model">
                {selectedModel || "Model"}
              </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
              <SelectItem value="gpt-3.5-turbo-1106">
              gpt-3.5-turbo-1106	
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                gpt-3.5-turbo
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo-16k">
                gpt-3.5-turbo-16k
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo-instruct">
                gpt-3.5-turbo-instruct
                </SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
              <SelectValue placeholder="Status">
                {selectedStatus || "Status"}
              </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="200">
                  Success
                </SelectItem>
                <SelectItem value="400">
                  Failure
                </SelectItem>
              </SelectContent>
            </Select>
            <Button className="text-xs" variant="outline" type="submit">
              Submit
            </Button>
            </div>
        </div>
      </form>
      <div className="overflow-x-auto h-screen">
        <Table>
          <TableHeader>
            <TableRow className="sticky">
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request #</TableHead>
              <TableHead>Response #</TableHead>
              <TableHead>Model #</TableHead>
              <TableHead>Total Tokens #</TableHead>
              <TableHead>Prompt Tokens #</TableHead>
              <TableHead>Completion Tokens #</TableHead>
              <TableHead>Latency(in ms) #</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(
              (chat: any) => (
                <TableRow>
                  <TableCell>{chat["CreatedAt"]}</TableCell>
                  <TableCell>{chat["Status"]}</TableCell>
                  <TableCell>{truncate(chat["Request"], 50)}</TableCell>
                  <TableCell>{truncate(chat["Response"], 50)}</TableCell>
                  <TableCell>{chat["Model"]}</TableCell>
                  <TableCell>{chat["TotalTokens"]}</TableCell>
                  <TableCell>{chat["PromptTokens"]}</TableCell>
                  <TableCell>{chat["CompletionTokens"]}</TableCell>
                  <TableCell>{chat["Latency"]}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
