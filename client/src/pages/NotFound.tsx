import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-text">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Flex gap={10} justify="center">
          <Button type="primary" onClick={handleClick} className="notfound-btn">
            <ArrowLeftOutlined /> Go Back
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default NotFound;