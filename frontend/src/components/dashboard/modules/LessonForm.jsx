import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createLesson,
  updateLesson,
  selectCurrentItem,
  clearCurrentItem,
} from "@/redux/features/curriculumSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  video: z.string().min(1, "Video URL is required"),
  duration: z.string().min(1, "Duration is required"),
  is_preview: z.boolean().default(false),
  section: z.number().int().positive(),
  course: z.number().int().positive(),
});

const LessonForm = ({ onClose, onSaved }) => {
  const dispatch = useDispatch();
  const currentItem = useSelector(selectCurrentItem);
  const isEdit = Boolean(currentItem?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: currentItem?.title || "",
      description: currentItem?.description || "",
      video: currentItem?.video || "",
      duration: currentItem?.duration || "00:00",
      is_preview: currentItem?.is_preview || false,
      section: currentItem?.section || currentItem?.sectionId || null,
      course: currentItem?.course || null,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(updateLesson({ id: currentItem.id, data })).unwrap();
        toast.success("Lesson updated successfully");
      } else {
        await dispatch(createLesson(data)).unwrap();
        toast.success("Lesson created successfully");
      }

      onClose();
      onSaved?.();
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to save lesson");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Lesson" : "Create New Lesson"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                placeholder="Enter lesson title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm font-medium text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (MM:SS)</Label>
              <Input
                id="duration"
                placeholder="00:00"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm font-medium text-destructive">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter lesson description"
              className="min-h-[100px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video URL</Label>
            <Input
              id="video"
              placeholder="Enter video URL"
              {...register("video")}
            />
            {errors.video && (
              <p className="text-sm font-medium text-destructive">
                {errors.video.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is_preview" {...register("is_preview")} />
            <Label htmlFor="is_preview">Mark as preview lesson</Label>
          </div>

          <input type="hidden" {...register("section")} />
          <input type="hidden" {...register("course")} />

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonForm;
