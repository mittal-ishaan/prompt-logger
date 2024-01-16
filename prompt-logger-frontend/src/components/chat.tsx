import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  return (
    <div className="flex flex-col h-screen">
      {/* <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-lg font-bold">Chat App</h1>
        <Button size="icon" variant="ghost">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </header> */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-end space-x-2">
          <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <p>Hello! How can I assist you today?</p>
          </div>
        </div>
        <div className="flex items-end space-x-2 justify-end">
          <div className="p-2 rounded-md bg-blue-500 text-white">
            <p>I need help with my account.</p>
          </div>
        </div>
      </main>
      <footer className="flex items-center p-4 bg-gray-100 dark:bg-gray-800">
        <Input className="flex-1 mr-2" placeholder="Type your message here" />
        <Button type="submit">
          Enter
        </Button>
      </footer>
    </div>
  )
}


function SettingsIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0-2 2v.18a2 1-1 1.73l-.43.25a2 1-2 0l-.15-.08a2 0-2.73.73l-.22.38a2 .73 2.73l.15.1a2 1 1.72v.51a2 1.74l-.15.09a2 0-.73 2.73l.22.38a2 2.73.73l.15-.08a2 0l.43.25a2 1.73V20a2 2h.44a2 2-2v-.18a2 1-1.73l.43-.25a2 0l.15.08a2 2.73-.73l.22-.39a2 0-.73-2.73l-.15-.08a2 1-1-1.74v-.5a2 1-1.74l.15-.09a2 .73-2.73l-.22-.38a2 0-2.73-.73l-.15.08a2 0l-.43-.25a2 1-1-1.73V4a2 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


