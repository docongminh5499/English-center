import { _StudySession } from '../_models_/index'
import { _AttendanceStudent } from '../_models_/index'

export const infoStudySession_mock : _StudySession = {
    nameCourse : 'Khóa học IELTS 6.0+',
    nameStudySession : 'Bài 1: Thì hiện tại đơn',
    nameTeacher : 'Nguyễn Văn A',
    dateStart : '01/01/2022',
    notes : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    shifts : {
        name : 'Ca 1-2',
        time : '10:00 - 12:00'
    }
}

export const dataAttendanceStudent_mock : Array<_AttendanceStudent> = [
    {
        id : 1,
        nameStudent : 'Nguyễn Thị A',
        pseudoIdStudent : 'MSHV001',
        isAbsent : true,
        isMakeUpStudy : false,
        note : 'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        id : 2,
        nameStudent : 'Nguyễn Thị B',
        pseudoIdStudent : 'MSHV001',
        isAbsent : true,
        isMakeUpStudy : false,
    },
    {
        id : 3,
        nameStudent : 'Nguyễn Thị D',
        pseudoIdStudent : 'MSHV001',
        isAbsent : false,
        isMakeUpStudy : false,
    },
    {
        id : 4,
        nameStudent : 'Nguyễn Thị E',
        pseudoIdStudent : 'MSHV001',
        isAbsent : true,
        isMakeUpStudy : true,
    }
]