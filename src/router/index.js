import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from "../shared/components/main-layout.component.vue";
//import FinanceLayout from '../finance/components/finance-layout.vue'

// Pages
//import LoginPage from '../public/pages/login-page.vue'
//import DashboardPage from '../workspace/pages/dashboard-page.vue'
import Enrollment from "../enrollments/pages/enrollment-management.component.vue";
import Student from "../enrollments/pages/student-management.component.vue"
import Payment from "../billing/pages/payment.component.vue";
import Login from "../iam-user/pages/login.component.vue" ;
import SignUp from "../iam-user/pages/sign-up.component.vue";
import Organization from "../../workspace/pages/organization.component.vue";
import ExpensesPage from "../billing/pages/expenses-page.component.vue";
import TeacherPage from "../iam-user/pages/teacher.component.vue";
import PlantSelect from "../iam-user/pages/plan-select.component.vue";
import AttendancePageComponent from "../attendance/components/attendance-page.component.vue";
import Courses from "../scheduling/pages/courses-overview.component.vue";
import AcademicPeriod from "../enrollments/pages/academic-period-management.component.vue";
//import ExpensesPage from '../finance/pages/expenses-page.vue'
//import ReportsPage from '../finance/pages/reports-page.vue'
import Classrooms from "../scheduling/pages/classrooms-overview.component.vue";
import WeeklySchedules from "../scheduling/pages/weekly-schedules-overview.component.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: 'organization',
                children: [
                    {path: '', name: 'organization', component: Organization},
                    {path: 'periods', component: AcademicPeriod},
                    {path: 'teachers', component: TeacherPage},
                    {path: 'courses', component: Courses },
                    {path: 'classrooms', component: Classrooms },
                    {path: 'weekly-schedules', component: WeeklySchedules },
                ]
            },
            { path: '', redirect: '/organization', component: Organization },
            { path: 'payments', component: Payment },
            { path: 'attendance', component: AttendancePageComponent },
            { path: 'finance', component: ExpensesPage },
            { path: 'enrollment', component: Enrollment},
            { path: 'students', component: Student}
        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/signup',
        component: SignUp
    },
    {
        path: '/plantSelect',
        component: PlantSelect
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router