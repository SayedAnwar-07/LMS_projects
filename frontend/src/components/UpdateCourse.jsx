import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  fetchCourseById,
  updateCourse,
  fetchCategories,
  selectAllCategories,
} from "@/redux/features/courseSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, AlertTriangle } from "lucide-react";
import { BackButton } from "./BackButton";

export function UpdateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const categories = useSelector(selectAllCategories) || [];
  const [loading, setLoading] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const imgbbApiKey = "7d08988bd7149e734475cafb1b06041c";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId) {
          throw new Error("Course ID is missing");
        }

        await dispatch(fetchCategories());
        const course = await dispatch(fetchCourseById(courseId)).unwrap();

        if (!course) {
          throw new Error("Course not found");
        }

        if (course.banner) {
          setCurrentBanner(course.banner);
        }

        reset({
          title: course.title,
          description: course.description,
          price: course.price,
          discount_price: course.discount_price,
          duration: course.duration,
          start_date: course.start_date?.split("T")[0],
          is_featured: course.is_featured,
          level: course.level,
          category_id: course.category?.id,
          what_you_will_learn: Array.isArray(course.what_you_will_learn)
            ? course.what_you_will_learn
            : JSON.parse(course.what_you_will_learn || "[]"),
          requirements: Array.isArray(course.requirements)
            ? course.requirements
            : JSON.parse(course.requirements || "[]"),
          banner: course.banner,
        });
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message || "Failed to load course data");
        toast.error(error.message || "Failed to load course data");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, courseId, reset, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCurrentBanner(previewUrl);
    }
  };

  const uploadToImgbb = async (file) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      return res.data.data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed");
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (image) {
        const bannerUrl = await uploadToImgbb(image);
        data.banner = bannerUrl;
      } else if (!currentBanner) {
        data.banner = null;
      }

      // Prepare the payload
      const payload = {
        ...data,
        what_you_will_learn: JSON.stringify(data.what_you_will_learn || []),
        requirements: JSON.stringify(data.requirements || []),
      };

      await dispatch(
        updateCourse({
          id: courseId,
          data: payload,
        })
      ).unwrap();

      toast.success("Course updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const addLearnItem = () => {
    const currentItems = watch("what_you_will_learn") || [];
    if (currentItems.length < 5) {
      setValue("what_you_will_learn", [...currentItems, ""]);
    }
  };

  const removeLearnItem = (index) => {
    const currentItems = watch("what_you_will_learn") || [];
    if (currentItems.length > 1) {
      setValue(
        "what_you_will_learn",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const addRequirementItem = () => {
    const currentItems = watch("requirements") || [];
    if (currentItems.length < 5) {
      setValue("requirements", [...currentItems, ""]);
    }
  };

  const removeRequirementItem = (index) => {
    const currentItems = watch("requirements") || [];
    if (currentItems.length > 1) {
      setValue(
        "requirements",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto pb-8">
      <BackButton />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Update Course</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Loading Course</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Course Title
                  </label>
                  <Input
                    placeholder="Enter course title"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Category</label>
                  <Select
                    onValueChange={(value) =>
                      setValue("category_id", Number(value))
                    }
                    defaultValue={watch("category_id")?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Level</label>
                  <Select
                    onValueChange={(value) => setValue("level", value)}
                    defaultValue={watch("level")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* banner */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Course Banner ( jpg/png/webp )
                  </label>
                  <Input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 1200x600 pixels
                  </p>

                  {currentBanner && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Image Preview:</p>
                        <div className="flex gap-2">
                          {image && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setImage(null);
                                const originalBanner = watch("banner");
                                setCurrentBanner(originalBanner || null);
                                document.getElementById("banner-upload").value =
                                  "";
                              }}
                            >
                              <X className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border">
                        <img
                          src={currentBanner}
                          alt="Course banner preview"
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            if (currentBanner.startsWith("blob:")) {
                              URL.revokeObjectURL(currentBanner);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* level */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price", {
                      valueAsNumber: true,
                      min: { value: 0, message: "Price must be positive" },
                    })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Discount Price ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    {...register("discount_price", {
                      valueAsNumber: true,
                      min: { value: 0, message: "Discount must be positive" },
                    })}
                  />
                  {errors.discount_price && (
                    <p className="text-sm text-red-500">
                      {errors.discount_price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Duration</label>
                  <Input
                    placeholder="e.g., 6 weeks, 3 months"
                    {...register("duration", {
                      required: "Duration is required",
                    })}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Start Date (Optional)
                  </label>
                  <Input
                    type="date"
                    {...register("start_date")}
                    value={watch("start_date") || ""}
                  />
                </div>

                <div className="flex items-center space-x-3 rounded-md border p-4">
                  <input
                    type="checkbox"
                    checked={watch("is_featured")}
                    onChange={(e) => setValue("is_featured", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="space-y-1 leading-none">
                    <label className="block text-sm font-medium">
                      Featured Course
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Check this box to feature this course on the homepage
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Course Description
                </label>
                <Textarea
                  placeholder="Describe your course in detail..."
                  className="min-h-[120px]"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">What You Will Learn</h3>
                <p className="text-sm text-muted-foreground">
                  List the key learning outcomes (2-5 items)
                </p>

                {(watch("what_you_will_learn") || []).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder={`Learning point ${index + 1}`}
                        {...register(`what_you_will_learn.${index}`, {
                          minLength: {
                            value: 5,
                            message: "Minimum 5 characters",
                          },
                        })}
                      />
                      {errors.what_you_will_learn?.[index] && (
                        <p className="text-sm text-red-500">
                          {errors.what_you_will_learn[index].message}
                        </p>
                      )}
                    </div>
                    {(watch("what_you_will_learn") || []).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLearnItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {(watch("what_you_will_learn") || []).length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addLearnItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Learning Point
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  List any prerequisites (2-5 items)
                </p>

                {(watch("requirements") || []).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder={`Requirement ${index + 1}`}
                        {...register(`requirements.${index}`, {
                          minLength: {
                            value: 5,
                            message: "Minimum 5 characters",
                          },
                        })}
                      />
                      {errors.requirements?.[index] && (
                        <p className="text-sm text-red-500">
                          {errors.requirements[index].message}
                        </p>
                      )}
                    </div>
                    {(watch("requirements") || []).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirementItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {(watch("requirements") || []).length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addRequirementItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {loading || uploadingImage ? "Updating..." : "Update Course"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
