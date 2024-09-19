import React, { useEffect, useState } from "react";
import UserLayout from "../layout/UserLayout";
import { useNavigate } from "react-router-dom";
import { useUploadAvatarMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UploadAvatar = () => {
  const { user } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(null); // File object
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || "/images/default_avatar.jpg"
  );
  const navigate = useNavigate();
  const [uploadAvatar, { isLoading, error, isSuccess }] =
    useUploadAvatarMutation();

  useEffect(() => {
    if (error) {
      const errorMessage = error?.data?.message || "Failed to upload avatar.";
      toast.error(errorMessage);
    }
    if (isSuccess) {
      toast.success("Avatar uploaded successfully!");
      navigate("/me/profile");
    }
  }, [error, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (avatar) {
      const formData = new FormData();
      formData.append("avatar", avatar);
      uploadAvatar(formData);
    } else {
      toast.error("Please select a file.");
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        console.log("Reader result:", reader.result);
        setAvatarPreview(reader.result);
        setAvatar(file);
      }
    };

    reader.readAsDataURL(file);
  };
  console.log("Avatar preview state:", avatarPreview);
  return (
    <UserLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Upload Avatar</h2>
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <figure className="avatar item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="input-foam">
                  <label className="form-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    id="customFile"
                    accept="image/*"
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UploadAvatar;
