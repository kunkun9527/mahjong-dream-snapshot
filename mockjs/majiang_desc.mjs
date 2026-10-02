// 由 tools/extract_majiang_protocol.mjs 从原Unity描述符生成；勿手改。
export const MAJIANG_SOURCE = {
  "files": [
    {
      "path": "Build/mj-h5.wasm.unityweb",
      "sha256": "4963eed0961a68bc6bc983c34564633d9dd6503177824a6dc899406558a208c3"
    },
    {
      "path": "Build/mj-h5.data.unityweb",
      "sha256": "2384b9ca86cda9a3a4594dcf3eecba377041b1dffc46949b273ad01c1af4c7fd"
    },
    {
      "path": "Build/mj-h5.symbols.json.unityweb",
      "sha256": "ec0587bcca3d2014118ad5a231c47803bc0f27697c4a93e4232637b209e9ca97"
    }
  ],
  "functionIndex": 105782,
  "stringCount": 251,
  "descriptorSha256": "69aa89417974a5992c39e5314e11d5b28a7d634e2dff226e5e334e37d5ea9d4a",
  "protoName": "game_logic/majiang/majiang.proto"
};
export const MAJIANG_DESCRIPTOR = {
  "nested": {
    "majiang": {
      "options": {
        "optimize_for": "SPEED",
        "go_package": "gitlab.gg.com/riichi_mahjong/proto/go/client/game_logic/majiang",
        "csharp_namespace": "Com.Framework.Protocol.Majiang"
      },
      "nested": {
        "MoneyLogUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "bei": {
              "type": "int32",
              "id": 2
            },
            "money": {
              "type": "int64",
              "id": 3
            },
            "finalMoney": {
              "type": "int64",
              "id": 4
            },
            "fengDing": {
              "type": "bool",
              "id": 5
            },
            "yiTypes": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            },
            "noMoney": {
              "type": "bool",
              "id": 7
            },
            "sysMoney": {
              "type": "int64",
              "id": 8
            }
          }
        },
        "MoneyLog": {
          "fields": {
            "type": {
              "type": "int32",
              "id": 1
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.MoneyLogUserInfo",
              "id": 2
            }
          }
        },
        "TingInfo": {
          "fields": {
            "play": {
              "type": "int32",
              "id": 1
            },
            "ting": {
              "type": "int32",
              "id": 2
            },
            "maxBei": {
              "type": "int32",
              "id": 5
            }
          }
        },
        "ToPrepareUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "userID": {
              "type": "uint64",
              "id": 2
            }
          }
        },
        "NtfToPrepare": {
          "fields": {
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.ToPrepareUserInfo",
              "id": 1
            }
          }
        },
        "PrepareUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NtfPrepare": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.PrepareUserInfo",
              "id": 2
            }
          }
        },
        "GameStartUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "score": {
              "type": "int64",
              "id": 2
            },
            "handCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 5
            },
            "canPlayActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            },
            "changeCardSuggest": {
              "rule": "repeated",
              "type": "int32",
              "id": 7
            },
            "dingQueSuggest": {
              "type": "int32",
              "id": 8
            },
            "huaCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 9
            },
            "chuPai2Timeout": {
              "type": "int32",
              "id": 10
            }
          }
        },
        "NtfGameStart": {
          "fields": {
            "changWind": {
              "type": "int32",
              "id": 1
            },
            "juNum": {
              "type": "int32",
              "id": 2
            },
            "zhuangSeat": {
              "type": "int32",
              "id": 3
            },
            "remainDuiCardNum": {
              "type": "int32",
              "id": 4
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.GameStartUserInfo",
              "id": 5
            },
            "gameID": {
              "type": "string",
              "id": 6
            },
            "guiPreCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 7
            },
            "guiCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 8
            },
            "changeCardType": {
              "type": "int32",
              "id": 9
            },
            "baseScore": {
              "type": "int64",
              "id": 10
            },
            "topBei": {
              "type": "int32",
              "id": 11
            },
            "huanZhangTimeout": {
              "type": "int32",
              "id": 12
            },
            "dingQueTimeout": {
              "type": "int32",
              "id": 13
            },
            "chuPai1Timeout": {
              "type": "int32",
              "id": 14
            },
            "qiangPaiTimeout": {
              "type": "int32",
              "id": 15
            },
            "poChan1Timeout": {
              "type": "int32",
              "id": 16
            },
            "poChan2Timeout": {
              "type": "int32",
              "id": 17
            },
            "changeCardRule": {
              "type": "int32",
              "id": 18
            },
            "hasDingQue": {
              "type": "bool",
              "id": 19
            },
            "scoreType": {
              "type": "int32",
              "id": 20
            },
            "touzi1": {
              "type": "int32",
              "id": 21
            },
            "touzi2": {
              "type": "int32",
              "id": 22
            },
            "hasQuePaiBianShen": {
              "type": "bool",
              "id": 23
            },
            "totalJuNum": {
              "type": "int32",
              "id": 24
            },
            "specialCardNumMap": {
              "keyType": "int32",
              "type": "int32",
              "id": 25
            },
            "jieSuanRule": {
              "type": "int32",
              "id": 26
            },
            "isMingPai": {
              "type": "bool",
              "id": 27
            }
          }
        },
        "SendCardUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "card": {
              "type": "int32",
              "id": 2
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 3
            },
            "canPlayActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "chuPai2Timeout": {
              "type": "int32",
              "id": 5
            },
            "isDianGangHuaDianPao": {
              "type": "bool",
              "id": 6
            }
          }
        },
        "NtfSendCard": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.SendCardUserInfo",
              "id": 2
            },
            "remainDuiCardNum": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "PlayCardUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "canQiangActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 2
            },
            "canGangNoNumCardsAfterRiichiHu": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            }
          }
        },
        "NtfPlayCard": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "card": {
              "type": "int32",
              "id": 2
            },
            "action": {
              "type": "int32",
              "id": 3
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.PlayCardUserInfo",
              "id": 4
            },
            "isMoQie": {
              "type": "bool",
              "id": 5
            },
            "moneyLogs": {
              "rule": "repeated",
              "type": ".majiang.MoneyLog",
              "id": 6
            },
            "isFinish": {
              "type": "bool",
              "id": 7
            }
          }
        },
        "QiangCardUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NtfQiangCard": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "action": {
              "type": "int32",
              "id": 2
            },
            "otherCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.QiangCardUserInfo",
              "id": 4
            }
          }
        },
        "QiangCardEndUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 2
            },
            "canPlayActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "cantPlays": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "chuPai2Timeout": {
              "type": "int32",
              "id": 5
            },
            "canGangNoNumCardsAfterRiichiHu": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            }
          }
        },
        "NtfQiangCardEnd": {
          "fields": {
            "seats": {
              "rule": "repeated",
              "type": "int32",
              "id": 1
            },
            "action": {
              "type": "int32",
              "id": 2
            },
            "otherCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.QiangCardEndUserInfo",
              "id": 4
            },
            "moneyLogs": {
              "rule": "repeated",
              "type": ".majiang.MoneyLog",
              "id": 6
            },
            "isFinish": {
              "type": "bool",
              "id": 7
            }
          }
        },
        "SingleMa": {
          "fields": {
            "card": {
              "type": "int32",
              "id": 1
            },
            "seat": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "HuInfo": {
          "fields": {
            "huCard": {
              "type": "int32",
              "id": 1
            },
            "huType": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "OneGameHistory": {
          "fields": {
            "changeScore": {
              "type": "int64",
              "id": 2
            }
          }
        },
        "GameStopUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "score": {
              "type": "int64",
              "id": 2
            },
            "handCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "changeScore": {
              "type": "int64",
              "id": 4
            },
            "totalBei": {
              "type": "int32",
              "id": 5
            },
            "rank": {
              "type": "int32",
              "id": 6
            },
            "doorCardsInfos": {
              "rule": "repeated",
              "type": ".majiang.DoorCardsInfo",
              "id": 7
            },
            "alreadyRiichi": {
              "type": "bool",
              "id": 9
            },
            "oldPTLevel": {
              "type": "int32",
              "id": 10
            },
            "oldPTPoint": {
              "type": "int32",
              "id": 11
            },
            "newPTLevel": {
              "type": "int32",
              "id": 12
            },
            "newPTPoint": {
              "type": "int32",
              "id": 13
            },
            "changePT": {
              "type": "int64",
              "id": 14
            },
            "maiMa": {
              "rule": "repeated",
              "type": ".majiang.SingleMa",
              "id": 16
            },
            "baseBei": {
              "type": "int32",
              "id": 17
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 18
            },
            "isFinish": {
              "type": "bool",
              "id": 19
            },
            "poChanStatus": {
              "type": "int32",
              "id": 20
            },
            "huInfos": {
              "rule": "repeated",
              "type": ".majiang.HuInfo",
              "id": 21
            },
            "isExit": {
              "type": "bool",
              "id": 22
            },
            "oldLoveLevel": {
              "type": "int32",
              "id": 23
            },
            "oldLovePoint": {
              "type": "int32",
              "id": 24
            },
            "newLoveLevel": {
              "type": "int32",
              "id": 25
            },
            "newLovePoint": {
              "type": "int32",
              "id": 26
            },
            "changeLove": {
              "type": "int64",
              "id": 27
            },
            "isTianMingHuaZHu": {
              "type": "bool",
              "id": 28
            },
            "histories": {
              "rule": "repeated",
              "type": ".majiang.OneGameHistory",
              "id": 29
            }
          }
        },
        "NtfGameStop": {
          "fields": {
            "huSeats": {
              "rule": "repeated",
              "type": "int32",
              "id": 1
            },
            "huCardSeat": {
              "type": "int32",
              "id": 2
            },
            "huCard": {
              "type": "int32",
              "id": 3
            },
            "isFinal": {
              "type": "bool",
              "id": 4
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.GameStopUserInfo",
              "id": 5
            },
            "stopType": {
              "type": "int32",
              "id": 7
            },
            "moneyLogs": {
              "rule": "repeated",
              "type": ".majiang.MoneyLog",
              "id": 8
            },
            "winningStreak": {
              "type": "int32",
              "id": 9
            }
          }
        },
        "ChangeCardUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "cards": {
              "rule": "repeated",
              "type": "int32",
              "id": 2
            }
          }
        },
        "NtfChangeCard": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "cardNum": {
              "type": "int32",
              "id": 2
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.ChangeCardUserInfo",
              "id": 3
            }
          }
        },
        "ChangeCardEndUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "cards": {
              "rule": "repeated",
              "type": "int32",
              "id": 2
            },
            "getCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            },
            "dingQueSuggest": {
              "type": "int32",
              "id": 4
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 5
            },
            "canPlayActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            },
            "chuPai2Timeout": {
              "type": "int32",
              "id": 7
            }
          }
        },
        "NtfChangeCardEnd": {
          "fields": {
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.ChangeCardEndUserInfo",
              "id": 1
            }
          }
        },
        "DingQueUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "dingQue": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "NtfDingQue": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.DingQueUserInfo",
              "id": 2
            }
          }
        },
        "DingQueEndUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "dingQue": {
              "type": "int32",
              "id": 2
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 3
            },
            "canPlayActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "chuPai2Timeout": {
              "type": "int32",
              "id": 5
            },
            "quePaiBianShen": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            },
            "moCard": {
              "type": "int32",
              "id": 7
            }
          }
        },
        "NtfDingQueEnd": {
          "fields": {
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.DingQueEndUserInfo",
              "id": 1
            }
          }
        },
        "PoChanUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NtfPoChanChange": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "poChanStatus": {
              "type": "int32",
              "id": 2
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.PoChanUserInfo",
              "id": 3
            },
            "finalMoney": {
              "type": "int64",
              "id": 4
            },
            "isFinish": {
              "type": "bool",
              "id": 5
            }
          }
        },
        "ExitUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NtfExit": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.ExitUserInfo",
              "id": 2
            }
          }
        },
        "TuoGuanUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "NtfTuoGuanChange": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "tuoGuanStatus": {
              "type": "int32",
              "id": 2
            },
            "userInfos": {
              "rule": "repeated",
              "type": ".majiang.TuoGuanUserInfo",
              "id": 3
            }
          }
        },
        "ReqPrepare": {
          "fields": {}
        },
        "RspPrepare": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqPlayCard": {
          "fields": {
            "card": {
              "type": "int32",
              "id": 1
            },
            "action": {
              "type": "int32",
              "id": 2
            },
            "isTimeout": {
              "type": "bool",
              "id": 3
            },
            "isChuPai1Timeout": {
              "type": "bool",
              "id": 4
            }
          }
        },
        "RspPlayCard": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqQiangCard": {
          "fields": {
            "action": {
              "type": "int32",
              "id": 1
            },
            "otherCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 2
            },
            "isTimeout": {
              "type": "bool",
              "id": 3
            }
          }
        },
        "RspQiangCard": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqChangeCard": {
          "fields": {
            "cards": {
              "rule": "repeated",
              "type": "int32",
              "id": 1
            }
          }
        },
        "RspChangeCard": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqDingQue": {
          "fields": {
            "dingQue": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RspDingQue": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqPoChanChange": {
          "fields": {
            "poChanStatus": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RspPoChanChange": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqExit": {
          "fields": {}
        },
        "RspExit": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqTuoGuanChange": {
          "fields": {
            "tuoGuanStatus": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "RspTuoGuanChange": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "ReqSetInternalState": {
          "fields": {
            "InternalState": {
              "keyType": "int32",
              "type": "int32",
              "id": 1
            }
          }
        },
        "RspSetInternalState": {
          "fields": {
            "result": {
              "type": "int32",
              "id": 1
            }
          }
        },
        "DoorCardsInfo": {
          "fields": {
            "cards": {
              "rule": "repeated",
              "type": "int32",
              "id": 1
            },
            "action": {
              "type": "int32",
              "id": 2
            },
            "qiangSeat": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "Offline2OnlineUserInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "handCardsNum": {
              "type": "int32",
              "id": 2
            },
            "doorCardsInfos": {
              "rule": "repeated",
              "type": ".majiang.DoorCardsInfo",
              "id": 3
            },
            "handCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 4
            },
            "playedCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 5
            },
            "PlayedCardsOtherTake": {
              "rule": "repeated",
              "type": "int32",
              "id": 6
            },
            "alreadyRiichi": {
              "type": "bool",
              "id": 7
            },
            "tingInfos": {
              "rule": "repeated",
              "type": ".majiang.TingInfo",
              "id": 8
            },
            "canPlayActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 9
            },
            "cantPlays": {
              "rule": "repeated",
              "type": "int32",
              "id": 10
            },
            "changeScore": {
              "type": "int64",
              "id": 11
            },
            "canQiangActions": {
              "rule": "repeated",
              "type": "int32",
              "id": 12
            },
            "score": {
              "type": "int64",
              "id": 13
            },
            "huaCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 15
            },
            "huInfos": {
              "rule": "repeated",
              "type": ".majiang.HuInfo",
              "id": 16
            },
            "dingQue": {
              "type": "int32",
              "id": 17
            },
            "canGangNoNumCardsAfterRiichiHu": {
              "rule": "repeated",
              "type": "int32",
              "id": 18
            },
            "moQieMap": {
              "keyType": "int32",
              "type": "bool",
              "id": 19
            },
            "chuPai2Timeout": {
              "type": "int32",
              "id": 20
            },
            "poChanStatus": {
              "type": "int32",
              "id": 21
            },
            "timeoutStartTime": {
              "type": "int64",
              "id": 22
            },
            "tuoGuanStatus": {
              "type": "int32",
              "id": 23
            },
            "internalState": {
              "keyType": "int32",
              "type": "int32",
              "id": 24
            },
            "changeCardSuggest": {
              "rule": "repeated",
              "type": "int32",
              "id": 26
            },
            "dingQueSuggest": {
              "type": "int32",
              "id": 27
            },
            "isFinish": {
              "type": "bool",
              "id": 28
            },
            "histories": {
              "rule": "repeated",
              "type": ".majiang.OneGameHistory",
              "id": 29
            },
            "isDianGangHuaDianPao": {
              "type": "bool",
              "id": 30
            }
          }
        },
        "QiangInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "action": {
              "type": "int32",
              "id": 2
            },
            "otherCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 3
            }
          }
        },
        "ChangeCardInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "cards": {
              "rule": "repeated",
              "type": "int32",
              "id": 2
            },
            "cardNum": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "DingQueInfo": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "dingQue": {
              "type": "int32",
              "id": 2
            }
          }
        },
        "Offline2OnlineGameScene": {
          "fields": {
            "seat": {
              "type": "int32",
              "id": 1
            },
            "changWind": {
              "type": "int32",
              "id": 2
            },
            "juNum": {
              "type": "int32",
              "id": 3
            },
            "zhuangSeat": {
              "type": "int32",
              "id": 4
            },
            "remainDuiCardNum": {
              "type": "int32",
              "id": 5
            },
            "currentSeat": {
              "type": "int32",
              "id": 6
            },
            "currentPlayCard": {
              "type": "int32",
              "id": 7
            },
            "currentAction": {
              "type": "int32",
              "id": 8
            },
            "qiangInfos": {
              "rule": "repeated",
              "type": ".majiang.QiangInfo",
              "id": 10
            },
            "offline2OnlineUserInfos": {
              "rule": "repeated",
              "type": ".majiang.Offline2OnlineUserInfo",
              "id": 11
            },
            "gameID": {
              "type": "string",
              "id": 12
            },
            "preSeat": {
              "type": "int32",
              "id": 13
            },
            "prePlayCard": {
              "type": "int32",
              "id": 14
            },
            "preAction": {
              "type": "int32",
              "id": 15
            },
            "preQiangInfos": {
              "rule": "repeated",
              "type": ".majiang.QiangInfo",
              "id": 16
            },
            "baseScore": {
              "type": "int64",
              "id": 17
            },
            "topBei": {
              "type": "int32",
              "id": 18
            },
            "moneyLogs": {
              "rule": "repeated",
              "type": ".majiang.MoneyLog",
              "id": 19
            },
            "huanZhangTimeout": {
              "type": "int32",
              "id": 22
            },
            "dingQueTimeout": {
              "type": "int32",
              "id": 23
            },
            "chuPai1Timeout": {
              "type": "int32",
              "id": 24
            },
            "qiangPaiTimeout": {
              "type": "int32",
              "id": 25
            },
            "poChan1Timeout": {
              "type": "int32",
              "id": 26
            },
            "poChan2Timeout": {
              "type": "int32",
              "id": 27
            },
            "changeCardType": {
              "type": "int32",
              "id": 28
            },
            "changeCardRule": {
              "type": "int32",
              "id": 29
            },
            "changeCardInfos": {
              "rule": "repeated",
              "type": ".majiang.ChangeCardInfo",
              "id": 30
            },
            "hasDingQue": {
              "type": "bool",
              "id": 31
            },
            "dingQueInfos": {
              "rule": "repeated",
              "type": ".majiang.DingQueInfo",
              "id": 32
            },
            "touzi1": {
              "type": "int32",
              "id": 33
            },
            "touzi2": {
              "type": "int32",
              "id": 34
            },
            "scoreType": {
              "type": "int32",
              "id": 35
            },
            "hasQuePaiBianShen": {
              "type": "bool",
              "id": 36
            },
            "totalJuNum": {
              "type": "int32",
              "id": 37
            },
            "guiPreCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 38
            },
            "guiCards": {
              "rule": "repeated",
              "type": "int32",
              "id": 39
            },
            "specialCardNumMap": {
              "keyType": "int32",
              "type": "int32",
              "id": 40
            },
            "jieSuanRule": {
              "type": "int32",
              "id": 41
            }
          }
        },
        "GmReqStopGame": {
          "fields": {}
        },
        "GmRspStopGame": {
          "fields": {}
        },
        "GmReqInitCard": {
          "fields": {
            "cardId": {
              "type": "int32",
              "id": 1
            },
            "isZimo": {
              "type": "bool",
              "id": 2
            },
            "isForbidRobotHu": {
              "type": "bool",
              "id": 3
            },
            "duiCardNum": {
              "type": "int32",
              "id": 4
            }
          }
        },
        "GmRspInitCard": {
          "fields": {}
        },
        "GmReqSetRobotConfig": {
          "fields": {
            "robotSpeedLevel": {
              "type": "int32",
              "id": 1
            }
          },
          "nested": {
            "RobotSpeed": {
              "values": {
                "Normal": 0,
                "HalfTime": 1,
                "Fast": 2
              }
            }
          }
        },
        "GmRspSetRobotConfig": {
          "fields": {}
        },
        "OneGameRecordStep": {
          "fields": {
            "ntfToPrepare": {
              "type": ".majiang.NtfToPrepare",
              "id": 1
            },
            "ntfPrepare": {
              "type": ".majiang.NtfPrepare",
              "id": 2
            },
            "ntfGameStart": {
              "type": ".majiang.NtfGameStart",
              "id": 3
            },
            "ntfSendCard": {
              "type": ".majiang.NtfSendCard",
              "id": 4
            },
            "ntfPlayCard": {
              "type": ".majiang.NtfPlayCard",
              "id": 5
            },
            "ntfQiangCard": {
              "type": ".majiang.NtfQiangCard",
              "id": 6
            },
            "ntfQiangCardEnd": {
              "type": ".majiang.NtfQiangCardEnd",
              "id": 7
            },
            "ntfGameStop": {
              "type": ".majiang.NtfGameStop",
              "id": 8
            },
            "ntfChangeCard": {
              "type": ".majiang.NtfChangeCard",
              "id": 9
            },
            "ntfChangeCardEnd": {
              "type": ".majiang.NtfChangeCardEnd",
              "id": 10
            },
            "ntfDingQue": {
              "type": ".majiang.NtfDingQue",
              "id": 11
            },
            "ntfDingQueEnd": {
              "type": ".majiang.NtfDingQueEnd",
              "id": 12
            },
            "ntfPoChanChange": {
              "type": ".majiang.NtfPoChanChange",
              "id": 13
            },
            "ntfExit": {
              "type": ".majiang.NtfExit",
              "id": 14
            },
            "ntfTuoGuanChange": {
              "type": ".majiang.NtfTuoGuanChange",
              "id": 15
            },
            "stepType": {
              "type": "int32",
              "id": 101
            },
            "time": {
              "type": "int64",
              "id": 102
            }
          }
        },
        "CardType": {
          "values": {
            "None": 0,
            "Wan": 1,
            "Tong": 2,
            "Tiao": 3,
            "Zi": 4,
            "Hua": 5,
            "Te": 6
          }
        },
        "Result": {
          "values": {
            "Succ": 0,
            "Fail_InternalError": 1,
            "Fail_InvalidParam": 2,
            "Fail_InvalidSequence": 3,
            "Fail_ActionNotInCanPlayActions": 101,
            "Fail_CardInCantPlays": 102,
            "Fail_RiichiPlayCardWrong": 103,
            "Fail_CardNotInHand": 104,
            "Fail_CardNotMatchAction": 105,
            "Fail_ActionNotInCanQiangActions": 201,
            "Fail_InvalidOtherCards": 202,
            "Fail_InvalidChangeCards": 301,
            "Fail_InvalidDingQue": 401
          }
        },
        "Wind": {
          "values": {
            "East": 0,
            "South": 1,
            "West": 2,
            "North": 3
          }
        },
        "MaJiangMsg": {
          "values": {
            "ENone": 0,
            "EReqPrepare": 1,
            "ERspPrepare": 2,
            "EReqPlayCard": 3,
            "ERspPlayCard": 4,
            "EReqQiangCard": 5,
            "ERspQiangCard": 6,
            "EReqChangeCard": 7,
            "ERspChangeCard": 8,
            "EReqDingQue": 9,
            "ERspDingQue": 10,
            "EReqPoChanChange": 11,
            "ERspPoChanChange": 12,
            "EReqExit": 13,
            "ERspExit": 14,
            "EReqTuoGuanChange": 15,
            "ERspTuoGuanChange": 16,
            "EReqSetInternalState": 17,
            "ERspSetInternalState": 18,
            "ENtfToPrepare": 1001,
            "ENtfPrepare": 1002,
            "ENtfGameStart": 1003,
            "ENtfSendCard": 1004,
            "ENtfPlayCard": 1005,
            "ENtfQiangCard": 1006,
            "ENtfQiangCardEnd": 1007,
            "ENtfGameStop": 1008,
            "ENtfChangeCard": 1009,
            "ENtfChangeCardEnd": 1010,
            "ENtfDingQue": 1011,
            "ENtfDingQueEnd": 1012,
            "ENtfPoChanChange": 1013,
            "ENtfExit": 1014,
            "ENtfTuoGuanChange": 1015,
            "EGmBegin": 50000,
            "EGmReqStopGame": 50001,
            "EGmRspStopGame": 50002,
            "EGmReqInitCard": 50003,
            "EGmRspInitCard": 50004,
            "EGmReqSetRobotConfig": 50005,
            "EGmRspSetRobotConfig": 50006,
            "EGmEnd": 60000
          }
        },
        "PlayAction": {
          "values": {
            "Normal": 0,
            "Guo": 1,
            "Chi": 2,
            "Peng": 3,
            "MingGang": 4,
            "PengGang": 5,
            "AnGang": 6,
            "Riichi": 7,
            "Hu": 8
          }
        },
        "GuiPlayRule": {
          "values": {
            "GuiPlayRule_No": 0,
            "GuiPlayRule_Gang": 1
          }
        },
        "MoneyLogType": {
          "values": {
            "MoneyLogType_None": 0,
            "MoneyLogType_MingGang": 1,
            "MoneyLogType_PengGang": 2,
            "MoneyLogType_AnGang": 3,
            "MoneyLogType_Mo": 4,
            "MoneyLogType_Rong": 5,
            "MoneyLogType_MaiMa": 6,
            "MoneyLogType_ZhaNiao": 7,
            "MoneyLogType_ChaHuaZhu": 8,
            "MoneyLogType_ChaDaJiao": 9,
            "MoneyLogType_TuiShui": 10,
            "MoneyLogType_HuJiaoZhuanYi": 11
          }
        },
        "ChangeCardRule": {
          "values": {
            "ChangeCardRule_No": 0,
            "ChangeCardRule_HuanSanZhang": 1,
            "ChangeCardRule_RenYiHuan": 2,
            "ChangeCardRule_HuanSanZhang2": 3
          }
        },
        "ChangeCardType": {
          "values": {
            "ChangeCardType_No": 0,
            "ChangeCardType_Shun": 1,
            "ChangeCardType_Ni": 2,
            "ChangeCardType_Dui": 3
          }
        },
        "HuType": {
          "values": {
            "HuType_None": 0,
            "HuType_Mo": 1,
            "HuType_Rong": 2,
            "HuType_QiangGang": 3
          }
        },
        "PoChanStatus": {
          "values": {
            "PoChanStatus_No": 0,
            "PoChanStatus_DaiBuDou": 1,
            "PoChanStatus_RenShu": 2,
            "PoChanStatus_BuDouZhong": 3
          }
        },
        "InternalStateType": {
          "values": {
            "InternalStateType_None": 0,
            "InternalStateType_Que": 1,
            "InternalStateType_Gang": 2,
            "InternalStateType_Hu": 3
          }
        }
      }
    }
  }
};
