import classNames from "classnames";
import React, { useState, useMemo, useEffect, useContext, useCallback } from "react";
import HomeContext, {HomeContextType} from "@/context/HomeContext";
import CollapsIcon from "./icons/CollapseIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(true);
  const { auth, setauth, activeConversation, setActiveConversation, model, setModel } = useContext<HomeContextType>(HomeContext);
  const [conversation, setConversation] = useState<any>(null);
  const [newConversation, setNewConversation] = useState<string>("");
  const router = useRouter();

  const getConversations = useCallback(async () => {
    const token =  Cookies.get('access_token');
    if(!token){
      router.push("/login");
      return false;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
      method : 'GET',
      headers: {
        "authorization": `Bearer ${token}`,
      }
    });
    if(!response.ok){
      router.push("/login");
      toast.error("Please login again");
      return false;
    }
    const data = await response.json();
    setConversation(data);
  }, []);

  useEffect(() => {
    getConversations();
  }, []);

  const handleNewConversation = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token =  Cookies.get('access_token');
    if(!token){
      router.push("/login");
      return;
    }
    if(!newConversation || newConversation === ""){
      toast.error("Please enter a conversation name");
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        conversationName: newConversation
      })
    });
    if(!response.ok){
      router.push("/login");
      toast.error("Please login again");
      return;
    }
    getConversations();
    setActiveConversation(response);
    setNewConversation("");
  }, [getConversations, newConversation, router, setActiveConversation]);

  const wrapperClasses = useMemo(() =>
    classNames(
      "h-[100%] px-4 pt-8 pb-4 bg-gray-800 flex justify-between flex-col overflow-y-auto",
      {
        ["w-80"]: !toggleCollapse,
        ["w-20"]: toggleCollapse,
      }
    ),
    [toggleCollapse]
  );

  const collapseIconClasses = useMemo(() =>
    classNames(
      "rounded bg-light absolute right-0",
      {
        "rotate-180": toggleCollapse,
      }
    ),
    [toggleCollapse]
  );

  const getNavItemClasses = useMemo(() => (con: { ConversationId?: string; userId?: string; ConversationName?: string; }) =>
    classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-gray-600"]: activeConversation === con.ConversationId,
      }
    ),
    [activeConversation]
  );


  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}

      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className={classNames("mb-2", {
                hidden: toggleCollapse,
              })}>
          <Select onValueChange={setModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="gpt-3.5-turbo">
                {model}
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
                gpt-3.5-turbo-instruct()
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <form onSubmit={handleNewConversation} 
              className={classNames("flex items-centermt-auto", {
                hidden: toggleCollapse,
              })}
            >
              <Input className="flex-1 mr-2" placeholder="New Conversation" value={newConversation} onChange={(e) => setNewConversation(e.target.value)} />
            </form>
          </div>
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
        </div>
        {!toggleCollapse && (
        <div className="flex flex-col items-start mt-4">
          {conversation && conversation.map(({ ...con }) => {
            const classes = getNavItemClasses(con);
            return (
              <div className={classes} key={con.ConversationId}>
                <button
                  onClick={() => setActiveConversation(con.ConversationId)}
                  className="flex py-4 px-3 items-center w-full h-full"
                >
                    <span
                      className={classNames(
                        "text-md font-medium text-white"
                      )}
                    >
                      {con.ConversationName}
                    </span>
                </button>
              </div>
            );
          })}
        </div>
                          )}
      </div>
    </div>
  );
};

export default Sidebar;
