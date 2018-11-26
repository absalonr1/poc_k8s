db.subscriberResources.find()
db.account.find()
db.subscriber.find()

db.subscriberResources.drop()

db.account.aggregate([

      {
        $match: {
          _id: 1
        }
      },
      {       
       $lookup:
         {
           from: "subscriber",
           localField: "_id",
           foreignField: "accountId",
           as: "accountSubscribers"
         }
     }
])


for (i=0; i<5; i++) {

	db.account.insertOne(
		{
		  "_id":i,
			"rut": i,
		    "accountId": i,
		    "accountIdHigh": "string",
		    "csLevel": "string",
		    "custCode": "string",
		    "accountType": "string",
		    "accountActivate": "2018-10-08T11:45:06.040Z",
		    "accountDeactivate": "2018-10-08T11:45:06.040Z",
		    "externalAccountId": "string",
		    "state": "string",
		    "docTypeId": "string",
		    "docTypeDesc": "string",
		    "docTypeOutputCode": "string",
		    "billCycle": {
		      "accountId": "string",
		      "billCycle": "string",
		      "intervalType": "string",
		      "lastRunDate": "2018-10-08T11:45:06.040Z",
		      "bchRunDate": "2018-10-08T11:45:06.040Z"
		    }
		}
	);

	db.subscriber.insertOne(
		  {
			"_id":i,
			"rut": i,
			"accountId": i,
			"subscriberId": i,
			"subscriberType": "string",
			"subscriberIdContract": "string",
			"subscriberActivate": "2018-10-08T11:45:06.040Z",
			"subscriberExpired": "2018-10-08T11:45:06.040Z",
			"state": "string"
		}
	);

	 db.subscriberResources.insertOne(
		  {
		"_id":i,
		    "subscriberId": i,
		    "resourceId": "string",
		    "resource": "MSISDN-"+i,
		    "resourceDescription": "string",
		    "resourceActivate": "2018-10-08T11:45:06.040Z",
		    "resourceDeactivate": "2018-10-08T11:45:06.040Z",
		    "resourceState": "string",
		    "resourceType": "MSISDN"
		  }
	);
 }

for (i=0; i<1; i++) {
    db.test.insertOne(
         {
              "i" :\u0022+i+\u0022
              "username" : "user"+i,
              "age" : Math.floor(Math.random()*120),
              "created" : new Date()
         }

     );
}
