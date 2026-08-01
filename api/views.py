from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from api.models import (
    Role,
    Status,
    College,
    Department,
    Course,
    Student,
    Employee,
)
from .serializers import (
    RoleSerializer,
    StatusSerializer,
    CollegeSerializer,
    DepartmentSerializer,
    CourseSerializer,
    StudentSerializer,
    EmployeeSerializer,
)


class RoleListAPIView(generics.ListAPIView):
    queryset = Role.objects.all().order_by('id')
    serializer_class = RoleSerializer


class StatusListAPIView(generics.ListAPIView):
    queryset = Status.objects.all().order_by('id')
    serializer_class = StatusSerializer


class CollegeListAPIView(generics.ListAPIView):
    queryset = College.objects.all().order_by('college_name')
    serializer_class = CollegeSerializer


class DepartmentListAPIView(generics.ListAPIView):
    queryset = Department.objects.select_related('college').all().order_by('department_name')
    serializer_class = DepartmentSerializer


class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.select_related(
        'department',
        'department__college'
    ).all().order_by('course_name')
    serializer_class = CourseSerializer


class StudentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Student.objects.select_related(
        'course',
        'course__department',
        'course__department__college',
        'role',
        'status',
    ).all().order_by('last_name', 'first_name')
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        student_role, _ = Role.objects.get_or_create(
            role_name='Student',
            defaults={'description': 'Student borrower access'}
        )
        active_status, _ = Status.objects.get_or_create(
            status_name='Active'
        )

        serializer.save(
            role=student_role,
            status=active_status
        )


class StudentRetrieveUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.select_related(
        'course',
        'course__department',
        'course__department__college',
        'role',
        'status',
    ).all()
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print("DELETE ERROR LOG:", str(e))  # Lalabas ito sa terminal mo!
            return Response(
                {"error": f"Cannot delete student: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class StudentDeleteAPIView(generics.DestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class EmployeeListAPIView(generics.ListAPIView):
    queryset = Employee.objects.select_related(
        'department',
        'role',
        'status',
    ).all().order_by('last_name', 'first_name')
    serializer_class = EmployeeSerializer