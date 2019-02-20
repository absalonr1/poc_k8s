db.customer_all.createIndex( { "CSCOMPREGNO": 1})
db.bah.createIndex( { "CUSTOMER_ID": 1})
db.payment_all.createIndex( { "CUSTOMER_ID": 1})
db.contract_all.createIndex( { "CUSTOMER_ID": 1})
db.contract_all.createIndex( { "CO_ID": 1})
db.billcycle_definition.createIndex( { "BILLCYCLE": 1})
db.contr_services_cap.createIndex( { "CO_ID": 1})
db.contr_devices.createIndex( { "CO_ID": 1})
db.directory_number.createIndex( { "DN_ID": 1})
db.bank_all.createIndex( { "BANK_ID": 1})
db.paymenttype_all.createIndex( { "PAYMENT_ID": 1})
db.port.createIndex( { "PORT_ID": 1})
db.equipment.createIndex( { "EQUIPMENT_ID": 1})
db.equipment_type.createIndex( { "EQUIPMENT_TYPE_ID": 1})
db.storage_medium.createIndex( { "SM_ID": 1})
db.Account.createIndex( { "rut": 1})