var casos = ["A","D"]
var agg = function(A){
	var f1 = ISODate().getTime()
	var cursor = db.orders.aggregate([
             { $match: { status: A } },
             { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
             { $sort: { total: -1 } }
           ])
	var f2 = ISODate().getTime()
	print("Duracion de ["+ A + "]: "+(f2-f1) / 1000)
	return cursor
}
casos.forEach(function(element) {
  agg(element).forEach(printjson);
});
