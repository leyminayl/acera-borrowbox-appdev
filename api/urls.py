from django.urls import path
from .views import (
    RoleListAPIView,
    StatusListAPIView,
    CollegeListAPIView,
    DepartmentListAPIView,
    CourseListAPIView,
    StudentListCreateAPIView,
    StudentRetrieveUpdateAPIView,
    StudentDeleteAPIView,
    EmployeeListAPIView,
)

urlpatterns = [
    path('roles/', RoleListAPIView.as_view(), name='role-list'),
    path('status/', StatusListAPIView.as_view(), name='status-list'),
    path('colleges/', CollegeListAPIView.as_view(), name='college-list'),
    path('departments/', DepartmentListAPIView.as_view(), name='department-list'),
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('students/', StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentRetrieveUpdateAPIView.as_view(), name='student-detail-update'),
    path('students/<int:pk>/delete/', StudentDeleteAPIView.as_view(), name='student-delete'),
    path('employees/', EmployeeListAPIView.as_view(), name='employee-list'),
]