var c = db.contract.aggregate([{
    $match: {
      CUSTOMER_ID:18492
    }
  },
  {
    $lookup: {
      from: "customer",
      localField: "CUSTOMER_ID",
      foreignField: "_id",
      as: "customers"
    }
  },
  {
    $project: {
      CUSTOMER_ID: "$CUSTOMER_ID",
      CO_ID: "$_id",
      CUSTOMER: "$customers"
    }
  }
]);
