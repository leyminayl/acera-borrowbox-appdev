from rest_framework import serializers
from .models import (
    Role,
    Status,
    College,
    Department,
    Course,
    Student,
    Employee,
)


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.college_name', read_only=True)

    class Meta:
        model = Department
        fields = [
            'id',
            'department_name',
            'college',
            'college_name',
        ]


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source='department.department_name', read_only=True
    )
    college_name = serializers.CharField(
        source='department.college.college_name', read_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id',
            'course_name',
            'department',
            'department_name',
            'college_name',
        ]


class StudentSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    status_name = serializers.CharField(source='status.status_name', read_only=True)

    course_name = serializers.CharField(source='course.course_name', read_only=True)
    department_name = serializers.CharField(
        source='course.department.department_name', read_only=True
    )
    college_name = serializers.CharField(
        source='course.department.college.college_name', read_only=True
    )

    class Meta:
        model = Student
        fields = [
            'id',
            'student_number',
            'last_name',
            'first_name',
            'middle_initial',
            'birthdate',
            'gender',

            'course',
            'course_name',
            'department_name',
            'college_name',

            'region_code',
            'province_code',
            'city_municipality_code',
            'barangay_code',
            'street_address',

            'email',
            'phone',
            'photo',

            'role',
            'role_name',
            'status',
            'status_name',

            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'role': {'read_only': True},
            'status': {'read_only': True},
        }


class EmployeeSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    status_name = serializers.CharField(source='status.status_name', read_only=True)
    department_name = serializers.CharField(
        source='department.department_name', read_only=True
    )

    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_number',
            'last_name',
            'first_name',
            'middle_initial',
            'birthdate',
            'gender',

            'department',
            'department_name',
            'position',

            'region_code',
            'province_code',
            'city_municipality_code',
            'barangay_code',
            'street_address',

            'email',
            'phone',
            'photo',

            'role',
            'role_name',
            'status',
            'status_name',

            'created_at',
            'updated_at',
        ]