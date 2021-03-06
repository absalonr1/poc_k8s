db.CUSTOMER_ALL.aggregate([{
    '$match': {
        'CSCOMPREGNO': "157197444"
    }
}, {
    $lookup: {
        from: "BILLCYCLE_ASSIGNMENT_HISTORY",
        let: {
            cid: "$CUSTOMER_ID"
        },
        pipeline: [{
            $match: {
                $expr: {
                    $and: [{
                        $eq: ["$CUSTOMER_ID", "$$cid"]
                    }]
                }
            }
        }, {
            $sort: {
                "VALID_FROM": -1,
                "SEQNO": -1
            }
        }, {
            $limit: 1
        }],
        as: "join1"
    }
}, {
    $lookup: {
        from: 'BILLCYCLE_DEFINITION',
        let: {
            billid: {
                $arrayElemAt: ["$join1.BILLCYCLE", 0]
            }
        },
        pipeline: [{
            $match: {
                $expr: {
                    $and: [{
                        $eq: ["$BILLCYCLE", "$$billid"]
                    }]
                }
            }
        }],
        as: "bill"
    }
}, {
    $lookup: {
        from: 'CONTRACT_ALL',
        let: {
            ccid: "$CUSTOMER_ID",
            rut: "$CSCOMPREGNO"
        },
        pipeline: [{
            $match: {
                $expr: {
                    $and: [{
                        $eq: ["$CUSTOMER_ID", "$$ccid"]
                    }]
                }
            }
        }, {
            $project: {
                _id: false,
                "rut": "$$rut",
                "accountId": "$$ccid",
                "subscriberId": "$CO_ID",
                "subscriberType": "$TYPE",
                "subscriberIdContract": "$CO_CODE",
                "subscriberActivate": "$CO_SIGNED",
                "subscriberExpired": "$CO_EXPIR_DATE",
                "state": "$CH_STATUS"
            }
        }, {
            $lookup: {
                from: 'CONTR_SERVICES_CAP',
                let: {
                    scoid: "$subscriberId"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$CO_ID", "$$scoid"]
                            }]
                        }
                    }
                }, {
                    $lookup: {
                        from: 'DIRECTORY_NUMBER',
                        let: {
                            did: "$DN_ID"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$DN_ID", "$$did"]
                                    }]
                                }
                            }
                        }, {
                            $project: {
                                _id: false,
                                "Resource": "$DN_NUM"
                            }
                        }],
                        as: 'dn'
                    },
                }, {
                    $project: {
                        _id: false,
                        "subscriberId": "$$scoid",
                        "resourceId": "$DN_ID",
                        "resource": {
                            $arrayElemAt: ["$dn.Resource", 0]
                        },
                        "resourceDescription": "Número de celular del subscriptor",
                        "resourceActivate": "$CS_ACTIV_DATE",
                        "resourceDeactivate": "$CS_DEACTIV_DATE",
                        "resourceState": "$CH_STATUS",
                        "resourceType": "MSISDN"
                    }
                }],
                as: "RESOURCES"
            }
        }, {
            $project: {
                _id: false,
                "rut": true,
                "port": "$port",
                "accountId": true,
                "subscriberId": true,
                "subscriberType": true,
                "subscriberIdContract": true,
                "subscriberActivate": true,
                "subscriberExpired": true,
                "state": true,
                "subscriberResources": {
                    $setUnion: ["$subscriberResources_MSISDN", "$subscriberResources_IMSI"]
                }
            }
        }],
        as: "subscribers"
    }
}, {
    $lookup: {
        from: 'PAYMENT_ALL',
        let: {
            pcid: "$CUSTOMER_ID"
        },
        pipeline: [{
            $match: {
                $expr: {
                    $and: [{
                        $eq: ["$CUSTOMER_ID", "$$pcid"]
                    }]
                }
            }
        }, {
            $lookup: {
                from: 'BANK_ALL',
                let: {
                    bid: "$BANK_ID"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$BANK_ID", "$$bid"]
                            }]
                        }
                    }
                }, {
                    $project: {
                        _id: false,
                        "bankId": "$BANK_ID",
                        "bankName": "$BANKNAME",
                        "bankCode": "$BANKCODE",
                        "bankType": "$BANKTYPE"
                    }
                }],
                as: 'bank'
            }
        }, {
            $lookup: {
                from: 'PAYMENTTYPE_ALL',
                let: {
                    ptid: "$PAYMENT_ID"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$PAYMENT_TYPE", "$$ptid"]
                            }]
                        }
                    }
                }, {
                    $project: {
                        _id: false,
                        "paymentCode": "$PAYMENTCODE",
                        "paymentName": "$PAYMENTNAME",
                        "paymentFlow": "$PAYMNT_FLOW"
                    }
                }],
                as: 'ptype'
            }
        }, {
            $project: {
                _id: false,
                "accountId": "$CUSTOMER_ID",
                "sequency": "$SEQ_ID",
                "paymentId": "$PAYMENT_TYPE",
                "paymentCode": {
                    $arrayElemAt: ["$ptype.paymentCode", 0]
                },
                "paymentName": {
                    $arrayElemAt: ["$ptype.paymentName", 0]
                },
                "paymentFlow": {
                    $arrayElemAt: ["$ptype.paymentFlow", 0]
                },
                "pmod": "$PMOD",
                "entryDate": "$ENTDATE",
                "modifyDate": "$MODDATE",
                "userLastModify": "$USERLASTMOD",
                "bankId": "$BANK_ID",
                "bankName": {
                    $arrayElemAt: ["$bank.bankNameE", 0]
                },
                "bankCode": {
                    $arrayElemAt: ["$bank.bankCode", 0]
                },
                "bankType": {
                    $arrayElemAt: ["$bank.bankType", 0]
                }
            }
        }],
        as: 'payments'
    }
}, {
    $project: {
        _id: false,
        "rut": "$CSCOMPREGNO",
        "accountId": "$CUSTOMER_ID",
        "accountIdHigh": "$CUSTOMER_ID_HIGH",
        "csLevel": "$CSLEVEL",
        "custCode": "$CUSTCODE",
        "accountType": "$CSTYPE",
        "accountActivate": "$CSACTIVATED",
        "accountDeactivate": "$CSDEACTIVATED",
        "externalAccountId": "$CUSTOMER_ID_EXT",
        "state": "$CSST",
        "docTypeId": "$DOCTYPE_ID",
        "docTypeDesc": "$DOCTYPE_DESC",
        "docTypeOutputCode": "$DOCTYPE_OUTPUT_CODE",
        "billCycle": {
            "accountId": "$CUSTOMER_ID",
            "billCycle": {
                $arrayElemAt: ["$bill.BILLCYCLE", 0]
            },
            "intervalType": {
                $arrayElemAt: ["$bill.INTERVAL_TYPE", 0]
            },
            "lastRunDate": {
                $arrayElemAt: ["$bill.LAST_RUN_DATE", 0]
            },
            "bchRunDate": {
                $arrayElemAt: ["$bill.BCH_RUN_DATE", 0]
            },
            "billCycleDes": {
                $arrayElemAt: ["$bill.DESCRIPTION", 0]
            }
        },
        "subscribers": "$subscribers",
        "paymentMethod": "$payments"
    }
}, {
    $group: {
        _id: "$rut",
        account: {
            $push: "$$CURRENT"
        }
    }
}, {
    $project: {
        _id: false,
        "rut": "$_id",
        account: 1
    }
}]).forEach(printjson)