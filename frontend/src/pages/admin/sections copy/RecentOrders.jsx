import React from 'react'

const RecentOrders = () => {
 const orders = [ {name:'Cheese Margherita Pizza', customer:'Jimmy', price:'7.2', status:'PENDING'}, {name:'Veg Hakka Noodles', customer:'Rick', price:'6.2', status:'DELIVERED'} ]
return (
<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-xl font-semibold mb-4">Recent Order Request</h2>
<div className="space-y-4">
{orders.map((o,i)=> (
<div key={i} className="flex items-center justify-between">
<div>
<p className="font-medium">{o.name}</p>
<p className="text-sm text-gray-500">{o.customer}</p>
</div>
<div className="text-right">
<p className="font-bold">${o.price}</p>
<p className="text-sm">{o.status}</p>
</div>
</div>
))}
</div>
</div>
  )
}

export default RecentOrders
