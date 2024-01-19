import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo, useEffect, useContext } from "react";
import HomeContext from "@/context/HomeContext";
import CollapsIcon from "./icons/CollapseIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type HomeContextType = {
    auth: any;
    setauth: any;
    activeConversation: any;
    setActiveConversation: any;
  };


const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const { auth, setauth, activeConversation, setActiveConversation } = useContext<HomeContextType>(HomeContext);
  const [conversation, setConversation] = useState(null);
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
    if (!auth) {
      return false;
    }
    const response = await fetch(`http://localhost:8000/conversations?userId=${auth.userId}`, {
      method : 'GET',
    });
    const data = await response.json();
    setConversation(data);
  }

  useEffect(() => {
    getConversations();
  }, [auth]);

  const handleNewConversation = async () => {
    const response = await fetch(`http://localhost:8000/conversations`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: auth.userId,
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
              <div className={classes}>
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