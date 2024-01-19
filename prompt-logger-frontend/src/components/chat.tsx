import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContext, useEffect, useState } from "react"
import HomeContext from '@/context/HomeContext'
import Sidebar from "@/components/sidebar"

type HomeContextType = {
  auth: any;
  setauth: any;
  activeConversation: any;
  setActiveConversation: any;
};

export function Chat() {
  const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
  const [chat, setChat] = useState(new Array());
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const getChat = async () => {
    if(!activeConversation) return false;
    const response = await fetch(`http://localhost:8000/chats`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: activeConversation
      })
    });
    const data = await response.json();
    setChat(data.chats);
    console.log(data.chats);
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const obj = {
      "conversationId": activeConversation,
      "content": inputValue,
      "model": "gpt-3.5-turbo"
    }
    setInputValue('');
    setLoading(true);
    const response = await fetch(`http://localhost:8000/openAI`, {
      method : 'POST',
      body: JSON.stringify(obj),
      headers: {
        // 'Authorization': `Bearer ${auth.access_token}`
        'Content-Type': 'application/json'
      },
    });
    getChat();
    setLoading(false);
  }

  useEffect(() => {
    getChat();
  }, [activeConversation]);

  return (
    <div className="h-screen flex flex-row justify-start">
      {/* <div className="grid-col-3"> */}
    <Sidebar />
    <div className="bg-primary flex-1 text-white overflow-y-scroll">
    <div className="flex flex-col min-h-screen">
      {chat && chat.length>0 && chat.map((c: any) => (
        <main className="p-4 space-y-4">
        <div className="flex items-end space-x-2">
          <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <p>{c.Request}</p>
          </div>
        </div>
        <div className="flex items-end space-x-2 justify-end">
          <div className="p-2 rounded-md bg-blue-500 text-white">
            <p>{c.Response}</p>
          </div>
        </div>
      </main>
      ))}
      {loading && <div className="flex items-center justify-center h-full"> <p>Loading...</p> </div>}
        <form onSubmit={handleSubmit} className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 sticky bottom-0 mt-auto">
        <Input className="flex-1 mr-2" placeholder="Type your message here" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button type="submit" disabled={loading}>
          Enter
        </Button>
        </form>
      </div>
    </div>
    </div>
  )
}


