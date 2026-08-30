
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { api } from "../../utils/api";

import "./AdminMessages.css";


/* =========================================================
   ADMIN MESSAGES
========================================================= */

export default function AdminMessages() {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");


  /* =========================================================
     LOAD MESSAGES
  ========================================================= */

  const fetchMessages = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await api("/messages");


      if (Array.isArray(data)) {

        setMessages(data);

      } else if (
        Array.isArray(data?.messages)
      ) {

        setMessages(
          data.messages
        );

      } else if (
        Array.isArray(data?.data)
      ) {

        setMessages(
          data.data
        );

      } else {

        setMessages([]);

      }

    } catch (err) {

      console.error(
        "Messages error:",
        err
      );


      setError(
        err.message ||
        "Unable to load messages."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    fetchMessages();

  }, []);


  /* =========================================================
     FILTER MESSAGES
  ========================================================= */

  const filteredMessages =
    useMemo(() => {

      return messages.filter(
        (message) => {

          const searchValue =
            search
              .toLowerCase()
              .trim();


          const matchesSearch =
            !searchValue ||

            message.name
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||

            message.email
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||

            message.subject
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||

            message.message
              ?.toLowerCase()
              .includes(
                searchValue
              );


          const isRead =
            message.read === true ||
            message.status === "read";


          const matchesFilter =
            filter === "all" ||

            (
              filter === "unread" &&
              !isRead
            ) ||

            (
              filter === "read" &&
              isRead
            );


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      messages,
      search,
      filter,
    ]);


  /* =========================================================
     UNREAD COUNT
  ========================================================= */

  const unreadCount =
    messages.filter(
      (message) =>
        message.read !== true &&
        message.status !== "read"
    ).length;


  /* =========================================================
     MARK AS READ
  ========================================================= */

  const markAsRead =
    async (message) => {

      if (
        message.read === true ||
        message.status === "read"
      ) {

        return;

      }


      try {

        await api(
          `/messages/${message._id}/read`,
          {
            method: "PATCH",
          }
        );


        setMessages(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                message._id
                  ? {
                      ...item,
                      read: true,
                      status: "read",
                    }
                  : item
            )
        );

      } catch (err) {

        console.error(
          "Mark read error:",
          err
        );


        /*
          Update the interface locally.
        */

        setMessages(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                message._id
                  ? {
                      ...item,
                      read: true,
                    }
                  : item
            )
        );

      }

    };


  /* =========================================================
     DELETE MESSAGE
  ========================================================= */

  const deleteMessage =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this message?"
        );


      if (!confirmed) {

        return;

      }


      try {

        await api(
          `/messages/${id}`,
          {
            method: "DELETE",
          }
        );


        setMessages(
          (current) =>
            current.filter(
              (message) =>
                message._id !== id
            )
        );

      } catch (err) {

        console.error(
          "Delete message error:",
          err
        );


        alert(
          err.message ||
          "Failed to delete message."
        );

      }

    };


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate =
    (date) => {

      if (!date) {

        return "—";

      }


      const parsed =
        new Date(date);


      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {

        return "—";

      }


      return parsed.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="admin-messages-page">


      {/* HEADER */}

      <div className="messages-page-header">

        <div>

          <p className="messages-eyebrow">
            COMMUNICATION
          </p>

          <h1>
            Communication Center
          </h1>

          <p className="messages-subtitle">
            Manage messages and enquiries
            submitted through the REHEMA
            Foundation website.
          </p>

        </div>


        <button
          type="button"
          className="messages-refresh-button"
          onClick={fetchMessages}
          disabled={loading}
        >

          ↻{" "}

          {loading
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* STATISTICS */}

      <div className="messages-stat-grid">

        <div className="message-stat-card">

          <span>
            Total Messages
          </span>

          <strong>
            {messages.length}
          </strong>

        </div>


        <div className="message-stat-card unread">

          <span>
            Unread
          </span>

          <strong>
            {unreadCount}
          </strong>

        </div>


        <div className="message-stat-card">

          <span>
            Read
          </span>

          <strong>
            {messages.length -
              unreadCount}
          </strong>

        </div>

      </div>


      {/* TOOLBAR */}

      <div className="messages-toolbar">

        <div className="message-search">

          <span>
            ⌕
          </span>


          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />


          {search && (

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>

          )}

        </div>


        <select
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All messages
          </option>

          <option value="unread">
            Unread
          </option>

          <option value="read">
            Read
          </option>

        </select>

      </div>


      {/* ERROR */}

      {error && (

        <div className="messages-error">

          <strong>
            Unable to load messages
          </strong>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchMessages}
          >
            Try again
          </button>

        </div>

      )}


      {/* MESSAGES CARD */}

      <div className="messages-card">

        <div className="messages-card-header">

          <div>

            <h2>
              Messages
            </h2>

            <span>

              {filteredMessages.length}{" "}

              {filteredMessages.length === 1
                ? "message"
                : "messages"}

            </span>

          </div>

        </div>


        {loading ? (

          <div className="messages-empty">

            <div className="messages-spinner" />

            <p>
              Loading messages...
            </p>

          </div>

        ) : filteredMessages.length === 0 ? (

          <div className="messages-empty">

            <div className="messages-empty-icon">
              ✉
            </div>

            <h3>
              No messages found
            </h3>

            <p>

              {search ||
              filter !== "all"

                ? "Try adjusting your search or filter."

                : "Messages submitted through the website will appear here."}

            </p>

          </div>

        ) : (

          <div className="messages-list">

            {filteredMessages.map(
              (message) => {

                const isUnread =
                  message.read !== true &&
                  message.status !== "read";


                return (

                  <div
                    key={message._id}
                    className={`message-row ${
                      isUnread
                        ? "unread"
                        : ""
                    }`}
                  >

                    <div className="message-avatar">

                      {(message.name ||
                        "V")
                        .charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="message-main">

                      <div className="message-top">

                        <strong>
                          {message.name ||
                            "Visitor"}
                        </strong>


                        {isUnread && (

                          <span className="unread-badge">
                            NEW
                          </span>

                        )}

                      </div>


                      <span className="message-email">

                        {message.email ||
                          "No email"}

                      </span>


                      <h3>

                        {message.subject ||
                          "Website enquiry"}

                      </h3>


                      <p>

                        {message.message ||
                          "No message content."}

                      </p>

                    </div>


                    <div className="message-meta">

                      <span>

                        {formatDate(
                          message.createdAt
                        )}

                      </span>


                      <div className="message-actions">

                        <Link
                          to={`/admin/messages/${message._id}`}
                          className="message-view-button"
                          onClick={() =>
                            markAsRead(
                              message
                            )
                          }
                        >
                          View
                        </Link>


                        <button
                          type="button"
                          className="message-delete-button"
                          onClick={() =>
                            deleteMessage(
                              message._id
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

}