import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Bookmark,
  MoreVertical,
  Trash2,
  Eye,
  SquarePen,
  BookText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCourse } from "@/redux/features/courseSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllStudentsTable = ({ courses }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleView = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEdit = (courseId) => {
    navigate(`/dashboard/courses/${courseId}/edit`);
  };

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCourse(courseToDelete)).unwrap();
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete course");
    } finally {
      setOpenDeleteDialog(false);
      setCourseToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>Overview of your courses</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <span className="truncate max-w-[180px]">
                          {course.title || "Untitled Course"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={course.is_active ? "default" : "secondary"}
                      >
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{course.students || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.assignments ? (
                        <div className="flex items-center">
                          <Bookmark className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{course.assignments}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(course.id)}
                          >
                            <Eye className="text-black w-5 h-5" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(course.id)}
                          >
                            <SquarePen className="text-black w-5 h-5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/dashboard/courses/${course.id}/curriculum`
                              )
                            }
                          >
                            <BookText className="text-black w-5 h-5" />
                            Curriculum
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(course.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="text-black w-5 h-5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No courses found</p>
              <Button variant="ghost" className="mt-2">
                Create a new course
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AllStudentsTable;
