import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
} from "@/redux/features/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Camera, Edit, BookOpen } from "lucide-react";
import EnrolledCourses from "./EnrolledCourses";
import { BackButton } from "@/components/BackButton";
import axios from "axios";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile_no: "",
    full_name: "",
    avatar: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const imgbbApiKey = "7d08988bd7149e734475cafb1b06041c";

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        mobile_no: user.mobile_no || "",
        full_name: user.full_name || "",
        avatar: user.avatar || null,
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload to ImgBB
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );

      setFormData((prev) => ({
        ...prev,
        avatar: res.data.data.url,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      // Revert preview if upload fails
      setAvatarPreview(user?.avatar || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = {
      username: formData.username,
      email: formData.email,
      mobile_no: formData.mobile_no,
      full_name: formData.full_name,
      avatar: formData.avatar,
    };

    dispatch(updateUserProfile(formDataToSend)).then(() => {
      setEditMode(false);
    });
  };

  return (
    <div className="container mx-auto my-8 px-4 min-h-[600px]">
      <BackButton />
      <div className="max-w-6xl mx-auto my-8 px-4 min-h-[500px]">
        {/* Tabs Navigation */}
        <div className="flex border-b mb-8">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "courses"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="h-4 w-4" />
            My Courses
          </button>
        </div>

        {activeTab === "profile" ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Card */}
            <Card className="w-full md:w-1/3 p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                      <User className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                  {editMode && (
                    <label
                      htmlFor="avatar"
                      className={`absolute bottom-0 right-0 bg-white border border-gray-300 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors ${
                        uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 text-gray-600" />
                      )}
                      <input
                        id="avatar"
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadingImage || loading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 border border-gray-300 text-gray-800">
                  <User className="h-3 w-3 mr-1" />
                  {user?.role}
                </div>
                <div className="mt-2 text-center space-y-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user?.full_name || "User"}
                  </h2>
                  <p className="text-gray-600">@{user?.username}</p>
                </div>
              </div>
            </Card>

            {/* Details Card */}
            <Card className="w-full md:w-2/3">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">
                    Profile Information
                  </CardTitle>
                  {!editMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditMode(false);
                        setAvatarPreview(user?.avatar || null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="username"
                          className="text-sm font-medium text-gray-600"
                        >
                          Username
                        </label>
                        {editMode ? (
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading || uploadingImage}
                          />
                        ) : (
                          <p className="text-sm p-2 bg-gray-50 rounded-md">
                            @{user?.username}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="full_name"
                          className="text-sm font-medium text-gray-600"
                        >
                          Full Name
                        </label>
                        {editMode ? (
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            disabled={loading || uploadingImage}
                          />
                        ) : (
                          <p className="text-sm p-2 bg-gray-50 rounded-md">
                            {user?.full_name || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-600"
                        >
                          Email
                        </label>
                        {editMode ? (
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading || uploadingImage}
                          />
                        ) : (
                          <p className="text-sm p-2 bg-gray-50 rounded-md">
                            {user?.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="mobile_no"
                          className="text-sm font-medium text-gray-600"
                        >
                          Phone Number
                        </label>
                        {editMode ? (
                          <Input
                            id="mobile_no"
                            name="mobile_no"
                            value={formData.mobile_no}
                            onChange={handleChange}
                            disabled={loading || uploadingImage}
                          />
                        ) : (
                          <p className="text-sm p-2 bg-gray-50 rounded-md">
                            {user?.mobile_no || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditMode(false);
                            setAvatarPreview(user?.avatar || null);
                          }}
                          disabled={loading || uploadingImage}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading || uploadingImage}
                        >
                          {loading || uploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              {uploadingImage ? "Uploading..." : "Saving..."}
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <EnrolledCourses />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
