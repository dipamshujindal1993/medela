export const StatusFlags = {
  name: 'statusFlags',
  properties: {
    sessionType:   {type: 'int',default:0},
    sessionAborted: {type: 'bool', default: false},
    goalCompleted: {type: 'bool', default: false},
    goalExtended: {type: 'bool', default: false},
    autoLetdown: {type: 'bool', default: false},
    leaksDetected: {type: 'bool', default: false},
    timestampInvalid: {type: 'bool', default: false},
  }
}


// My Items Schema
export const TrackingSchema = {
  name: 'Tracking',
  primaryKey: 'id',
  properties: {
    id:'string',
    trackingType: 'int', // 1(Breastfeeding), 2(Pumping), 3(Bottle), 4(Diaper), 5(Sleep), 6(Weight), 7(Height)
    isSync: {type: 'bool', default: false},
    userId: 'string',
    babyId:{type: 'string', default: ''},
    remark: {type: 'string', default: ''},
    feedType:{type: 'int', default: 0},
    batchType:{type: 'int', default: 0},
    trackAt: 'string',
    isBadSession: {type: 'bool', default: false},
    quickTracking: {type: 'bool', default: false},
    durationLeft: {type: 'double', default: 0},
    durationRight: {type: 'double', default: 0},
    durationTotal: {type: 'double', default: 0},
    confirmed: {type: 'bool', default: true},
    amountTotal:{type: 'double', default: 0} ,
    amountTotalUnit:{type: 'string', default: ''} ,
    amountLeft:{type: 'double', default: 0},
    amountLeftUnit:{type: 'string', default: ''},
    amountRight:{type: 'double', default: 0} ,
    amountRightUnit:{type: 'string', default: ''} ,
    weight:  {type: 'double', default: 0} ,
    weightUnit:{type: 'string', default: ''},
    height:{type: 'double', default: 0},
    heightUnit: {type: 'string', default: ''},
    savedMilk:{type: 'bool', default: false},
    lastBreast:{type: 'int', default: 0},
    pumpLevel: {type: 'int', default: 0},
    phaseIndex: {type: 'int', default: 0},
    patternIndex: {type: 'int', default: 0},
    trackingMethod: {type: 'int', default: 0},
    pumpId:{type: 'string', default: ''},
    pumpRecordId  :{type: 'int', default: -1},
    devicePattern: {type: 'int', default: -1},
    devicePhase: {type: 'int', default: 0},
    deviceLevel: {type: 'int', default: 0},
    goalTime: {type: 'int', default: 0},
    statusFlags:'statusFlags',
    currentDate:{type: 'string', default: ''},
    frequency:{type: 'int', default: 0},
    painLevel:{type: 'int', default: 0},
    isMother:{type: 'bool', default: false},
    isDeleted:{type: 'bool', default: false},
    inventory:'VirtualFreezerSchema'
  }
};

export const ImageSchema={
  name: 'Image',
  properties: {
    name:     'string?',
    type:   'string?',
    uri:    'string?',
  }
}
export const UnitSchema = {
  name: 'Unit',
  properties: {
    unit:     'string?',
    quantity:   'double?',
  }
};
// My Items Schema
export  const AddBabySchema = {
  name: 'AddBaby',
  primaryKey: 'babyId',
  properties: {
    babyId:     'string',
    gender:   'int?',
    name: 'string?',
    birthWeight:'Unit?',
    birthHeight:'Unit?',
    isSync: {type: 'bool', default: false},
    birthday:'string',
    username:'string',
    image:'Image?',
    avatar:'string?',
    imagePath:'string?',
    isDeleted: {type: 'bool', default: false},
  }
};

export const NotificationSchema={
  name: 'NotificationSchema',
  properties: {
    breastfeeding: {type: 'bool', default: true},
    pumping: {type: 'bool', default: true},
    diaper: {type: 'bool', default: true},
    weight: {type: 'bool', default: true},
    pumpSessionComplete: {type: 'bool', default: true},
    pumpSessionTimeout: {type: 'bool', default: true},
    pumpMissingMilkVolume: {type: 'bool', default: true},

  }
}
export  const ClientSchema = {
  name: 'ClientSchema',
  properties: {
    notifications: 'NotificationSchema',
  }
}


export  const MotherProfileSchema = {
  name: 'MotherProfileSchema',
  properties: {
    name: 'string',
    username:'string',
    timezone: 'string?',
    market: 'string?',
    birthDate: 'string?',
    backToWorkDate: 'string?',
    currentBabyClientId: 'string?',
    backToWorkStatus: 'int?',
    country: 'string?',
    source: 'string?',
    units: 'string?',
    analyticsOptout: {type: 'bool', default: true},
    incompleteProfile: {type: 'bool', default: true},
    isOptedInForEmail: {type: 'bool', default: true},
    //isOptedInForSms: {type: 'bool', default: true},
    //isOptedInForMail: {type: 'bool', default: true},
    //isOptedInForTesting: {type: 'bool', default: true},
    registrationType: 'int?',
    vipStatus:'bool?'
  }
};

export  const UserMotherProfileSchema = {
  name: 'UserMotherProfile',
  primaryKey:'username',
  properties: {
    client: 'ClientSchema',
    mother:'MotherProfileSchema',
    username:'string',
    isSync: {type: 'bool', default: false},
  }
}


// My Items Schema
export  const TimelineSchema = {
  name: 'Timeline',
  primaryKey:'id',
  properties: {
    endDate:     'string',
    label:   'string',
    startDate: 'string',
    id:'string',
    url:'string'
  }
};

// Virtual Freezer Schema
export  const VirtualFreezerSchema = {
  name: 'VirtualFreezerSchema',
  primaryKey:'id',
  properties: {
    id:'string',
    trackingMethod: {type: 'int', default: 0},
    trackAt: 'string',
    location: 'int',  // 1: Fridge, 2: Freezer
    tray:'int',         // tray number
    containerType:'int',         // 1: Bottle, 2: Bag
    number:'int',         // container number
    amount:{type: 'double', default: 0} ,
    unit:{type: 'string', default: ''} ,
    createdFrom:{type: 'string', default: ''},
    isConsumed: {type: 'bool', default: false},
    consumedBy: {type: 'string', default: ''},
    consumedAt:{type: 'string', default: ''} ,
    isExpired: {type: 'bool', default: true},
    expireAt:{type: 'string', default: ''} ,
    movedAt:{type: 'string', default: ''} ,
    isSync: {type: 'bool', default: false},
    userId: 'string',
    isDeleted:{type: 'bool', default: false},
  }
};

export const UserSchema = {
  name: 'user',
  // primaryKey: '_id',
  properties: {
    _id: 'int',
    name: 'string?',
    avatar: 'string?'
  }
}

export const ValuesSchema = {
  name: 'values',
  properties: {
    title: 'string',
    value: 'string',
  }
}

export const QuickRepliesSchema = {
  name: 'quickReplies',
  properties: {
    type: {type: 'string', default: 'radio'},
    keepIt: {type: 'bool', default: true},
    values: 'values[]'
  }
}


export const ArticlesSchema = {
  name: 'articles',
  properties: {
    articleId: 'string?',
    buttonText: 'string?',
  }
}
// My Items Schema
export const ChatbotSchema = {
  name: 'Chatbot',
  // primaryKey: '_id',
  properties: {
    _id: 'int',
    text: 'string',
    createdAt: 'date',
    user: 'user',
    quickReplies: 'quickReplies?',
    articles: 'articles[]',
    username:'string?'
  }
};

export const MyItemsSchema = {
  name: 'MyItems',
  properties: {
    title:     'string',
    uuid: 'string',
    selectedItemUuid:'string',
    currentUserUuid:'string'
  }
};

// Define your models and their properties
export const CheckListSelectionSchema = {
  name: 'CheckListSelection',
  //primaryKey: 'id',
  properties: {
    uuid: 'string',
    isEnabled: 'bool',
    selectedItemUuid:'string',
    currentUserId:'string'
  }
};

export const DeletedItemsSchema = {
  name: 'ChecklistDeletedItems',
  properties: {
    uuid: 'string',
    currentUserUuid:'string'
  }
};


