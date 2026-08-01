from django.core.management.base import BaseCommand
from api.models import (
    Role,
    Status,
    College,
    Department,
    Course,
    Student,
    Employee,
)


class Command(BaseCommand):
    help = "Insert BorrowBox demo seed data"

    def handle(self, *args, **kwargs):

        # -------------------------
        # ROLES
        # -------------------------
        roles = {
            "Admin": "Full system access",
            "Staff": "Operational staff access",
            "Student": "Student borrower access",
            "Supervisor": "Supervisory access",
        }

        role_objs = {}
        for role_name, description in roles.items():
            obj, created = Role.objects.get_or_create(
                role_name=role_name,
                defaults={"description": description}
            )
            role_objs[role_name] = obj

        self.stdout.write(self.style.SUCCESS("Roles inserted"))

        # -------------------------
        # STATUS
        # -------------------------
        statuses = ["Active", "Inactive", "Suspended", "Archived"]

        status_objs = {}
        for status_name in statuses:
            obj, created = Status.objects.get_or_create(
                status_name=status_name
            )
            status_objs[status_name] = obj

        self.stdout.write(self.style.SUCCESS("Status inserted"))

        # -------------------------
        # COLLEGES
        # -------------------------
        colleges = ["College of Computer Studies", "College of Business Administration"]

        college_objs = {}
        for college_name in colleges:
            obj, created = College.objects.get_or_create(
                college_name=college_name
            )
            college_objs[college_name] = obj

        self.stdout.write(self.style.SUCCESS("Colleges inserted"))

        # -------------------------
        # DEPARTMENTS
        # -------------------------
        departments = [
            {
                "department_name": "Information Technology Department",
                "college": "College of Computer Studies",
            },
            {
                "department_name": "Computer Science Department",
                "college": "College of Computer Studies",
            },
            {
                "department_name": "Information Systems Department",
                "college": "College of Computer Studies",
            },
            {
                "department_name": "Management Department",
                "college": "College of Business Administration",
            },
            {
                "department_name": "Library",
                "college": None,
            },
            {
                "department_name": "Human Resources",
                "college": None,
            },
            {
                "department_name": "IT Support Office",
                "college": None,
            },
        ]

        department_objs = {}
        for d in departments:
            college_obj = college_objs[d["college"]] if d["college"] else None

            obj, created = Department.objects.get_or_create(
                department_name=d["department_name"],
                college=college_obj,
            )
            key = f"{d['department_name']}|{d['college']}"
            department_objs[key] = obj

        self.stdout.write(self.style.SUCCESS("Departments inserted"))

        # -------------------------
        # COURSES
        # -------------------------
        courses = [
            {
                "course_name": "BS Information Technology",
                "department_name": "Information Technology Department",
                "college_name": "College of Computer Studies",
            },
            {
                "course_name": "BS Computer Science",
                "department_name": "Computer Science Department",
                "college_name": "College of Computer Studies",
            },
            {
                "course_name": "BS Information Systems",
                "department_name": "Information Systems Department",
                "college_name": "College of Computer Studies",
            },
            {
                "course_name": "BS Business Administration",
                "department_name": "Management Department",
                "college_name": "College of Business Administration",
            },
        ]

        course_objs = {}
        for c in courses:
            dept_key = f"{c['department_name']}|{c['college_name']}"
            department_obj = department_objs[dept_key]

            obj, created = Course.objects.get_or_create(
                course_name=c["course_name"],
                department=department_obj,
            )
            course_objs[c["course_name"]] = obj

        self.stdout.write(self.style.SUCCESS("Courses inserted"))

        # -------------------------
        # STUDENTS (NCR only)
        # -------------------------
        students = [
            {
                "student_number": "2026-0001",
                "last_name": "Dela Cruz",
                "first_name": "Juan",
                "middle_initial": "S",
                "birthdate": "2004-03-15",
                "gender": "Male",
                "course_name": "BS Information Systems",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137404000",
                "barangay_code": "137404021",
                "street_address": "12 Maginhawa Street",
                "email": "juan.delacruz@example.com",
                "phone": "09170000001",
            },
            {
                "student_number": "2026-0002",
                "last_name": "Reyes",
                "first_name": "Ana",
                "middle_initial": "M",
                "birthdate": "2005-07-21",
                "gender": "Female",
                "course_name": "BS Information Technology",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137405000",
                "barangay_code": "137405011",
                "street_address": "45 N. Domingo Street",
                "email": "ana.reyes@example.com",
                "phone": "09170000002",
            },
            {
                "student_number": "2026-0003",
                "last_name": "Garcia",
                "first_name": "Mark",
                "middle_initial": "T",
                "birthdate": "2004-11-02",
                "gender": "Male",
                "course_name": "BS Computer Science",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137401000",
                "barangay_code": "137401001",
                "street_address": "88 Taft Avenue",
                "email": "mark.garcia@example.com",
                "phone": "09170000003",
            },
            {
                "student_number": "2026-0004",
                "last_name": "Santos",
                "first_name": "Liza",
                "middle_initial": "A",
                "birthdate": "2003-09-10",
                "gender": "Female",
                "course_name": "BS Business Administration",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137602000",
                "barangay_code": "137602019",
                "street_address": "101 Libertad Street",
                "email": "liza.santos@example.com",
                "phone": "09170000004",
            },
            {
                "student_number": "2026-0005",
                "last_name": "Torres",
                "first_name": "Leo",
                "middle_initial": "P",
                "birthdate": "2005-01-28",
                "gender": "Male",
                "course_name": "BS Information Technology",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137607000",
                "barangay_code": "137607014",
                "street_address": "23 C5 Road",
                "email": "leo.torres@example.com",
                "phone": "09170000005",
            },
        ]

        for s in students:
            Student.objects.get_or_create(
                student_number=s["student_number"],
                defaults={
                    "last_name": s["last_name"],
                    "first_name": s["first_name"],
                    "middle_initial": s["middle_initial"],
                    "birthdate": s["birthdate"],
                    "gender": s["gender"],
                    "course": course_objs[s["course_name"]],
                    "region_code": s["region_code"],
                    "province_code": s["province_code"],
                    "city_municipality_code": s["city_municipality_code"],
                    "barangay_code": s["barangay_code"],
                    "street_address": s["street_address"],
                    "email": s["email"],
                    "phone": s["phone"],
                    "role": role_objs["Student"],
                    "status": status_objs["Active"],
                }
            )

        self.stdout.write(self.style.SUCCESS("Students inserted"))

        # -------------------------
        # EMPLOYEES (NCR only)
        # -------------------------
        employees = [
            {
                "employee_number": "EMP-0001",
                "last_name": "Lopez",
                "first_name": "Maria",
                "middle_initial": "L",
                "birthdate": "1995-04-12",
                "gender": "Female",
                "department_name": "Library",
                "department_college": None,
                "position": "Library Staff",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137404000",
                "barangay_code": "137404021",
                "street_address": "7 Katipunan Avenue",
                "email": "maria.lopez@example.com",
                "phone": "09980000001",
                "role_name": "Staff",
            },
            {
                "employee_number": "EMP-0002",
                "last_name": "Mendoza",
                "first_name": "Pedro",
                "middle_initial": "R",
                "birthdate": "1989-08-03",
                "gender": "Male",
                "department_name": "IT Support Office",
                "department_college": None,
                "position": "System Administrator",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137401000",
                "barangay_code": "137401001",
                "street_address": "54 España Boulevard",
                "email": "pedro.mendoza@example.com",
                "phone": "09980000002",
                "role_name": "Admin",
            },
            {
                "employee_number": "EMP-0003",
                "last_name": "Castro",
                "first_name": "Carlo",
                "middle_initial": "T",
                "birthdate": "1992-12-19",
                "gender": "Male",
                "department_name": "Human Resources",
                "department_college": None,
                "position": "HR Supervisor",
                "region_code": "130000000",
                "province_code": "133900000",
                "city_municipality_code": "137603000",
                "barangay_code": "137603026",
                "street_address": "9 Shaw Boulevard",
                "email": "carlo.castro@example.com",
                "phone": "09980000003",
                "role_name": "Supervisor",
            },
        ]

        for e in employees:
            dept_key = f"{e['department_name']}|{e['department_college']}"
            Employee.objects.get_or_create(
                employee_number=e["employee_number"],
                defaults={
                    "last_name": e["last_name"],
                    "first_name": e["first_name"],
                    "middle_initial": e["middle_initial"],
                    "birthdate": e["birthdate"],
                    "gender": e["gender"],
                    "department": department_objs[dept_key],
                    "position": e["position"],
                    "region_code": e["region_code"],
                    "province_code": e["province_code"],
                    "city_municipality_code": e["city_municipality_code"],
                    "barangay_code": e["barangay_code"],
                    "street_address": e["street_address"],
                    "email": e["email"],
                    "phone": e["phone"],
                    "role": role_objs[e["role_name"]],
                    "status": status_objs["Active"],
                }
            )

        self.stdout.write(self.style.SUCCESS("Employees inserted"))
        self.stdout.write(self.style.SUCCESS("DONE"))