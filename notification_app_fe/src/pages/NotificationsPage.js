import React from "react";

function NotificationCard({ item }) {
  return (
    <article className="card">
      <div className="card-header">
        <span className={`tag tag-${item.type.toLowerCase()}`}>{item.type}</span>
        <span className={`status ${item.isRead ? "read" : "unread"}`}>
          {item.isRead ? "Read" : "Unread"}
        </span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.message}</p>
      <small>{new Date(item.createdAt).toLocaleString()}</small>
    </article>
  );
}

export default function NotificationsPage({ notifications }) {
  if (!notifications.length) {
    return <p className="empty">No notifications match this filter.</p>;
  }

  return (
    <section className="grid">
      {notifications.map((item) => (
        <NotificationCard key={item.id} item={item} />
      ))}
    </section>
  );
}
