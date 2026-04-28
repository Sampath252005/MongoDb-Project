import { EditFilled, EditOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
import userProPic from '../assets/User.png';
import Loader from '../components/Loader';
import { useGetSelfProfileQuery } from '../redux/features/authApi';
import { profileKeys } from '../constant/profile';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { data, isLoading } = useGetSelfProfileQuery(undefined);

  if (isLoading) return <Loader />;

  return (
    <div className="profile-page">
      <div className="page-header profile-header">
        <h1>My Profile</h1>
        <p>View and manage your account information</p>
      </div>

      <Flex vertical align="center" className="profile-layout">
        <div className="profile-avatar-card">
          <div className="profile-avatar-wrapper">
            <img
              src={data?.data?.avatar || userProPic}
              alt="user"
              className="profile-avatar"
            />
          </div>
        </div>

        <Flex justify="center" style={{ margin: '1.2rem 0' }}>
          <Flex gap={12} wrap="wrap" justify="center">
            <Link to="/edit-profile">
              <Button type="primary" className="profile-action-btn">
                <EditOutlined />
                Edit Profile
              </Button>
            </Link>

            <Link to="/change-password">
              <Button type="primary" className="profile-action-btn secondary-profile-btn">
                <EditFilled />
                Change Password
              </Button>
            </Link>
          </Flex>
        </Flex>

        <Row style={{ width: '100%' }} justify="center">
          <Col xs={{ span: 24 }} lg={{ span: 16 }}>
            <div className="profile-info-card">
              {profileKeys.map((key) => (
                <ProfileInfoItems
                  key={key.keyName}
                  keyName={key.keyName}
                  value={data?.data[key.keyName]}
                />
              ))}
            </div>
          </Col>
        </Row>
      </Flex>
    </div>
  );
};

export default ProfilePage;

const ProfileInfoItems = ({ keyName, value }: { keyName: string; value: string }) => {
  return (
    <Flex className="profile-info-item" gap={24}>
      <h2>{keyName}</h2>
      <h3>{value || 'N/A'}</h3>
    </Flex>
  );
};