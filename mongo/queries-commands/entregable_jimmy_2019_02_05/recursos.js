{
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
                $match: {
                  "SNCODE": 3
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
                }
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
              as: "subscriberResources_MSISDN"
            }
          }

,

{
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
                  from: 'CONTR_DEVICES',
                  let: {
                    cdcoid: "$CO_ID"
                  },
                  pipeline: [{
                    $match: {
                      $expr: {
                        $and: [{
                          $eq: ["$CO_ID", "$$cdcoid"]
                        }]
                      }
                    }
                  }, {
                    $project: {
                      _id: false,
                      "PORT_ID": "$PORT_ID"
                    }
                  }],
                  as: 'cd'
                }
              }, {
                $lookup: {
                  from: 'PORT',
                  let: {
                    portid: {
                      $arrayElemAt: ["$cd.PORT_ID", 0]
                    }
                  },
                  pipeline: [{
                    $match: {
                      $expr: {
                        $and: [{
                          $eq: ["$PORT_ID", "$$portid"]
                        }]
                      }
                    }
                  }, {
                    $project: {
                      _id: false,
                      "Resource": "$PORT_NUM",
                      "State": "$PORT_STATUS"
                    }
                  }],
                  as: 'port'
                }
              }, {
                $project: {
                  _id: false,
                  "subscriberId": "$$scoid",
                  "resourceId": "$DN_ID",
                  "resource": {
                    $arrayElemAt: ["$port.Resource", 0]
                  },
                  "resourceDescription": "Número de IMSI del subscriptor",
                  "resourceActivate": "$CS_ACTIV_DATE",
                  "resourceDeactivate": "$CS_DEACTIV_DATE",
                  "State": {
                    $arrayElemAt: ["$port.State", 0]
                  },
                  "resourceType": "IMSI"
                }
              }],
              as: "subscriberResources_IMSI"
            }
          }


	,
      {
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
          },
          {
            $lookup: {
              from: 'CONTR_DEVICES',
              let: {
                cdcoid: "$CO_ID"
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ["$CO_ID", "$$cdcoid"]
                    }]
                  }
                }
              },
              {
                $project: {
                  _id: false,
                  "PORT_ID": "$PORT_ID"
                }
              }
              ],
              as: 'cd'
            }
          },
          {
            $lookup: {
              from: 'PORT',
              let: {
                portid: {
                  $arrayElemAt: ["$cd.PORT_ID", 0]
                }
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ["$PORT_ID", "$$portid"]
                    }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: false,
                  "Resource": "$PORT_NUM",
                  "State": "$PORT_STATUS"
                }
              }
              ],
              as: 'port'
            }
          },
          {
            $lookup: {
              from: 'STORAGE_MEDIUM',
              let: {
                smsmid: {
                  $arrayElemAt: ["$port.SM_ID", 0]
                }
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ["$SM_ID", "$$smsmid"]
                    }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: false,
                  "Resource": "$SM_SERIALNUM",
                  "State": "$SM_STATUS"
                }
              }
              ],
              as: 'sm'
            }
          },
          {
            $project: {
              _id: false,
              "subscriberId": "$$scoid",
              "resourceId": "$DN_ID",
              "resource": {
                $arrayElemAt: ["$sm.Resource", 0]
              },
              "resourceDescription": "Número de ICCID del subscriptor",
              "resourceActivate": "$CS_ACTIV_DATE", 
              "resourceDeactivate": "$CS_DEACTIV_DATE",
              "State": {
                $arrayElemAt: ["$sm.State", 0]
              },
              "resourceType": "ICCID"
            }
          }  
          ],
          as: "subscriberResources_ICCID"
        }
      },








      
      {
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
          },
          {
            $lookup: {
              from: 'CONTR_DEVICES',
              let: {
                cdcoid: "$CO_ID"
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ["$CO_ID", "$$cdcoid"]
                    }]
                  }
                }
              },
              {
                $project: {
                  _id: false,
                  "PORT_ID": "$PORT_ID"
                }
              }
              ],
              as: 'cd'
            }
          },
          {
            $lookup: {
              from: 'EQUIPMENT',
              let: {
                eqid: {
                  $arrayElemAt: ["$cd.EQ_ID", 0]
                }
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ["$EQUIPMENT_ID", "$$eqid"]
                    }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: false,
                  "Resource": "$EQ_SERIAL_NUM",
                  "State": "$EQ_STATUS",
                  "EQUIPMENT_TYPE_ID": "$EQUIPMENT_TYPE_ID"
                }
              }
              ],
              as: 'eq'
            }
          },
          {
            $lookup: {
              from: 'EQUIPMENT_TYPE',
              let: {
                eqtid: {
                  $arrayElemAt: ["$eq.EQUIPMENT_TYPE_ID", 0]
                }
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ["$EQUIPMENT_TYPE_ID", "$$eqtid"]
                    }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: false,
                  "ResourceDescription": { $concat: [ "$DESCRIPTION", " - ", "$COMPANY" ] }
                }
              }
              ],
              as: 'eqt'
            }
          },
          {
            $project: {
              _id: false,
              "subscriberId": "$$scoid",
              "resourceId": "$DN_ID",
              "resource": {
                $arrayElemAt: ["$eq.Resource", 0]
              },
              "resourceDescription": {
                $arrayElemAt: ["$eqt.ResourceDescription", 0]
              },
              "resourceActivate": "$CS_ACTIV_DATE", 
              "resourceDeactivate": "$CS_DEACTIV_DATE",
              "State": {
                $arrayElemAt: ["$eq.State", 0]
              },
              "resourceType": "IMEI"
            }
          }  
          ],
          as: "subscriberResources_IMEI"
        }
      },