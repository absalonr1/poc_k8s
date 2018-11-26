
db.products.update({_id: 5bb645bbaab3eed99fca9917},
  {
    $set: {
      "name": "absalon",
      ratings_total: total
    },
    $inc: {
      total_reviews: 1
    }
  })

  db.test.update({_id: ObjectId("5bb645bbaab3eed99fca9917") },
    {
      $set: {
        "name": "absalon",
        "version": 1
      }
    })
