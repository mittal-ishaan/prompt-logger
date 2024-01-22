import classNames from "classnames";
import React, { useState, useMemo, useEffect, useContext } from "react";
import HomeContext, {HomeContextType} from "@/context/HomeContext";
import CollapsIcon from "./icons/CollapseIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const { auth, setauth, activeConversation, setActiveConversation, model, setModel } = useContext<HomeContextType>(HomeContext);
  const [conversation, setConversation] = useState<any>(null);
  const [newConversation, setNewConversation] = useState<string>("");

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-gray-800 flex justify-between flex-col overflow-y-auto",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "rounded bg-light absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );

  const getNavItemClasses = (con: { ConversationId?: string; userId?: string; ConversationName?: string; }) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-gray-600"]: activeConversation === con.ConversationId,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const getConversations = async () => {
    const token =  Cookies.get('access_token');
    if(!token){
      return false;
    }
    const response = await fetch(`http://localhost:8000/conversations`, {
      method : 'GET',
      headers: {
        "authorization": `Bearer ${token}`,
      }
    });
    const data = await response.json();
    setConversation(data);
  }

  useEffect(() => {
    getConversations();
  }, []);

  const handleNewConversation = async () => {
    const token =  Cookies.get('access_token');
    const response = await fetch(`http://localhost:8000/conversations`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        conversationName: newConversation
      })
    });
    getConversations();
    setActiveConversation(response);
    setNewConversation("");
  }


  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
      <div className="mb-2">
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
          <div className="flex items-center gap-4">
            <span
              className={classNames("flex items-center bg-gray-100 dark:bg-gray-800 mt-auto", {
                hidden: toggleCollapse,
              })}
            >
          <Input className="flex-1 mr-2" placeholder="New Conversation" value={newConversation} onChange={(e) => setNewConversation(e.target.value)} />
            <Button type="submit" onClick={handleNewConversation}>
              Enter
            </Button>
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-4">
            {conversation && conversation.map(({ ...con }) => {
            const classes = getNavItemClasses(con);
            return (
              <div className={classes} key={con.ConversationId}>
                <button
                onClick={() => setActiveConversation(con.ConversationId)}
                className="flex py-4 px-3 items-center w-full h-full"
                >
                {!toggleCollapse && (
                    <span
                    className={classNames(
                        "text-md font-medium text-text-light"
                    )}
                    >
                    {con.ConversationName}
                    </span>
                )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;