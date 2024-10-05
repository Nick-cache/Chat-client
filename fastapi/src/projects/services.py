from src.services import Dal
from src.projects.models import Project, File


class ProjectDal(Dal):
    model = Project


class FileDal(Dal):
    model = File
