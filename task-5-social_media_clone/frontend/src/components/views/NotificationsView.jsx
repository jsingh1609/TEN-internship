import React from 'react';

export default function NotificationsView() {
  return (
    <div className="w-full max-w-[500px] mx-auto pt-4 md:pt-8 px-4 animate-slide-up-fade pb-20">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="space-y-4">
        <div className="font-semibold text-base mb-2">Today</div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-900 p-2 rounded-lg transition-colors -mx-2 bg-white/5 border border-white/5">
          <img src="https://picsum.photos/seed/10/50/50" className="w-11 h-11 rounded-full" alt="user" />
          <div className="flex-1 text-sm"><span className="font-semibold">django_masters</span> liked your post. <span className="text-neutral-500">2h</span></div>
          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop" className="w-11 h-11 object-cover rounded" alt="post" />
        </div>

        <div className="font-semibold text-base mt-6 mb-2">This Week</div>
        {[
          { user: 'react.devs', action: 'started following you.', time: '2d', type: 'follow' },
          { user: 'design_inspo', action: 'mentioned you in a comment: "@intern_vibecode check this out!"', time: '4d', type: 'post' },
          { user: 'python_dev', action: 'started following you.', time: '5d', type: 'follow' },
        ].map((notif, i) => (
          <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-900 p-2 rounded-lg transition-colors -mx-2">
            <img src={`https://picsum.photos/seed/${i + 20}/50/50`} className="w-11 h-11 rounded-full" alt="user" />
            <div className="flex-1 text-sm leading-tight"><span className="font-semibold">{notif.user}</span> {notif.action} <span className="text-neutral-500">{notif.time}</span></div>
            {notif.type === 'follow' ?
              <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors border border-white/10">Following</button> :
              <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=500&auto=format&fit=crop" className="w-11 h-11 object-cover rounded" alt="post" />
            }
          </div>
        ))}
      </div>
    </div>
  );
}
