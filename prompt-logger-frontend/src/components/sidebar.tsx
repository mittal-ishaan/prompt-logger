import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo, useEffect, useContext } from "react";
import HomeContext from "@/context/HomeContext";


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

    const activeMenu = useMemo(() => {
        if(conversation === null) return null;
        if (conversation) {
            return conversation.find((con: any) => con.ConversationId === activeConversation);
        }
    },[activeConversation, conversation]);

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-light-lighter absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );

  const getNavItemClasses = (con: { conversationId?: string; userId?: string; ConversationName?: string; }) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-light-lighter"]: activeMenu?.conversationId === con.conversationId,
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

  useEffect(() => {
    console.log("active conversation changed");
  }, [activeConversation]);

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            {/* <LogoIcon /> */}
            <span
              className={classNames("mt-2 text-lg font-medium text-text", {
                hidden: toggleCollapse,
              })}
            >
              Logo
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
                hi
              {/* <CollapsIcon /> */}
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
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