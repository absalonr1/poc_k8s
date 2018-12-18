-- Querie para cargar objeto ACCOUNT y BILLCYLE, por RUT.
select
CUSTOMER_ALL.cscompregno as rut,
CUSTOMER_ALL.CUSTOMER_ID as accountId,
CUSTOMER_ALL.CUSTOMER_ID_HIGH as accountIdHigh,
CUSTOMER_ALL.PAYMNTRESP as paymentResp,
CUSTOMER_ALL.cslevel as csLevel,
CUSTOMER_ALL.CUSTCODE as custCode,
CUSTOMER_ALL.CSTYPE as accountType,
CUSTOMER_ALL.CSACTIVATED as accountActivate,
CUSTOMER_ALL.CSDEACTIVATED as accountDeactivate,
CUSTOMER_ALL.CUSTOMER_ID_EXT as externalAccountId,
CUSTOMER_ALL.CSST as state,
CUSTOMER_ALL.DOCTYPE_ID as docTypeId,
DOCUMENT_TYPE_SII_CODE.DOCTYPE_DESC as docTypeDesc,
DOCUMENT_TYPE_SII_CODE.DOCTYPE_OUTPUT_CODE as docTypeOutputCode,
CUSTOMER_ALL.CUSTOMER_ID as biilcycle_accountId,
BILLCYCLE_DEFINITION.BILLCYCLE as billCycle_billcycle,
BILLCYCLE_DEFINITION.description as billCycle_billcycleDes,
BILLCYCLE_DEFINITION.interval_type as billCycle_intervalType,
BILLCYCLE_DEFINITION.last_run_date as billCycle_lastRunDate,
BILLCYCLE_DEFINITION.bch_run_date as billCycle_bchRunDate
from
sysadm.CUSTOMER_ALL,
sysadm.DOCUMENT_TYPE_SII_CODE,
SYSADM.BILLCYCLE_ASSIGNMENT_HISTORY BAH ,
SYSADM.BILLCYCLE_DEFINITION
where

	CUSTOMER_ALL.cscompregno = '010567335'--variable
and CUSTOMER_ALL.DOCTYPE_ID = DOCUMENT_TYPE_SII_CODE.DOCTYPE_ID
and CUSTOMER_ALL.CUSTOMER_ID = BILLCYCLE_ASSIGNMENT_HISTORY.CUSTOMER_ID
and BILLCYCLE_ASSIGNMENT_HISTORY.billcycle = BILLCYCLE_DEFINITION.billcycle
-- de la vista
and BAH.VALID_FROM IN (...)	-- obtener a priori
and BAH.SEQNO IN (...)		 -- obtener a priori
-- de la vista
AND BILLCYCLE_DEFINITION.APPROVED_IND = 'X'

-- ################################################################################################################################

mongoimport --host localhost --port 27017 --type csv -c bah --headerline BILLCYCLE_ASSIGNMENT_HISTORY.csv
db.bah.createIndex( { "CUSTOMER_ID": 1})

sed -i "1s/CUSTOMER_ID/_id/" CUSTOMER_ALL.csv
mongoimport --host localhost --port 27017 --type csv -c customer_all --headerline CUSTOMER_ALL.csv
db.customer_all.createIndex( { "CSCOMPREGNO": 1})

sed -i "1s/DOCTYPE_ID/_id/" DOCUMENT_TYPE_SII_CODE.csv
mongoimport --host localhost --port 27017 --type csv -c document_type_sii_code --headerline DOCUMENT_TYPE_SII_CODE.csv


sed -i "1s/BILLCYCLE/_id/" BILLCYCLE_DEFINITION.csv
mongoimport --host localhost --port 27017 --type csv -c billcycle_definition --headerline BILLCYCLE_DEFINITION.csv


[ "bah", "billcycle_definition", "customer_all", "document_type_sii_code" ]


-- ################################################################################################################################


-- ----------------------------------------------------------------
WHERE BAH.VALID_FROM IN				

(SELECT MAX (VALID_FROM)				
FROM BILLCYCLE_ASSIGNMENT_HISTORY				
WHERE CUSTOMER_ID = BAH.CUSTOMER_ID AND VALID_FROM <= SYSDATE)				

AND BAH.SEQNO IN				

(SELECT MAX (SEQNO)				
FROM BILLCYCLE_ASSIGNMENT_HISTORY				
WHERE CUSTOMER_ID = BAH.CUSTOMER_ID				
AND VALID_FROM <= SYSDATE);				

------------------------------------------------------------------------------------------------

db.bah.insert({"CUSTOMER_ID" : 10006, "SEQNO" : 1, "BILLCYCLE" : 2, "VALID_FROM" : "14-AUG-09", "REASON_ID" : 1, "USERNAME" : "DMI", "COMMENTS" : "" })
db.bah.insert({"CUSTOMER_ID" : 10006, "SEQNO" : 1, "BILLCYCLE" : 2, "VALID_FROM" : "15-AUG-09", "REASON_ID" : 1, "USERNAME" : "DMI", "COMMENTS" : "" })
db.bah.insert({"CUSTOMER_ID" : 10006, "SEQNO" : 1, "BILLCYCLE" : 2, "VALID_FROM" : "16-AUG-09", "REASON_ID" : 1, "USERNAME" : "DMI", "COMMENTS" : "" })
db.bah.insert({"CUSTOMER_ID" : 10006, "SEQNO" : 1, "BILLCYCLE" : 2, "VALID_FROM" : "19-AUG-09", "REASON_ID" : 1, "USERNAME" : "DMI", "COMMENTS" : "" })
db.bah.insert({"CUSTOMER_ID" : 10006, "SEQNO" : 1, "BILLCYCLE" : 2, "VALID_FROM" : "17-DEC-18", "REASON_ID" : 1, "USERNAME" : "DMI", "COMMENTS" : "" })

db.bah.insert({"CUSTOMER_ID" : 10006, "SEQNO" : 1, "BILLCYCLE" : 2, "VALID_FROM" : "25-DEC-18", "REASON_ID" : 1, "USERNAME" : "DMI", "COMMENTS" : "" })


 -- Current date
var myDateString = Date();

db.bah.find({"CUSTOMER_ID":10006})
db.bah.find({"CUSTOMER_ID":10006, "VALID_FROM": {"$lte": "17-DEC-18"} } )
db.bah.find({"CUSTOMER_ID":10006, "VALID_FROM": {"$lte": "17-DEC-18"} } ).sort({"VALID_FROM":-1}).limit(1).pretty()

db.bah.find({"CUSTOMER_ID":10006}).explain("executionStats")


db.customer_all.find({"CSCOMPREGNO" : 760079790 } ).count()



--------------------------------------------

db.customer_all.find({"_id":10006 } ).pretty()

--------------------------------------------------------------
db.customer_all.aggregate([
  {
    $match: {
      _id:10006
    }
  }
  ,
  {
    $lookup: {
      from: "bah",
      localField: "_id",
      foreignField: "CUSTOMER_ID",
	  as: "join1"
     }
   }
   ,
   {
      $project: {
		"_id":0,
		rut: "$CSCOMPREGNO",
		accountId: "$CUSTOMER_ID",
		accountIdHigh: "$CUSTOMER_ID_HIGH",
		paymentResp: "$PAYMNTRESP",
		csLevel: "$CSLEVEL",
		custCode: "$CUSTCODE",
		accountType: "$CSTYPE",
		accountActivate: "$CSACTIVATED",
		join1: 1
  	  }
   },
]).pretty()

sort({"VALID_FROM":-1}).limit(1)

-- v2
db.customer_all.aggregate([
  {
    $match: {
      _id:10006
    }
  }
  ,
  {
    $lookup: {
      from: "bah",
	  pipeline: [
		{
		  $match: {
			"VALID_FROM": {"$lte": "17-DEC-18"},
			"CUSTOMER_ID": 10006
		  }
		},
		{
			$sort:{
				"VALID_FROM":-1
			}
		},
		{
			$limit:1
		}
	  ],
	  as: "join1"
     }
   }
   ,
   {
      $project: {
		"_id":0,
		rut: "$CSCOMPREGNO",
		accountId: "$CUSTOMER_ID",
		accountIdHigh: "$CUSTOMER_ID_HIGH",
		paymentResp: "$PAYMNTRESP",
		csLevel: "$CSLEVEL",
		custCode: "$CUSTCODE",
		accountType: "$CSTYPE",
		accountActivate: "$CSACTIVATED",
		join1: 1
  	  }
   },
]).pretty()

-- v2.1
db.customer_all.aggregate([
	{
    $match: {
      _id:10006
    }
  }
  ,

  {
    $lookup: {
      from: "bah",
	 let: {cid: "$_id"},
	  pipeline: [
		{ $match:
                 { $expr:
                    { $and:
                       [
							{ $eq: [ "$CUSTOMER_ID",  "$$cid" ] }
                       ]
                    }
                 }
              }
		,
		{
			$sort:{
				"VALID_FROM":-1
			}
		},
		{
			$limit:1
		}
	  ],
	  as: "join1"
     }
   }
   ,
   {
      $project: {
		"_id":0,
		rut: "$CSCOMPREGNO",
		accountId: "$CUSTOMER_ID",
		accountIdHigh: "$CUSTOMER_ID_HIGH",
		paymentResp: "$PAYMNTRESP",
		csLevel: "$CSLEVEL",
		custCode: "$CUSTCODE",
		accountType: "$CSTYPE",
		accountActivate: "$CSACTIVATED",
		join1: 1
  	  }
   },
]).pretty()
-- v2.2

db.customer_all.aggregate([
	{
    $match: {
      _id:10006
    }
  }
  ,

  {
    $lookup: {
      from: "bah",
	 let: {cid: "$_id", fecha:"26-DEC-30" },
	  pipeline: [
		{ $match:
                 { $expr:
                    { $and:
                       [
							{ $eq: [ "$CUSTOMER_ID",  "$$cid" ] },
							{ $lte: ["$VALID_FROM","$$fecha"] }
                       ]
                    }
                 }
         }
		,
		{
			$sort:{
				"VALID_FROM":-1
			}
		},
		{
			$limit:1
		}
	  ],
	  as: "join1"
     }
   }
   ,
   {
      $project: {
		"_id":0,
		rut: "$CSCOMPREGNO",
		accountId: "$CUSTOMER_ID",
		accountIdHigh: "$CUSTOMER_ID_HIGH",
		paymentResp: "$PAYMNTRESP",
		csLevel: "$CSLEVEL",
		custCode: "$CUSTCODE",
		accountType: "$CSTYPE",
		accountActivate: "$CSACTIVATED",
		join1: 1
  	  }
   },
]).pretty()


CUSTOMER_ALL.cscompregno as rut,
CUSTOMER_ALL.CUSTOMER_ID as accountId,

CUSTOMER_ALL.CUSTOMER_ID_HIGH as accountIdHigh,
CUSTOMER_ALL.PAYMNTRESP as paymentResp,
CUSTOMER_ALL.cslevel as csLevel,
CUSTOMER_ALL.CUSTCODE as custCode,
CUSTOMER_ALL.CSTYPE as accountType,
CUSTOMER_ALL.CSACTIVATED as accountActivate,
CUSTOMER_ALL.CSDEACTIVATED as accountDeactivate,
CUSTOMER_ALL.CUSTOMER_ID_EXT as externalAccountId,
CUSTOMER_ALL.CSST as state,
CUSTOMER_ALL.DOCTYPE_ID as docTypeId,


db.customer_all.aggregate([
{
    $match: {
      _id:10006
    }
  },
  {
    $lookup: {
      from: "bah",
      localField: "CUSTOMER_ID",
      foreignField: "_id",
	as: "customer"
    }
  },
  {
    $lookup: {
      from: "contr_services_cap",
      localField: "_id",
      foreignField: "CO_ID",
      as: "rel"
    }
  },
  { 
	$project : { 
		"contr_services_cap-CO_ID" : "$rel.CO_ID", 
		"customer-id" : "$customer._id", 
		"contract-co_id" : "$contract._id"
	} 
  }
]);



SAMPLE: 
	db.customer_all.find({"_id":86, "CSCOMPREGNO" : 98344101})
	db.customer_all.find({"CSCOMPREGNO" : 98344101})

--------------------------------------------------------------------
