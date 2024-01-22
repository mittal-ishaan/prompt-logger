import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import HomeContext, { HomeContextType } from '@/context/HomeContext'
import Sidebar from "@/components/sidebar"
import Cookies from "js-cookie";
import toast from "react-hot-toast"

export function Chat() {
  const { activeConversation, model, auth } = useContext<HomeContextType>(HomeContext);
  const [chat, setChat] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const getChat = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) return false;
    if (!activeConversation) {
      setChat([]);
      return false;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        conversationId: activeConversation
      })
    });
    const data = await response.json();
    console.log(data);
    setChat(data.chats);
  }, [activeConversation]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeConversation) {
      toast.error("Please select a conversation first or create a new one");
      return;
    }
    const obj = {
      "conversationId": activeConversation,
      "content": inputValue,
      "model": model
    }
    const token = Cookies.get('access_token');
    setInputValue('');
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/openAI`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    if(response.ok){
      toast.success("Response generated Successfully");
    }
    else{
      toast.error("Response generation failed");
    }
    getChat();
    setLoading(false);
  }, [activeConversation, inputValue, model, getChat]);

  useEffect(() => {
    getChat();
  }, [getChat]);

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    (endOfMessagesRef.current as HTMLElement | null)?.scrollIntoView({ behavior: 'smooth' });
  }, [loading,chat]);

  const handleToggleNavbar = useCallback(() => {
    setIsNavbarVisible((prevState) => !prevState);
  }, []);

  return (
    <div className="h-[100%] flex flex-row justify-start">
      <Sidebar />
      <div className="bg-primary flex-1 text-white overflow-y-scroll h-[100%]">
        <div className="flex flex-col h-full">
          {chat && chat.length > 0 && chat.map((c: any) => (
            <main key={c.ChatId} className="p-4 space-y-4">
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
          <div ref={endOfMessagesRef} />
          {loading && 
          <div className="mb-2 p-2 mx-auto rounded-md bg-gray-100 dark:bg-gray-800">
            <p>Generating</p>
          </div>}
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


