use data

db.full_reviews.aggregate([{$project:{_id:false, "reviewTime":"$reviewTime"}}, {$sort: {"reviewTime":-1}}], {"allowDiskUse" : true})

// the number between overall ratings and number of reviews between spam and non-spam reviews
db.separate_reviews.aggregate({$group:
  {_id: {"label":"$label", "cat":"$category"}, 
      avg_score:{$avg:"$overall"}, 
      count_reviews: {$sum:1}}},
  {$project: 
      {"spam":"$_id.label", "cat": "$_id.cat", 
          "count_reviews":"$count_reviews", 
          "avg_rating": "$avg_score", 
          "_id":false}},
  {$sort: {"cat":1, "spam":1}})

db.separate_reviews.aggregate({$group: {_id: "$category", total_per_cat: {$sum:1}}})
db.separate_reviews.count()

db.separate_reviews.aggregate({$group: {_id: "$label", spam:{$sum:1}}},
                              {$project: {"labels": "$_id", "count_spam": "$spam", "_id":false }})
                              
                              
                            
db.separate_reviews.findOne()

db.separate_reviews.aggregate({$match:{"label":1}},
                             {$project: {"helpful_score": {$divide: [{$arrayElemAt: ["$helpful", 0]}, {$arrayElemAt: ["$helpful", 1]}]}}})
                             

                             
// how many spam messages per reviewer ID                             
db.separate_reviews.aggregate({$match:{"label":1}},
                              {$group: {_id: "$reviewerID", count:{$sum:1}}},
                              {$sort: {count:-1}})   
// how many non-spam messages per reviewer ID                                 
db.separate_reviews.aggregate([{$match:{"label":0}},
                              {$group: {_id: "$reviewerID", count:{$sum:1}}},
                              {$sort: {count:-1}}],
                              {"allowDiskUse" : true})                

// ratio of spam reviews that were thought as helpful                          
db.separate_reviews.aggregate({$match:{"label":1}},
                              {$group: {_id: "$asin", num_helpful:{$sum:{$arrayElemAt: ["$helpful", 0]}}, 
                                  total_helpful: {$sum:{$arrayElemAt: ["$helpful", 1]}}}},
                              {$sort: {num_helpful:-1}})  





