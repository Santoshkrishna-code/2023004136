import React from "react";

function getTypeWeight(type) {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
}

function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const byWeight = getTypeWeight(b.type) - getTypeWeight(a.type);
    if (byWeight !== 0) return byWeight;

    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
}

export default function PriorityInboxPage({ notifications }) {
  const topItems = sortByPriority(notifications).slice(0, 10);

  if (!topItems.length) {
    return <p className="empty">No notifications available for priority inbox.</p>;
  }

  return (
    <section className="list">
      {topItems.map((item, idx) => (
        <article className="row" key={item.id}>
          <div>
            <strong>#{idx + 1}</strong> {item.title}
            <p>{item.message}</p>
          </div>
          <div className="row-meta">
            <span className={`tag tag-${item.type.toLowerCase()}`}>{item.type}</span>
            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
