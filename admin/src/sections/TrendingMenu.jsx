import React from 'react'

const TrendingMenu = () => {
 const items = [ {title:'Neapolitan Pizza', price:'$5.6', sales:89}, {title:'Margherita Pizza', price:'$8.4', sales:59} ]
return (
<div className="bg-white p-6 rounded-2xl shadow">
<h2 className="text-xl font-semibold mb-4">Daily Trending Menus</h2>
<div className="space-y-3">
{items.map((it,idx)=> (
<div key={idx} className="flex justify-between items-center">
<div>
<p className="font-medium">{it.title}</p>
<p className="text-sm text-gray-500">{it.sales} sales</p>
</div>
<div className="font-bold">{it.price}</div>
</div>
))}
</div>
</div>
  )
}

export default TrendingMenu
