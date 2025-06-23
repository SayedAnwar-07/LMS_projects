import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Loader2,
  ChevronRight,
  FileText,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchPaymentHistory,
  selectPaymentHistory,
  selectPaymentHistoryLoading,
  selectPaymentHistoryError,
} from "@/redux/features/paymentSlice";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paymentHistory = useSelector(selectPaymentHistory);
  const loading = useSelector(selectPaymentHistoryLoading);
  const error = useSelector(selectPaymentHistoryError);
  const [currentPage, setCurrentPage] = useState(1);

  // Access the results array from the paginated response
  const enrollments = paymentHistory?.results || [];
  const totalItems = paymentHistory?.count || 0;
  const itemsPerPage = 10; // Adjust based on your backend pagination size

  useEffect(() => {
    dispatch(fetchPaymentHistory(currentPage));
  }, [dispatch, currentPage]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Unknown date";
    }
  };

  const getProgressBar = (progress) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const getCompletionStatus = (isCompleted) => {
    return (
      <div className="flex items-center">
        {isCompleted ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span>Completed</span>
          </>
        ) : (
          <>
            <span>In Progress</span>
          </>
        )}
      </div>
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="mx-auto w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 mb-4">
          Error loading payment history: {error || "Unknown error occurred"}
        </p>
        <Button
          onClick={() => dispatch(fetchPaymentHistory(currentPage))}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          No payment history
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't made any payments yet.
        </p>
        <Button
          onClick={() => navigate("/courses")}
          variant="outline"
          className="mt-4"
        >
          Browse Courses
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          entries
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Course
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.course}
                      </div>
                      <div className="text-sm text-gray-500">
                        {enrollment.student}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enrollment.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getProgressBar(enrollment.progress_bar)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCompletionStatus(enrollment.completion_status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(enrollment.created_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => navigate(`/my-courses/${enrollment.id}`)}
                  >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      View
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={
              enrollments.length < itemsPerPage || currentPage >= totalPages
            }
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center px-4 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
