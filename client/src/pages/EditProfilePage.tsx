import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
import userProPic from '../assets/User.png';
import CustomInput from '../components/CustomInput';
import { useForm } from 'react-hook-form';
import { profileInputFields } from '../constant/profile';
import { useGetSelfProfileQuery, useUpdateProfileMutation } from '../redux/features/authApi';
import Loader from '../components/Loader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { config } from '../utils/config';

const EditProfilePage = () => {
  const { data, isLoading } = useGetSelfProfileQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const toastId = toast.loading('Uploading Image...');

    const image = e.target.files?.[0] as any;
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', config.VITE_CLOUDINARY_UPLOAD_PRESET as string);
    data.append('cloud_name', config.VITE_CLOUDINARY_CLOUD_NAME as string);
    data.append('folder', 'inventory');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const res = await response.json();

      if (res.secure_url) {
        const imgUploadRes = await updateProfile({ avatar: res.secure_url }).unwrap();

        if (imgUploadRes.success) {
          toast.success('Profile updated successfully', { id: toastId });
        }
        toast.success('Image Uploaded Successfully, now save update!', { id: toastId });
      } else {
        toast.error('Failed to Upload Image', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to Upload Image', { id: toastId });
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Edit Profile</h1>
        <p>Update your profile information and profile picture</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={{ span: 24 }} lg={{ span: 8 }}>
          <div className="edit-profile-side-card">
            <Flex align="center" vertical>
              <div className="profile-avatar-card">
                <div className="profile-avatar-wrapper">
                  <img
                    src={data?.data?.avatar || userProPic}
                    alt="user"
                    className="profile-avatar"
                  />
                </div>
              </div>

              <div className="upload-btn-wrapper">
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  placeholder="Change Profile Picture"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                <label htmlFor="avatar" className="upload-profile-btn">
                  <UploadOutlined />
                  Change Profile Picture
                </label>
              </div>
            </Flex>
          </div>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 16 }}>
          <div className="edit-profile-form-card">
            <Flex justify="end" style={{ marginBottom: '1rem' }}>
              <Button type="default" onClick={() => navigate('/profile')} className="back-btn">
                <ArrowLeftOutlined /> Go Back
              </Button>
            </Flex>

            <EditProfileForm data={data?.data} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditProfilePage;

const EditProfileForm = ({ data }: { data: any }) => {
  const navigate = useNavigate();
  const [updateProfile] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: data });

  const onSubmit = async (data: any) => {
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.__v;

    for (const key in data) {
      if (data[key] === '' || data[key] === undefined || data[key] === null || !data[key]) {
        delete data[key];
      }
    }

    const toastId = toast.loading('Updating profile...');

    try {
      const res = await updateProfile(data).unwrap();

      if (res.success) {
        toast.success('Profile updated successfully', { id: toastId });
        navigate('/profile');
      }
    } catch (error) {
      toast.error('Failed to update profile', { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {profileInputFields.map((input) => (
        <CustomInput
          key={input.id}
          name={input.name}
          errors={errors}
          label={input.label}
          register={register}
          required={false}
        />
      ))}

      <Flex justify="center" style={{ marginTop: '1.5rem' }}>
        <Button htmlType="submit" type="primary" className="profile-action-btn">
          Update Profile
        </Button>
      </Flex>
    </form>
  );
};