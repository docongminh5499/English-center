import { _User, _Exercise } from "../_models_"
import { Gender } from "../../../../helpers/constants";

export const infoStudent_mock : _User = {
    fullName : 'Nguyễn Văn A',
    sex : Gender.MALE,
    dateOfBirth : new Date(),
    email : 'admin@gmail.com',
    address : 'Gia Kiệm, Thống Nhất, Đồng Nai',
    phone : '0123456789',
    avatar : null
}

export const infoParents_mock : _User = {
    fullName : 'Nguyễn Văn Phụ Huynh',
    sex : Gender.FEMALE,
    dateOfBirth : new Date(),
    email : 'admin@gmail.com',
    address : 'Gia Kiệm, Thống Nhất, Đồng Nai',
    phone : '0123456789',
    avatar : null
}

export const dataAttendance_mock = [
    {
        studySessionId : {
            name : 'Family',
            shifts : {
                time : '10:00 - 12:00 - 01/01/2022'
            }
        },
        isAbsent : true,
        isMakeUpStudy : false
    },
    {
        studySessionId : {
            name : 'Family 2',
            shifts : {
                time : '10:00 - 12:00 - 01/01/2022'
            }
        },
        isAbsent : true,
        isMakeUpStudy : true
    },
    {
        studySessionId : {
            name : 'Family 3',
            shifts : {
                time : '10:00 - 12:00 - 01/01/2022'
            }
        },
        isAbsent : false,
        isMakeUpStudy : true
    }
]

export const dataExercise_mock : Array<_Exercise> = [
    {
        name : 'FAMILY',
        time: '10:00 - 12:00 - 01/01/2022 ',
        scores : 9.5
    },
    {
        name : 'FAMILY 1',
        time: '10:00 - 12:00 - 01/01/2022 ',
        scores : 10
    },
    {
        name : 'FAMILY 5',
        time: '10:00 - 12:00 - 01/01/2022 ',
        scores : 10
    }
]