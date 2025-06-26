import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  createCourse,
  fetchCategories,
  selectAllCategories,
} from "../redux/features/courseSlice";
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
import { Plus, X } from "lucide-react";
import { BackButton } from "./BackButton";
import axios from "axios";

// Form schema validation
const courseFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  discount_price: z.number().min(0).optional().nullable(),
  duration: z.string().min(2, {
    message: "Duration must be at least 2 characters.",
  }),
  start_date: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  category_id: z.number().min(1, {
    message: "Please select a category.",
  }),
  what_you_will_learn: z
    .array(z.string().min(5, "Each item must be at least 5 characters"))
    .min(2, "At least 2 items are required")
    .max(5, "Maximum 5 items allowed"),
  requirements: z
    .array(z.string().min(5, "Each item must be at least 5 characters"))
    .min(2, "At least 2 items are required")
    .max(5, "Maximum 5 items allowed"),
});

export function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [imgURL, setImgURL] = useState("");

  const imgbbApiKey = "7d08988bd7149e734475cafb1b06041c";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImgURL(previewUrl);
    }
  };

  const uploadToImgbb = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      console.log("Image uploaded:", res.data.data.url);
      setImgURL(res.data.data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      banner: undefined,
      price: 0,
      discount_price: null,
      duration: "",
      start_date: null,
      is_featured: false,
      level: "Beginner",
      category_id: 0,
      what_you_will_learn: [""],
      requirements: [""],
    },
  });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [dispatch]);

  console.log(imgURL);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await uploadToImgbb();

      const formData = new FormData();

      // Append all required fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("duration", data.duration);
      formData.append("level", data.level);
      formData.append("banner", imgURL);
      formData.append("category_id", String(data.category_id));
      formData.append("is_featured", String(data.is_featured));

      console.log("Data", formData);

      // Handle optional fields
      if (data.discount_price) {
        formData.append("discount_price", String(data.discount_price));
      }
      if (data.start_date) {
        formData.append("start_date", data.start_date);
      }

      // Properly stringify array fields
      const learnItems = data.what_you_will_learn.filter(
        (item) => item.trim() !== ""
      );
      const requirementItems = data.requirements.filter(
        (item) => item.trim() !== ""
      );

      formData.append("what_you_will_learn", JSON.stringify(learnItems));
      formData.append("requirements", JSON.stringify(requirementItems));

      await dispatch(createCourse(formData)).unwrap();
      toast.success("Course created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Full error:", error);

      // Improved error handling to show backend validation messages
      if (error.response?.data) {
        const errorMessages = Object.values(error.response.data).flat();
        toast.error(errorMessages.join(", ") || "Failed to create course");
      } else {
        toast.error(error.message || "Failed to create course");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for dynamic arrays
  const addLearnItem = () => {
    const currentItems = watch("what_you_will_learn");
    if (currentItems.length < 5) {
      setValue("what_you_will_learn", [...currentItems, ""]);
    }
  };

  const removeLearnItem = (index) => {
    const currentItems = watch("what_you_will_learn");
    if (currentItems.length > 1) {
      setValue(
        "what_you_will_learn",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const addRequirementItem = () => {
    const currentItems = watch("requirements");
    if (currentItems.length < 5) {
      setValue("requirements", [...currentItems, ""]);
    }
  };

  const removeRequirementItem = (index) => {
    const currentItems = watch("requirements");
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
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Course Title
                </label>
                <Input
                  placeholder="Enter course title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
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
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-red-500">
                    {errors.category_id.message}
                  </p>
                )}
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
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>
              {/* banner */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Course Banner
                </label>
                <Input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 1200x600 pixels
                </p>
                {errors.banner && (
                  <p className="text-sm text-red-500">
                    {errors.banner.message}
                  </p>
                )}
                {imgURL && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Image Preview:</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImage(null);
                          setImgURL("");
                          document.getElementById("banner-upload").value = "";
                        }}
                      >
                        <X className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                    <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border">
                      <img
                        src={imgURL}
                        alt="Course banner preview"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          if (imgURL.startsWith("blob:")) {
                            URL.revokeObjectURL(imgURL);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Price ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
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
                  {...register("discount_price", { valueAsNumber: true })}
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
                  {...register("duration")}
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
                {errors.start_date && (
                  <p className="text-sm text-red-500">
                    {errors.start_date.message}
                  </p>
                )}
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
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* What You Will Learn Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What You Will Learn</h3>
              <p className="text-sm text-muted-foreground">
                List the key learning outcomes (2-5 items)
              </p>

              {watch("what_you_will_learn")?.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Learning point ${index + 1}`}
                      {...register(`what_you_will_learn.${index}`)}
                    />
                    {errors.what_you_will_learn?.[index] && (
                      <p className="text-sm text-red-500">
                        {errors.what_you_will_learn[index].message}
                      </p>
                    )}
                  </div>
                  {watch("what_you_will_learn").length > 1 && (
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

              {watch("what_you_will_learn").length < 5 && (
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
              {errors.what_you_will_learn?.message && (
                <p className="text-sm text-red-500">
                  {errors.what_you_will_learn.message}
                </p>
              )}
            </div>

            {/* Requirements Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Requirements</h3>
              <p className="text-sm text-muted-foreground">
                List any prerequisites (2-5 items)
              </p>

              {watch("requirements")?.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Requirement ${index + 1}`}
                      {...register(`requirements.${index}`)}
                    />
                    {errors.requirements?.[index] && (
                      <p className="text-sm text-red-500">
                        {errors.requirements[index].message}
                      </p>
                    )}
                  </div>
                  {watch("requirements").length > 1 && (
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

              {watch("requirements").length < 5 && (
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
              {errors.requirements?.message && (
                <p className="text-sm text-red-500">
                  {errors.requirements.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
