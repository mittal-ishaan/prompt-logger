
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsiveLine } from "@nivo/line"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { JSX, SVGProps, useState, useEffect } from "react"
import HomeContext, { HomeContextType } from "@/context/HomeContext"
import { useContext } from "react"
import { use } from "passport"

export default function DashStat() {
  const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
  const [data, setData ] = useState<any>([]);

  useEffect(() => {
    if(auth) {
    const response = fetch(`http://localhost:8000/stats?userId=${auth.userId}`, {
      method : 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => response.json())
    .then(data => {
      setData(data);
    })
    console.log(data);
  }
  } , [auth]);
  return (
    
    <div className="flex flex-col w-full">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">General Statistics</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{data["no of requests"]}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requests in the last month</p>
                </CardContent>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{data["avg latency"]}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average Latency</p>
                </CardContent>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{data["p95 latency"]}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">P95 Latency</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Average Token Statistics</CardTitle>
                  <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{data["total input tokens"]}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Input Tokens per Requests</p>
                </CardContent>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{data["total output tokens"]}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completion Tokens per Requests</p>
                </CardContent>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{data["total tokens"]}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Tokens per Requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Number of Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart className="w-full aspect-[4/3]" data={data}/>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Latency and number of Failures</CardTitle>
                  <UserCheckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <LineChart className="w-full aspect-[4/3]" data={data} />
                </CardContent>
              </Card>
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </main>
    </div>
)
}

function BarChart(props : any) {
  const [chartData,setchartData] = useState<any>([]);
  useEffect(() => {
    console.log(props);
    if(props.data["days"]) {
      console.log(props);
      const days: string[] = props.data["days"];
      const chartData = days.map((day: string) => ({
        name: day,
        count: props.data[day]["no of requests"]
      }));
      setchartData(chartData);
    }
  }
  , [props]);
  if(!props) {
    return <p>No data available</p>
  }

  return (
    <div {...props}>
      {chartData &&
      <ResponsiveBar
      data={chartData}
      keys={["count"]}
      indexBy="name"
      margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
      padding={0.3}
      colors={["#2563eb"]}
      axisBottom={{
        tickSize: 0,
        tickPadding: 16,
      }}
      axisLeft={{
        tickSize: 0,
        tickValues: 4,
        tickPadding: 16,
      }}
      gridYValues={4}
      theme={{
        tooltip: {
          chip: {
            borderRadius: "9999px",
          },
          container: {
            fontSize: "12px",
            textTransform: "capitalize",
            borderRadius: "6px",
          },
        },
        grid: {
          line: {
            stroke: "#f3f4f6",
          },
        },
      }}
      tooltipLabel={({ id}) => `${id}`}
      enableLabel={false}
      role="application"
      ariaLabel="A bar chart showing data"
    />
    }
    </div>
  )
}



function LineChart(props: any) {
  const [latencyData,setlatencyData] = useState<any>([]);
  const [failureData,setfailureData] = useState<any>([]);
  useEffect(() => {
    if(props.data["days"]) {
      const days: string[] = props.data["days"];
      const failureData = days.map((day: string) => ({
        x: day,
        y: props.data[day]["total failures"]
      }));
      setfailureData(failureData);
      const latencyData = days.map((day: string) => ({
        x: day,
        y: props.data[day]["avg latency"]
      }));
      setlatencyData(latencyData);
    }
  }
  , [props]);
  if(!props) {
    return <p>No data available</p>
  }

  useEffect(() => {
    console.log(latencyData);
  } , [latencyData]);
  return (

    <div {...props}>
      { latencyData && failureData &&
      <ResponsiveLine
      data={[
        {
          id: "Latency",
          data: latencyData,
        },
        {
          id: "Failure",
          data: failureData,
        },
      ]}
      margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
      xScale={{
        type: "point",
      }}
      yScale={{
        type: "linear",
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 16,
      }}
      axisLeft={{
        tickSize: 0,
        tickValues: 5,
        tickPadding: 16,
      }}
      colors={["#2563eb", "#e11d48"]}
      pointSize={6}
      useMesh={true}
      gridYValues={6}
      theme={{
        tooltip: {
          chip: {
            borderRadius: "9999px",
          },
          container: {
            fontSize: "12px",
            textTransform: "capitalize",
            borderRadius: "6px",
          },
        },
        grid: {
          line: {
            stroke: "#f3f4f6",
          },
        },
      }}
      role="application"
    />
      }
    </div>
  )
}


function Package2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function UserCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
