import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createSection,
  updateSection,
  selectCurrentItem,
  clearCurrentItem,
} from "@/redux/features/curriculumSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  course: z.number().int().positive(),
});

const SectionForm = ({ onClose, courseId }) => {
  const dispatch = useDispatch();
  const currentItem = useSelector(selectCurrentItem);
  const isEdit = Boolean(currentItem);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: currentItem?.title || "",
      course: Number(courseId),
    },
  });

  const onSubmit = async (values) => {
    console.log("Submitting section:", values);
    try {
      if (isEdit) {
        await dispatch(
          updateSection({ id: currentItem.id, data: values })
        ).unwrap();
        toast.success("Section updated successfully");
      } else {
        await dispatch(createSection(values)).unwrap();
        toast.success("Section created successfully");
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to save section");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Section" : "Create New Section"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Section Title
            </label>
            <Input
              id="title"
              placeholder="Enter section title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <input
            type="hidden"
            {...register("course", { valueAsNumber: true })}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                dispatch(clearCurrentItem());
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
